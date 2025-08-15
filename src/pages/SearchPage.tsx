import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchProducts, useCollections } from "@/hooks/useShopify";
import { useDebounce } from "@/hooks/use-debounce";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults, isLoading: searchLoading, error } = useSearchProducts(
    debouncedSearchTerm,
    20
  );
  const { data: collections } = useCollections();

  // Update URL when search term changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) {
      params.set('q', debouncedSearchTerm);
    }
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [debouncedSearchTerm, navigate]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    if (!searchResults) return [];

    let filtered = [...searchResults];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.some(category => 
          product.category?.toLowerCase().includes(category.toLowerCase()) ||
          product.title.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
        switch (priceRange) {
          case 'under-50':
            return price < 50;
          case '50-100':
            return price >= 50 && price <= 100;
          case '100-200':
            return price >= 100 && price <= 200;
          case 'over-200':
            return price > 200;
          default:
            return true;
        }
      });
    }

    // Sort results
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
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep relevance order (default from API)
        break;
    }

    return filtered;
  }, [searchResults, selectedCategories, priceRange, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange('');
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange || sortBy !== 'relevance';

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Search Artwork</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Search for artwork, artists, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
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
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {collections?.slice(0, 8).map((collection) => (
                    <div key={collection.handle} className="flex items-center space-x-2">
                      <Checkbox 
                        id={collection.handle}
                        checked={selectedCategories.includes(collection.title)}
                        onCheckedChange={() => handleCategoryToggle(collection.title)}
                      />
                      <label htmlFor={collection.handle} className="text-sm cursor-pointer">
                        {collection.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any price</SelectItem>
                    <SelectItem value="under-50">Under $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="100-200">$100 - $200</SelectItem>
                    <SelectItem value="over-200">Over $200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Apply Filters Button */}
              <Button className="w-full">
                Apply Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedCategories.length + (priceRange ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
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
                      {selectedCategories.length + (priceRange ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                
                {debouncedSearchTerm && (
                  <div>
                    <p className="text-muted-foreground">
                      {searchLoading ? 'Searching...' : 
                       `${filteredAndSortedResults.length} results for "${debouncedSearchTerm}"`
                      }
                    </p>
                  </div>
                )}
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            {!debouncedSearchTerm ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Start searching</h2>
                <p className="text-muted-foreground">
                  Enter a search term to find artwork, artists, or categories.
                </p>
              </div>
            ) : searchLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <Card className="p-12 text-center">
                <h2 className="text-xl font-semibold mb-2">Search Error</h2>
                <p className="text-muted-foreground">
                  Unable to search at this time. Please try again later.
                </p>
              </Card>
            ) : filteredAndSortedResults.length === 0 ? (
              <Card className="p-12 text-center">
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                    />
                  ))}
                </div>

                {/* Load More - if API supports pagination */}
                {filteredAndSortedResults.length >= 20 && (
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                      Load More Results
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
