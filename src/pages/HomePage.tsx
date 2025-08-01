import { Star, Upload, Grid3X3, Maximize, Frame } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import ProductSection from "@/components/ProductSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleProducts, categories, customerReviews } from "@/data/sampleData";
import abstractLandscape from "@/assets/product-abstract-landscape.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Category Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="flex space-x-6 overflow-x-auto scroll-container pb-4">
            {categories.map((category, index) => (
              <Button
                key={category}
                variant="outline"
                className="flex-none px-6 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Sections */}
      <ProductSection 
        title="Best Sellers" 
        products={sampleProducts}
        showMoreButton={true}
      />

      <ProductSection 
        title="What's Hot" 
        products={sampleProducts.slice().reverse()}
        className="bg-accent"
      />

      <ProductSection 
        title="Landscape Collection" 
        products={sampleProducts.slice(0, 6)}
      />

      {/* Custom Canvas Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Create Your Custom Canvas</h2>
              <p className="text-xl mb-8 opacity-90">
                Upload your own image and transform it into premium wall art. Our advanced printing technology ensures vibrant colors and lasting quality.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Upload className="h-6 w-6" />
                  <span>Upload Your Image</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Grid3X3 className="h-6 w-6" />
                  <span>Choose Layout</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Maximize className="h-6 w-6" />
                  <span>Select Size</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Frame className="h-6 w-6" />
                  <span>Pick Frame Style</span>
                </div>
              </div>

              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Start Creating
              </Button>
            </div>
            
            <div className="relative">
              <img
                src={abstractLandscape}
                alt="Custom Canvas Example"
                className="rounded-lg shadow-gallery w-full"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white text-black">
                  Made in USA
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductSection 
        title="Top Picks" 
        products={sampleProducts.slice(2, 8)}
      />

      <ProductSection 
        title="Film Collection" 
        products={sampleProducts.slice(1, 7)}
        className="bg-accent"
      />

      {/* Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerReviews.map((review) => (
              <Card key={review.id} className="p-6 gallery-card">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  "{review.text}"
                </p>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Founded with a passion for bringing exceptional art to everyday spaces, Plainsmen Art has been transforming homes and offices with premium wall art for over a decade.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We work directly with talented artists worldwide to curate a collection that speaks to diverse tastes while maintaining the highest standards of quality and craftsmanship.
              </p>
              <Button variant="outline" size="lg">
                Learn More About Us
              </Button>
            </div>
            
            <div className="relative">
              <img
                src={abstractLandscape}
                alt="Our Story"
                className="rounded-lg shadow-gallery w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;