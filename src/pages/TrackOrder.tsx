
import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import { Button } from "@/components/ui/button";

interface OrderStatus {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  total: string;
  status: "processing" | "shipped" | "delivered";
  orderDate: string;
  estimatedDelivery: string;
  trackingSteps: Array<{
    status: string;
    date: string;
    location: string;
    completed: boolean;
  }>;
}

// Mock order data
const mockOrders: { [key: string]: OrderStatus } = {
  "DS001234": {
    id: "DS001234",
    customerName: "John Doe",
    customerEmail: "john.doe@email.com",
    items: [
      { name: "Sony PlayStation 5", quantity: 1, price: "₵3,800" },
      { name: "iPhone 15 Pro", quantity: 1, price: "₵8,900" }
    ],
    total: "₵12,700",
    status: "shipped",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-20",
    trackingSteps: [
      { status: "Order Confirmed", date: "2024-01-15 10:30", location: "Darlington Store", completed: true },
      { status: "Processing", date: "2024-01-15 14:00", location: "Warehouse", completed: true },
      { status: "Shipped", date: "2024-01-16 09:00", location: "Accra Distribution Center", completed: true },
      { status: "Out for Delivery", date: "", location: "Local Delivery Hub", completed: false },
      { status: "Delivered", date: "", location: "Customer Address", completed: false }
    ]
  },
  "DS001235": {
    id: "DS001235",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@email.com",
    items: [
      { name: "MacBook Pro 16-inch", quantity: 1, price: "₵12,500" }
    ],
    total: "₵12,500",
    status: "delivered",
    orderDate: "2024-01-10",
    estimatedDelivery: "2024-01-15",
    trackingSteps: [
      { status: "Order Confirmed", date: "2024-01-10 11:00", location: "Darlington Store", completed: true },
      { status: "Processing", date: "2024-01-10 15:30", location: "Warehouse", completed: true },
      { status: "Shipped", date: "2024-01-11 08:00", location: "Accra Distribution Center", completed: true },
      { status: "Out for Delivery", date: "2024-01-15 07:30", location: "Local Delivery Hub", completed: true },
      { status: "Delivered", date: "2024-01-15 16:45", location: "Customer Address", completed: true }
    ]
  }
};

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrderStatus(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundOrder = mockOrders[orderNumber.toUpperCase()];
    
    if (foundOrder) {
      setOrderStatus(foundOrder);
    } else {
      setError("Order not found. Please check your order number and try again.");
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing": return "text-yellow-600 bg-yellow-100";
      case "shipped": return "text-blue-600 bg-blue-100";
      case "delivered": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing": return <Clock className="w-5 h-5" />;
      case "shipped": return <Truck className="w-5 h-5" />;
      case "delivered": return <CheckCircle className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to track your package</p>
        </div>

        {/* Order Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., DS001234"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You can find your order number in your confirmation email
              </p>
            </div>
            <div className="flex items-end">
              <Button 
                type="submit" 
                disabled={isLoading || !orderNumber.trim()}
                className="bg-red-700 hover:bg-red-800 text-white px-8 py-2 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-1">
                Try using order numbers: DS001234 or DS001235 for demo purposes
              </p>
            </div>
          )}
        </div>

        {/* Order Status */}
        {orderStatus && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order #{orderStatus.id}</h2>
                  <p className="text-gray-600">Placed on {new Date(orderStatus.orderDate).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-medium capitalize ${getStatusColor(orderStatus.status)}`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(orderStatus.status)}
                    {orderStatus.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                  <p className="text-gray-600">{orderStatus.customerName}</p>
                  <p className="text-gray-600">{orderStatus.customerEmail}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Information</h3>
                  <p className="text-gray-600">Estimated Delivery: {new Date(orderStatus.estimatedDelivery).toLocaleDateString()}</p>
                  <p className="text-gray-600">Total: {orderStatus.total}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {orderStatus.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-red-700">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tracking Timeline</h3>
              <div className="space-y-4">
                {orderStatus.trackingSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.status}
                        </h4>
                        {step.date && (
                          <span className="text-sm text-gray-500">{step.date}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {step.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TrackOrder;
