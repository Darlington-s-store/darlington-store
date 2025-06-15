
import { Button } from "@/components/ui/button";
import { Order } from "@/pages/Orders";
import { X, Printer, Package } from "lucide-react";

interface OrderReceiptProps {
  order: Order;
  onClose: () => void;
}

const OrderReceipt = ({ order, onClose }: OrderReceiptProps) => {
  const getCartTotal = () => {
    return order.order_items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const deliveryFee = order.total_amount - getCartTotal();

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6 sm:p-8 print:hidden flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Order Receipt</h2>
          <div>
            <Button variant="outline" onClick={() => window.print()} className="mr-2">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <Package className="w-10 h-10 text-red-700 mb-2" />
                    <h1 className="text-2xl font-bold text-gray-900">Darlington Store</h1>
                    <p className="text-gray-500">Your favorite electronics plug.</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xl font-bold text-gray-800">Receipt</h3>
                    <p className="text-gray-500">Order #{order.order_number}</p>
                    <p className="text-gray-500">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Billed To:</h4>
              <p className="text-gray-600">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
              <p className="text-gray-600">{order.shipping_address.address}</p>
              <p className="text-gray-600">{order.shipping_address.city}, {order.shipping_address.state}</p>
              <p className="text-gray-600">{order.shipping_address.email}</p>
              <p className="text-gray-600">{order.shipping_address.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Order Summary:</h4>
            <div className="flow-root">
              <ul className="-my-4 divide-y divide-gray-200">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-center py-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">₵{(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">₵{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-800">₵{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-red-700">₵{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
