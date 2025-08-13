import { CheckCircle, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart after successful purchase (optional)
    // This would typically be handled by webhooks in a production app
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Order confirmation email sent</li>
              <li>• Production begins within 24 hours</li>
              <li>• Tracking information provided</li>
              <li>• Delivery in 3-5 business days</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;