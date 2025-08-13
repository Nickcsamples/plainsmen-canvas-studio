import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist, useAuthUser, useRemoveFromWishlist } from "@/hooks/useSupabase";
import { WishlistButton } from "@/components/WishlistButton";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useShopify";
import { toast } from "sonner";

export default function WishlistPage() {
  const { data: user, isLoading: userLoading } = useAuthUser();
  const { data: wishlist = [], isLoading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleAddToCart = (item: any) => {
    // Create a mock product variant for cart
    const mockVariant = {
      id: `variant-${item.product_id}`,
      title: item.product_title,
      price: item.product_price || 0,
      available: true,
      inventoryQuantity: 999,
    };

    addToCart.mutate(
      { 
        variantId: mockVariant.id,
        quantity: 1 
      },
      {
        onSuccess: () => {
          toast.success(`${item.product_title} added to cart!`);
        }
      }
    );
  };

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign In to View Your Wishlist</h1>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to save your favorite items
          </p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (wishlistLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <Badge variant="secondary">{wishlist.length} items</Badge>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center max-w-md mx-auto">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start browsing and add items you love to your wishlist
          </p>
          <Button asChild>
            <Link to="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-muted">
                  {item.product_image ? (
                    <img
                      src={item.product_image}
                      alt={item.product_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => removeFromWishlist.mutate(item.product_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2 text-sm">
                    {item.product_title}
                  </h3>
                  
                  {item.product_price && (
                    <p className="text-lg font-bold">
                      ${item.product_price.toFixed(2)}
                    </p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item)}
                      disabled={addToCart.isPending}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}