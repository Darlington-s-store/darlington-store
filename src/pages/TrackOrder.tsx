
import { useState } from "react";
import { Package, Search, CheckCircle, Clock, Truck, MapPin } from "lucide-react";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock order data
  const mockOrderData = {
    orderNumber: "DS-2024-001234",
    status: "In Transit",
    customer: "John Doe",
    items: [
      { name: "Sony PlayStation 5", quantity: 1, price: "₵3,800" },
      { name: "Wireless Controller", quantity: 2, price: "₵450" }
    ],
    total: "₵4,700",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-18",
    timeline: [
      { status: "Order Placed", date: "2024-01-15 10:30 AM", completed: true, icon: CheckCircle },
      { status: "Processing", date: "2024-01-15 2:45 PM", completed: true, icon: Package },
      { status: "Shipped", date: "2024-01-16 9:20 AM", completed: true, icon: Truck },
      { status: "In Transit", date: "2024-01-17 11:15 AM", completed: true, icon: MapPin },
      { status: "Delivered", date: "Expected: 2024-01-18", completed: false, icon: CheckCircle }
    ]
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (orderNumber.toLowerCase().includes("ds-") || orderNumber === "001234") {
        setOrderData(mockOrderData);
      } else {
        setOrderData(null);
        alert("Order not found. Please check your order number and try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600">
            Enter your order number to get real-time updates on your delivery status
          </p>
        </div>

        {/* Order Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number (e.g., DS-2024-001234)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none text-lg"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 text-lg flex items-center gap-2"
            >
              {isLoading ? (
                <Clock className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {isLoading ? "Tracking..." : "Track Order"}
            </Button>
          </form>
        </div>

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold text-lg">{orderData.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <p className="font-semibold text-lg text-red-700">{orderData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">{orderData.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold">{orderData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h3>
              <div className="space-y-4">
                {orderData.timeline.map((step: any, index: number) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${step.completed ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.status}
                          </h4>
                          <span className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.date}
                          </span>
                        </div>
                        {index < orderData.timeline.length - 1 && (
                          <div className={`w-px h-6 ml-2 mt-2 ${step.completed ? 'bg-green-300' : 'bg-gray-300'}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {orderData.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-red-700">{item.price}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-lg font-bold text-red-700">{orderData.total}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you can't find your order or have questions about your delivery, please contact our customer service team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call: +233 24 123 4567
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email: support@darlingtonstore.com
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackOrder;
