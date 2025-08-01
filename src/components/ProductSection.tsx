import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

const ProductSection = ({ 
  title, 
  products, 
  showMoreButton = false, 
  onShowMore,
  className = ""
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Arrows */}
            <div className="flex space-x-2">
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

            {/* Show More Button */}
            {showMoreButton && (
              <Button 
                variant="outline" 
                onClick={onShowMore}
                className="hover:bg-accent"
              >
                Shop More
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div
          id={`scroll-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="flex space-x-6 overflow-x-auto scroll-container pb-4"
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-72">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;