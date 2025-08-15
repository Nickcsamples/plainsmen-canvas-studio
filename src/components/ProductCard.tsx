import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  handle?: string;
  image: string;
  title: string;
  price: string | { amount: string; currencyCode: string };
  category?: string;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
}

const ProductCard = ({ 
  id, 
  handle,
  image, 
  title, 
  price, 
  category, 
  isWishlisted = false, 
  onWishlistToggle 
}: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (handle) {
      navigate(`/product/${handle}`);
    }
  };
  return (
    <div 
      className="group relative gallery-card rounded-lg overflow-hidden bg-card cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover gallery-hover"
        />
        
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity ${
            isWishlisted ? "text-red-500" : "text-white hover:text-red-500"
          } bg-black/20 hover:bg-black/40`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(id);
          }}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        {/* Category Badge */}
        {category && (
          <Badge 
            variant="secondary"
            className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {category}
          </Badge>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-card-foreground truncate">{title}</h3>
        <p className="text-lg font-semibold text-primary mt-1">{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;