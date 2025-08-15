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
import { getPriceValue } from "@/lib/utils";

const SportsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');

  const sportFilters = ["Football", "Basketball", "Baseball", "Soccer", "Hockey", "Tennis"];
  const styleFilters = ["Action Shots", "Portraits", "Vintage", "Abstract"];

  // Try to get real Shopify sports products first, fallback to sample data
  const { data: shopifySportsProducts, isLoading } = useProductsByCategory('sports', 50);
  
  // Create sports-specific products with handles
  const sportsTitles = [
    "Championship Victory",
    "Game Winning Shot",
    "Athletic Excellence", 
    "Speed & Power",
    "Team Spirit",
    "Olympic Moment",
    "Victory Celebration",
    "Sports Legend"
  ];

  const sampleSportsProducts = sampleProducts.map((product, index) => ({
    ...product,
    id: `sports-${product.id}`,
    handle: `sports-${sportsTitles[index]?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || product.title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    category: "Sports",
    title: sportsTitles[index] || product.title
  }));

  // Use Shopify products if available, otherwise use sample products
  const baseProducts = shopifySportsProducts && shopifySportsProducts.length > 0 
    ? shopifySportsProducts 
    : sampleSportsProducts;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...baseProducts];

    // Apply sport filters (mock logic for demo)
    if (selectedSports.length > 0) {
      filtered = filtered.filter(product => 
        selectedSports.some(sport => 
          product.title.toLowerCase().includes(sport.toLowerCase()) ||
          (sport === "Football" && Math.random() > 0.7) ||
          (sport === "Basketball" && Math.random() > 0.6) ||
          (sport === "Baseball" && Math.random() > 0.8) ||
          (sport === "Soccer" && Math.random() > 0.5) ||
          (sport === "Hockey" && Math.random() > 0.9) ||
          (sport === "Tennis" && Math.random() > 0.7)
        )
      );
    }

    // Apply style filters (mock logic for demo)
    if (selectedStyles.length > 0) {
      filtered = filtered.filter(product => 
        selectedStyles.some(style => 
          (style === "Action Shots" && Math.random() > 0.4) ||
          (style === "Portraits" && Math.random() > 0.6) ||
          (style === "Vintage" && Math.random() > 0.8) ||
          (style === "Abstract" && Math.random() > 0.7)
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = getPriceValue(a.price);
          const priceB = getPriceValue(b.price);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = getPriceValue(a.price);
          const priceB = getPriceValue(b.price);
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
  }, [baseProducts, selectedSports, selectedStyles, sortBy]);

  const handleSportToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const clearFilters = () => {
    setSelectedSports([]);
    setSelectedStyles([]);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedSports.length > 0 || selectedStyles.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">SPORTS</h1>
          <h2 className="text-2xl mb-6 opacity-90">Capture the spirit of competition</h2>
          <p className="text-lg max-w-2xl opacity-80">
            Celebrate athletic achievement and sporting legends with our dynamic collection. 
            From iconic moments to artistic interpretations of movement and victory.
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

              {/* By Sport */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">By Sport</h4>
                <div className="space-y-2">
                  {sportFilters.map((sport) => (
                    <div key={sport} className="flex items-center space-x-2">
                      <Checkbox 
                        id={sport}
                        checked={selectedSports.includes(sport)}
                        onCheckedChange={() => handleSportToggle(sport)}
                      />
                      <label htmlFor={sport} className="text-sm cursor-pointer">
                        {sport}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Style */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">By Style</h4>
                <div className="space-y-2">
                  {styleFilters.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox 
                        id={style}
                        checked={selectedStyles.includes(style)}
                        onCheckedChange={() => handleStyleToggle(style)}
                      />
                      <label htmlFor={style} className="text-sm cursor-pointer">
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full btn-gallery">
                Apply Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedSports.length + selectedStyles.length}
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
                      {selectedSports.length + selectedStyles.length}
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

export default SportsPage;
