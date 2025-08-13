import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useShopify";
import { useAuthUser, useUploadImage, useCreateCanvasProject } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { Upload, Heart, Star } from "lucide-react";

// Sample layout, size, and frame data
const layouts = [
  { id: "portrait", name: "Portrait", image: "/placeholder.svg", description: "Classic vertical layout" },
  { id: "landscape", name: "Landscape", image: "/placeholder.svg", description: "Wide horizontal layout" },
  { id: "square", name: "Square", image: "/placeholder.svg", description: "Perfect square format" },
];

const sizes = [
  { id: "small", name: "Small", dimensions: "12\" x 16\"", price: 49.99 },
  { id: "medium", name: "Medium", dimensions: "16\" x 20\"", price: 79.99 },
  { id: "large", name: "Large", dimensions: "20\" x 24\"", price: 129.99 },
  { id: "xl", name: "Extra Large", dimensions: "24\" x 30\"", price: 179.99 },
];

const frames = [
  { id: "none", name: "No Frame", price: 0, description: "Canvas only" },
  { id: "black", name: "Black Frame", price: 29.99, description: "Elegant black wood frame" },
  { id: "white", name: "White Frame", price: 29.99, description: "Clean white wood frame" },
  { id: "natural", name: "Natural Wood", price: 39.99, description: "Natural oak wood frame" },
];

export default function CreateCanvasPage() {
  const [selectedLayout, setSelectedLayout] = useState("portrait");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: user, isLoading: userLoading } = useAuthUser();
  const { addToCart } = useCart();
  const uploadImage = useUploadImage();
  const createCanvasProject = useCreateCanvasProject();

  const currentSize = sizes.find(s => s.id === selectedSize);
  const currentFrame = frames.find(f => f.id === selectedFrame);
  const totalPrice = (currentSize?.price || 0) + (currentFrame?.price || 0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("Please sign in to upload images");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    uploadImage.mutate(file, {
      onSuccess: (url) => {
        setUploadedImage(url);
        toast.success("Image uploaded successfully!");
      },
    });
  };

  const handleSaveProject = () => {
    if (!user) {
      toast.error("Please sign in to save projects");
      return;
    }

    if (!uploadedImage || !title.trim()) {
      toast.error("Please add a title and upload an image");
      return;
    }

    createCanvasProject.mutate({
      title: title.trim(),
      image_url: uploadedImage,
      layout: selectedLayout,
      size: selectedSize,
      frame: selectedFrame,
      price: totalPrice,
    });
  };

  const handleAddToCart = () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    const customProduct = {
      id: `custom-canvas-${Date.now()}`,
      title: `Custom Canvas Print - ${title || 'Untitled'}`,
      price: totalPrice,
      images: [{ src: uploadedImage, alt: "Custom Canvas" }],
      description: `${currentSize?.dimensions} ${currentFrame?.name !== "No Frame" ? `with ${currentFrame?.name}` : ""}`,
      variants: [
        {
          id: `variant-${Date.now()}`,
          title: "Custom Canvas",
          price: totalPrice,
          available: true,
          inventoryQuantity: 999,
        }
      ],
    };

    addToCart.mutate(
      { 
        variantId: customProduct.variants[0].id,
        quantity: 1 
      },
      {
        onSuccess: () => {
          toast.success("Custom canvas added to cart!");
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canvas Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={selectedLayout === "portrait" ? 3/4 : selectedLayout === "landscape" ? 4/3 : 1}>
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden rounded-lg">
                  {uploadedImage ? (
                    <img 
                      src={uploadedImage} 
                      alt="Canvas preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "Upload your image to see preview"
                  )}
                </div>
              </AspectRatio>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="canvas-title">Canvas Title</Label>
                <Input
                  id="canvas-title"
                  placeholder="Enter a title for your canvas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  {uploadImage.isPending ? "Uploading..." : "Click to upload your image"}
                </p>
                {uploadImage.isPending && <Skeleton className="h-2 w-full mt-2" />}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {!user && (
                <p className="text-sm text-muted-foreground">
                  Please sign in to upload images and save projects
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customization Options */}
        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Custom Canvas Print
                <Button variant="ghost" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(1,234 reviews)</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary mb-4">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-muted-foreground">
                Create your own custom canvas print with premium materials and professional printing.
              </p>
            </CardContent>
          </Card>

          {/* Layout Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedLayout === layout.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedLayout(layout.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{layout.name}</p>
                        <p className="text-sm text-muted-foreground">{layout.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Size Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {sizes.map((size) => (
                  <div
                    key={size.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedSize === size.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedSize(size.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{size.name}</p>
                        <p className="text-sm text-muted-foreground">{size.dimensions}</p>
                      </div>
                      <p className="font-semibold">${size.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Frame Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Frame</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {frames.map((frame) => (
                  <div
                    key={frame.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedFrame === frame.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedFrame(frame.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{frame.name}</p>
                        <p className="text-sm text-muted-foreground">{frame.description}</p>
                      </div>
                      <p className="font-semibold">
                        {frame.price === 0 ? "Free" : `+$${frame.price}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {user && uploadedImage && (
                  <Button 
                    onClick={handleSaveProject}
                    variant="outline"
                    className="w-full"
                    disabled={createCanvasProject.isPending}
                  >
                    {createCanvasProject.isPending ? "Saving..." : "Save Project"}
                  </Button>
                )}
                
                <Button 
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                  disabled={!uploadedImage || addToCart.isPending}
                >
                  {addToCart.isPending ? "Adding..." : `Add to Cart - $${totalPrice.toFixed(2)}`}
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 mt-6 border-t">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Premium Canvas</Badge>
                  <span className="text-sm text-muted-foreground">Museum-quality materials</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Fade Resistant</Badge>
                  <span className="text-sm text-muted-foreground">Long-lasting inks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Ready to Hang</Badge>
                  <span className="text-sm text-muted-foreground">Pre-installed hanging hardware</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">Made in USA</Badge>
                  <span className="text-sm text-muted-foreground">Locally crafted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}