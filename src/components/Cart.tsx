import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, [isOpen]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₵', '').replace(',', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Generate a mock order number
    const orderNumber = 'DS' + Math.random().toString().substr(2, 6).padStart(6, '0');
    
    // Save order to user's order history if logged in
    if (user) {
      const newOrder = {
        id: Date.now().toString(),
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        total: getTotalPrice(),
        status: 'pending' as const,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const existingOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(updatedOrders));
    }
    
    // Simulate checkout process
    alert(`Order placed successfully! Your order number is: ${orderNumber}\n\nTotal: ₵${getTotalPrice().toFixed(2)}\n\nYou can track your order using the Track Order page.`);
    
    // Clear cart after checkout
    setCartItems([]);
    localStorage.removeItem('cart');
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-red-700 font-bold">{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-red-700">₵{getTotalPrice().toFixed(2)}</span>
                </div>
                <Button 
                  onClick={proceedToCheckout}
                  className="w-full bg-red-700 hover:bg-red-800 text-white"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
