import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { artists } from "@/data/sampleData";

const ArtistsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">ARTISTS</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover our curated collection of talented artists from around the world. 
            Each bringing their unique vision and style to transform your space.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            BECOME AN ARTIST
          </Button>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {artists.map((artist) => (
              <Card key={artist.id} className="gallery-card overflow-hidden group cursor-pointer">
                <div className="aspect-square relative">
                  {/* 2x2 Artwork Grid */}
                  <div className="grid grid-cols-2 gap-1 h-full">
                    {artist.artworks.slice(0, 4).map((artwork, index) => (
                      <div key={index} className="overflow-hidden">
                        <img
                          src={artwork}
                          alt={`${artist.name} artwork ${index + 1}`}
                          className="w-full h-full object-cover gallery-hover"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      View Gallery
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-foreground">{artist.name}</h3>
                  <p className="text-muted-foreground mt-2">Digital Artist</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Artist Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share your creativity with the world. Apply to become a featured artist 
            and showcase your work to thousands of art lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gallery">
              Submit Your Portfolio
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtistsPage;