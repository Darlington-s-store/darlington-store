
import { useState, useEffect } from "react";
import { Package, Calendar, DollarSign, Truck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: string;
  }>;
}

const Orders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Load mock orders from localStorage or generate some
    const savedOrders = localStorage.getItem(`orders_${user?.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Generate some mock orders for demonstration
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'DS000123',
          date: '2024-01-15',
          total: 3800,
          status: 'delivered',
          items: [
            { id: 1, name: 'Sony PlayStation 5', quantity: 1, price: '₵3,800' }
          ]
        },
        {
          id: '2',
          orderNumber: 'DS000124',
          date: '2024-01-20',
          total: 2800,
          status: 'shipped',
          items: [
            { id: 2, name: 'Samsung 980 PRO 4TB NVMe', quantity: 1, price: '₵2,800' }
          ]
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem(`orders_${user?.id}`, JSON.stringify(mockOrders));
    }
  }, [user, loading, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-red-700 hover:bg-red-800"
            >
              Shop Now
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </div>
                    <div className="flex items-center text-lg font-bold text-gray-900 mt-1">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ₵{order.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-900">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-gray-900">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/track?order=${order.orderNumber}`)}
                  >
                    Track Order
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/contact')}
                  >
                    Need Help?
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
