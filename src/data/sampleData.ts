import abstractLandscape from "@/assets/product-abstract-landscape.jpg";
import geometricPatterns from "@/assets/product-geometric-patterns.jpg";
import portraitStudy from "@/assets/product-portrait-study.jpg";
import dynamicMovement from "@/assets/product-dynamic-movement.jpg";

// Sample Products Data
export const sampleProducts = [
  {
    id: "1",
    image: abstractLandscape,
    title: "Abstract Landscape",
    price: "$94.99 USD",
    category: "Abstract"
  },
  {
    id: "2",
    image: geometricPatterns,
    title: "Geometric Patterns",
    price: "$89.99 USD",
    category: "Modern"
  },
  {
    id: "3",
    image: portraitStudy,
    title: "Portrait Study",
    price: "$99.99 USD",
    category: "Classic"
  },
  {
    id: "4",
    image: dynamicMovement,
    title: "Dynamic Movement",
    price: "$94.99 USD",
    category: "Abstract"
  },
  {
    id: "5",
    image: abstractLandscape,
    title: "Minimalist Horizon",
    price: "$84.99 USD",
    category: "Landscape"
  },
  {
    id: "6",
    image: geometricPatterns,
    title: "Urban Grid",
    price: "$94.99 USD",
    category: "Modern"
  },
  {
    id: "7",
    image: portraitStudy,
    title: "Character Study",
    price: "$104.99 USD",
    category: "Portrait"
  },
  {
    id: "8",
    image: dynamicMovement,
    title: "Flow State",
    price: "$89.99 USD",
    category: "Abstract"
  }
];

// Category Data
export const categories = [
  "Featured",
  "Film", 
  "Pop Culture",
  "Sports",
  "Scenic",
  "Places",
  "Abstract",
  "Architecture"
];

// Customer Reviews
export const customerReviews = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
    text: "The quality exceeded my expectations. The canvas is thick and the print is vibrant. Exactly what I was looking for to complete my living room.",
    location: "New York, NY"
  },
  {
    id: "2", 
    name: "Mike Chen",
    rating: 5,
    text: "Fast shipping and excellent packaging. The artwork arrived in perfect condition and looks amazing on my wall. Will definitely order again.",
    location: "San Francisco, CA"
  },
  {
    id: "3",
    name: "Emma Wilson",
    rating: 5,
    text: "I love the custom canvas feature! Being able to upload my own image and see it transformed into professional wall art was incredible.",
    location: "Austin, TX"
  },
  {
    id: "4",
    name: "David Rodriguez",
    rating: 5,
    text: "The customer service team was helpful in choosing the right size and frame. The final product looks fantastic in my office.",
    location: "Miami, FL"
  }
];

// Artist Data
export const artists = [
  {
    id: "1",
    name: "Albi Art",
    artworks: [abstractLandscape, geometricPatterns, portraitStudy, dynamicMovement]
  },
  {
    id: "2",
    name: "Amrisaurus", 
    artworks: [geometricPatterns, abstractLandscape, dynamicMovement, portraitStudy]
  },
  {
    id: "3",
    name: "Amy Tieman",
    artworks: [portraitStudy, dynamicMovement, abstractLandscape, geometricPatterns]
  },
  {
    id: "4",
    name: "Annette Schmucker",
    artworks: [dynamicMovement, portraitStudy, geometricPatterns, abstractLandscape]
  },
  {
    id: "5",
    name: "Andy Brackpool",
    artworks: [abstractLandscape, portraitStudy, dynamicMovement, geometricPatterns]
  },
  {
    id: "6",
    name: "As4147 Studious",
    artworks: [geometricPatterns, dynamicMovement, abstractLandscape, portraitStudy]
  },
  {
    id: "7",
    name: "Barry Pack",
    artworks: [portraitStudy, abstractLandscape, geometricPatterns, dynamicMovement]
  },
  {
    id: "8",
    name: "Bash",
    artworks: [dynamicMovement, geometricPatterns, portraitStudy, abstractLandscape]
  }
];