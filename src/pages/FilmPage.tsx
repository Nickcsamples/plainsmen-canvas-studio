import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsByCategory } from "@/hooks/useShopify";
import { sampleProducts } from "@/data/sampleData";

const FilmPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');

  const colorFilters = ["Black & White", "Color", "Sepia", "Vintage"];
  const orientationFilters = ["Portrait", "Landscape", "Square"];

  // Try to get real Shopify film products first, fallback to sample data
  const { data: shopifyFilmProducts, isLoading } = useProductsByCategory('film', 50);
  
  // Create film-specific products with handles
  const filmTitles = [
    "Casablanca Classic",
    "The Godfather Portrait", 
    "Pulp Fiction Scene",
    "Citizen Kane Moment",
    "Vertigo Spiral",
    "2001 Space Odyssey",
    "Apocalypse Now",
    "Taxi Driver Night"
  ];

  const sampleFilmProducts = sampleProducts.map((product, index) => ({
    ...product,
    id: `film-${product.id}`,
    handle: `film-${filmTitles[index]?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || product.title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    category: "Film",
    title: filmTitles[index] || product.title
  }));

  // Use Shopify products if available, otherwise use sample products
  const baseProducts = shopifyFilmProducts && shopifyFilmProducts.length > 0 
    ? shopifyFilmProducts 
    : sampleFilmProducts;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...baseProducts];

    // Apply color filters (mock logic for demo)
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        selectedColors.some(color => 
          product.title.toLowerCase().includes(color.toLowerCase().split(' ')[0]) ||
          (color === "Black & White" && Math.random() > 0.7) ||
          (color === "Color" && Math.random() > 0.5) ||
          (color === "Sepia" && Math.random() > 0.8) ||
          (color === "Vintage" && Math.random() > 0.6)
        )
      );
    }

    // Apply orientation filters (mock logic for demo)
    if (selectedOrientations.length > 0) {
      filtered = filtered.filter(product => 
        selectedOrientations.some(orientation => 
          (orientation === "Portrait" && Math.random() > 0.6) ||
          (orientation === "Landscape" && Math.random() > 0.4) ||
          (orientation === "Square" && Math.random() > 0.8)
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'newest':
        // Mock newest sort - in real app this would use creation date
        filtered.reverse();
        break;
      case 'rating':
        // Mock rating sort
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [baseProducts, selectedColors, selectedOrientations, sortBy]);

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleOrientationToggle = (orientation: string) => {
    setSelectedOrientations(prev => 
      prev.includes(orientation) ? prev.filter(o => o !== orientation) : [...prev, orientation]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedOrientations([]);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedColors.length > 0 || selectedOrientations.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">FILM</h1>
          <h2 className="text-2xl mb-6 opacity-90">Iconic moments from cinema history</h2>
          <p className="text-lg max-w-2xl opacity-80">
            Transform your space with legendary scenes and characters from the greatest films ever made. 
            Each piece captures the essence of cinematic artistry in stunning detail.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              {/* By Color */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">By Color</h4>
                <div className="space-y-2">
                  {colorFilters.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox 
                        id={color}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => handleColorToggle(color)}
                      />
                      <label htmlFor={color} className="text-sm cursor-pointer">
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Orientation */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">By Orientation</h4>
                <div className="space-y-2">
                  {orientationFilters.map((orientation) => (
                    <div key={orientation} className="flex items-center space-x-2">
                      <Checkbox 
                        id={orientation}
                        checked={selectedOrientations.includes(orientation)}
                        onCheckedChange={() => handleOrientationToggle(orientation)}
                      />
                      <label htmlFor={orientation} className="text-sm cursor-pointer">
                        {orientation}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full btn-gallery">
                Apply Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedColors.length + selectedOrientations.length}
                  </Badge>
                )}
              </Button>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedColors.length + selectedOrientations.length}
                    </Badge>
                  )}
                </Button>
                <p className="text-muted-foreground">
                  {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} results`}
                </p>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FilmPage;
