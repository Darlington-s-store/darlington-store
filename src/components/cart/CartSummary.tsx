
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartSummary = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add some products to get started</p>
        <Button onClick={() => navigate('/products')} className="bg-red-700 hover:bg-red-800">
          Shop Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
        <span className="text-sm text-gray-600">{getTotalItems()} items</span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.variant || 'default'}`} className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
            <img
              src={item.image_url || '/placeholder.svg'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              {item.variant && (
                <p className="text-sm text-gray-600">Variant: {item.variant}</p>
              )}
              <p className="text-lg font-bold text-red-700">₵{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.variant, Math.max(0, item.quantity - 1))}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <span className="w-12 text-center font-semibold">{item.quantity}</span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="font-bold text-gray-900">₵{(item.price * item.quantity).toFixed(2)}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id, item.variant)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold text-red-700">₵{getTotalPrice().toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/checkout')} 
            className="w-full bg-red-700 hover:bg-red-800 text-lg py-3"
          >
            Proceed to Checkout
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')} 
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
