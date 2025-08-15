import { ShoppingCart, Minus, Plus, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useShopify";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { cart, isLoading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();

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
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (lineItemId: string) => {
    try {
      await removeFromCart.mutateAsync(lineItemId);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    // Shopify Buy SDK uses webUrl for checkout URL
    if (cart?.webUrl) {
      window.open(cart.webUrl, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Unable to proceed to checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasItems = cart?.lineItems && cart.lineItems.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {hasItems && (
            <span className="text-muted-foreground">({cart.lineItems.length} items)</span>
          )}
        </div>

        {!hasItems ? (
          <Card className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items in your cart</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearCart}
                  disabled={clearCart.isPending}
                >
                  Clear Cart
                </Button>
              </div>
              
              {cart.lineItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.variant.image?.url || ""}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.variant.title}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateCartItem.isPending}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateCartItem.isPending}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {item.variant.price?.currencyCode} {parseFloat(item.variant.price?.amount || '0').toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeFromCart.isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {cart.subtotalPrice?.currencyCode} {parseFloat(cart.subtotalPrice?.amount || '0').toFixed(2)}
                    </span>
                  </div>
                  
                  {cart.totalTax && (
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>
                        {cart.totalTax?.currencyCode} {parseFloat(cart.totalTax?.amount || '0').toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {cart.totalPrice?.currencyCode} {parseFloat(cart.totalPrice?.amount || '0').toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll be redirected to Shopify's secure checkout
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;