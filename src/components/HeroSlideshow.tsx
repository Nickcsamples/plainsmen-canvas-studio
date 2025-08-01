import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroGallery from "@/assets/hero-gallery-1.jpg";
import heroLivingRoom from "@/assets/hero-living-room.jpg";
import heroArtistWork from "@/assets/hero-artist-work.jpg";

const slides = [
  {
    id: 1,
    image: heroGallery,
    title: "Premium Gallery Experience",
    subtitle: "Discover world-class artwork for your space"
  },
  {
    id: 2,
    image: heroLivingRoom,
    title: "Transform Your Space",
    subtitle: "High-quality wall art built to last"
  },
  {
    id: 3,
    image: heroArtistWork,
    title: "Artistic Excellence",
    subtitle: "Crafted by talented artists worldwide"
  }
];

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            We make high quality wall art that is built to last.
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Turn walls into conversation starters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gallery text-lg px-8 py-4">
              Create Your Own
            </Button>
            <Button size="lg" variant="outline" className="btn-gallery-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-black">
              Search & Discover
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;