import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "@/data/sampleData";

const SportsPage = () => {
  const [showFilters, setShowFilters] = useState(false);

  const sportFilters = ["Football", "Basketball", "Baseball", "Soccer", "Hockey", "Tennis"];
  const styleFilters = ["Action Shots", "Portraits", "Vintage", "Abstract"];

  // Create sports-specific products
  const sportsProducts = sampleProducts.map((product, index) => ({
    ...product,
    id: `sports-${product.id}`,
    category: "Sports",
    title: [
      "Championship Victory",
      "Game Winning Shot",
      "Athletic Excellence", 
      "Speed & Power",
      "Team Spirit",
      "Olympic Moment",
      "Victory Celebration",
      "Sports Legend"
    ][index] || product.title
  }));

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
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                Filters
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  ×
                </Button>
              </h3>

              {/* By Sport */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">By Sport</h4>
                <div className="space-y-2">
                  {sportFilters.map((sport) => (
                    <div key={sport} className="flex items-center space-x-2">
                      <Checkbox id={sport} />
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
                      <Checkbox id={style} />
                      <label htmlFor={style} className="text-sm cursor-pointer">
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full btn-gallery">
                Apply Filters
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
                </Button>
                <p className="text-muted-foreground">
                  Showing {sportsProducts.length} results
                </p>
              </div>

              <Select defaultValue="featured">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sportsProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}
            </div>

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