import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist, useAuthUser } from "@/hooks/useSupabase";
import { AppProduct } from "@/services/shopify/types";
import { toast } from "sonner";

interface WishlistButtonProps {
  product: AppProduct;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function WishlistButton({ 
  product, 
  variant = "ghost", 
  size = "icon",
  className 
}: WishlistButtonProps) {
  const { data: user } = useAuthUser();
  const { data: wishlist = [] } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isInWishlist = wishlist.some(item => item.product_id === product.id);

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist.mutate(product.id);
    } else {
      addToWishlist.mutate({
        product_id: product.id,
        product_title: product.title,
        product_image: product.images && product.images.length > 0 
          ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any)?.src) 
          : null,
        product_price: product.variants && product.variants.length > 0
          ? (typeof product.variants[0]?.price === 'object' 
            ? parseFloat((product.variants[0].price as any).amount) 
            : product.variants[0]?.price) 
          : null,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      className={className}
      disabled={addToWishlist.isPending || removeFromWishlist.isPending}
    >
      <Heart 
        className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} 
      />
      {size !== "icon" && (
        <span className="ml-2">
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </Button>
  );
}