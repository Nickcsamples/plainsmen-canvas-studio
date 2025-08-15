import { useState } from "react";
import { ShoppingCart, X, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useShopify";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CartDropdownProps {
  className?: string;
}

const CartDropdown = ({ className = "" }: CartDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, isLoading, updateCartItem, removeFromCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const itemCount = cart?.lineItems?.length || 0;

  const handleUpdateQuantity = async (lineItemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(lineItemId);
      return;
    }
    
    try {
      await updateCartItem.mutateAsync({ lineItemId, quantity: newQuantity });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (lineItemId: string) => {
    try {
      await removeFromCart.mutateAsync(lineItemId);
      toast({
        title: "Item removed",
        description: "Item removed from cart.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to remove item.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    // Shopify Buy SDK uses webUrl for checkout URL
    if (cart?.webUrl) {
      window.open(cart.webUrl, '_blank');
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Unable to proceed to checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewCart = () => {
    navigate('/cart');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative hover:bg-accent ${className}`}
        >
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
            {itemCount > 0 && (
              <span className="text-muted-foreground">({itemCount} items)</span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-full">
          {isLoading ? (
            <div className="flex-1 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : itemCount === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add some items to get started!
              </p>
              <Button onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cart?.lineItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.variant.image?.url || ""}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.variant.title}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateCartItem.isPending}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateCartItem.isPending}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {item.variant.price?.currencyCode} {parseFloat(item.variant.price?.amount || '0').toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeFromCart.isPending}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      {cart?.subtotalPrice?.currencyCode} {parseFloat(cart?.subtotalPrice?.amount || '0').toFixed(2)}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      {cart?.totalPrice?.currencyCode} {parseFloat(cart?.totalPrice?.amount || '0').toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={handleCheckout}
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleViewCart}
                  >
                    View Cart
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Secure checkout powered by Shopify
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDropdown;