import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  category?: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  showMoreButton?: boolean;
  onShowMore?: () => void;
  className?: string;
  isLoading?: boolean;
}

const ProductSection = ({ 
  title, 
  products, 
  showMoreButton = false, 
  onShowMore,
  className = "",
  isLoading = false
}: ProductSectionProps) => {
  const scrollLeft = () => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-3xl font-bold text-foreground text-center">{title}</h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center space-x-2 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="rounded-full hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="rounded-full hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Products Grid */}
        <div
          id={`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="flex space-x-6 overflow-x-auto scroll-container pb-4 mb-8"
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex-none w-72">
                <div className="gallery-card rounded-lg overflow-hidden bg-card">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex-none w-72">
                <ProductCard {...product} />
              </div>
            ))
          )}
        </div>

        {/* Show More Button */}
        {showMoreButton && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={onShowMore}
              className="hover:bg-accent"
            >
              Shop More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;