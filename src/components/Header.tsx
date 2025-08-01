import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Create Canvas", path: "/create-canvas" },
    { name: "Featured", path: "/featured" },
    { name: "Film", path: "/film" },
    { name: "Pop Culture", path: "/pop-culture" },
    { name: "Sports", path: "/sports" },
    { name: "Scenic", path: "/scenic" },
    { name: "Places", path: "/places" },
    { name: "Rooms", path: "/rooms" },
    { name: "Layouts", path: "/layouts" },
    { name: "Artists", path: "/artists" },
    { name: "Reviews", path: "/reviews" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-foreground hover:opacity-80 transition-opacity">
            Plainsmen Art
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-accent"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Account */}
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <User className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <div className="max-w-md mx-auto">
              <Input
                type="search"
                placeholder="Search artwork..."
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent ${
                    isActive(item.path) ? "bg-accent text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;