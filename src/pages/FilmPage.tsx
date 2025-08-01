import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "@/data/sampleData";

const FilmPage = () => {
  const [showFilters, setShowFilters] = useState(false);

  const colorFilters = ["Black & White", "Color", "Sepia", "Vintage"];
  const orientationFilters = ["Portrait", "Landscape", "Square"];

  // Create film-specific products
  const filmProducts = sampleProducts.map((product, index) => ({
    ...product,
    id: `film-${product.id}`,
    category: "Film",
    title: [
      "Casablanca Classic",
      "The Godfather Portrait", 
      "Pulp Fiction Scene",
      "Citizen Kane Moment",
      "Vertigo Spiral",
      "2001 Space Odyssey",
      "Apocalypse Now",
      "Taxi Driver Night"
    ][index] || product.title
  }));

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

              {/* By Color */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">By Color</h4>
                <div className="space-y-2">
                  {colorFilters.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox id={color} />
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
                      <Checkbox id={orientation} />
                      <label htmlFor={orientation} className="text-sm cursor-pointer">
                        {orientation}
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
                  Showing {filmProducts.length} results
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
              {filmProducts.map((product) => (
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

export default FilmPage;