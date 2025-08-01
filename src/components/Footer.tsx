import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ];

  const quickLinks = [
    { name: "Create Canvas", href: "/create-canvas" },
    { name: "Artists", href: "/artists" },
    { name: "Featured", href: "/featured" },
    { name: "Best Sellers", href: "/best-sellers" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Licensing", href: "/licensing" },
  ];

  const socialMedia = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
  ];

  return (
    <footer className="bg-gallery-dark text-gallery-light">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-bold mb-4 block">
              Plainsmen Art
            </Link>
            <p className="text-gallery-light/80 text-sm leading-relaxed">
              We make high quality wall art that is built to last. Transform your space with our curated collection of premium artwork.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              {socialMedia.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="hover:bg-gallery-light/10 text-gallery-light hover:text-white"
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company Info</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gallery-light/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gallery-light/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gallery-light/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gallery-light/80 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gallery-light/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gallery-light/60 text-sm">
            © {new Date().getFullYear()} Plainsmen Art. All rights reserved.
          </p>
          <p className="text-gallery-light/60 text-sm mt-2 md:mt-0">
            Made in USA with premium materials
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;