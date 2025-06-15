
import { useAuth } from "@/hooks/useAuth";
import CartSummary from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your cart</p>
          <Button onClick={() => navigate('/auth')} className="bg-red-700 hover:bg-red-800">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CartSummary />
    </div>
  );
};

export default Cart;
