import { useState } from "react";
import { Heart, Upload, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import abstractLandscape from "@/assets/product-abstract-landscape.jpg";

const CreateCanvasPage = () => {
  const [selectedLayout, setSelectedLayout] = useState("1");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [selectedFrame, setSelectedFrame] = useState("gallery-wrapped");

  const layouts = [
    { id: "1", name: "Single Panel", panels: 1 },
    { id: "3", name: "3 Panels", panels: 3 },
    { id: "4", name: "4 Panels", panels: 4 },
    { id: "5", name: "5 Panels", panels: 5 },
  ];

  const sizes = [
    { id: "small", name: "Small", dimensions: "16x12", price: "$74.99" },
    { id: "medium", name: "Medium", dimensions: "24x18", price: "$94.99" },
    { id: "large", name: "Large", dimensions: "32x24", price: "$124.99" },
  ];

  const frames = [
    { id: "gallery-wrapped", name: "Gallery Wrapped", description: "No frame needed" },
    { id: "black-frame", name: "Black Frame", description: "Classic black wood frame" },
    { id: "white-frame", name: "White Frame", description: "Clean white wood frame" },
    { id: "natural-wood", name: "Natural Wood", description: "Natural wood grain frame" },
  ];

  const selectedSizeData = sizes.find(size => size.id === selectedSize);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-muted-foreground">
          <span>Home</span> / <span className="text-foreground">Create Canvas</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-accent">
              <img
                src={abstractLandscape}
                alt="Custom Canvas Preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg bg-accent border-2 border-transparent hover:border-primary cursor-pointer transition-colors">
                  <img
                    src={abstractLandscape}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">Custom Canvas Print</h1>
              
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <p className="text-3xl font-bold text-primary">
                  {selectedSizeData?.price}
                </p>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Customization Steps */}
            <div className="space-y-8">
              {/* Step 1: Choose Image */}
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Choose Image</h3>
                <Card className="p-6 border-dashed border-2 border-muted-foreground/30 hover:border-primary transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Upload Your Image</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports JPG, PNG, HEIC files up to 50MB
                    </p>
                    <Input type="file" className="hidden" accept="image/*" />
                    <Button>Browse Files</Button>
                  </div>
                </Card>
              </div>

              {/* Step 2: Choose Layout */}
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Choose Layout</h3>
                <div className="grid grid-cols-2 gap-4">
                  {layouts.map((layout) => (
                    <Card
                      key={layout.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedLayout === layout.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedLayout(layout.id)}
                    >
                      <div className="text-center">
                        <div className="grid grid-cols-1 gap-1 mb-2 h-12 items-center">
                          {layout.panels === 1 && (
                            <div className="bg-muted rounded h-8"></div>
                          )}
                          {layout.panels === 3 && (
                            <div className="grid grid-cols-3 gap-1">
                              <div className="bg-muted rounded h-8"></div>
                              <div className="bg-muted rounded h-8"></div>
                              <div className="bg-muted rounded h-8"></div>
                            </div>
                          )}
                          {layout.panels === 4 && (
                            <div className="grid grid-cols-2 gap-1">
                              <div className="bg-muted rounded h-6"></div>
                              <div className="bg-muted rounded h-6"></div>
                              <div className="bg-muted rounded h-6"></div>
                              <div className="bg-muted rounded h-6"></div>
                            </div>
                          )}
                          {layout.panels === 5 && (
                            <div className="grid grid-cols-5 gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-muted rounded h-8"></div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium">{layout.name}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Step 3: Choose Size */}
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Choose Size</h3>
                <div className="space-y-3">
                  {sizes.map((size) => (
                    <Card
                      key={size.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedSize === size.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{size.name}</p>
                          <p className="text-sm text-muted-foreground">{size.dimensions}"</p>
                        </div>
                        <p className="font-semibold">{size.price}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Step 4: Choose Frame */}
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Choose Frame</h3>
                <div className="space-y-3">
                  {frames.map((frame) => (
                    <Card
                      key={frame.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedFrame === frame.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedFrame(frame.id)}
                    >
                      <div>
                        <p className="font-medium">{frame.name}</p>
                        <p className="text-sm text-muted-foreground">{frame.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <Button size="lg" className="w-full btn-gallery">
              Add to Cart
            </Button>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCanvasPage;