import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Checkout Cancelled</h1>
          <p className="text-muted-foreground">
            Your order was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your cart is still saved</h3>
            <p className="text-sm text-muted-foreground">
              All items remain in your cart and you can complete your purchase anytime.
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Return to Cart
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutCancelPage;