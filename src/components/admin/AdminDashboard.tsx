
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₵0.00",
      change: "No data yet",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: "0",
      change: "No orders yet",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: "0",
      change: "No products yet",
      icon: Package,
    },
    {
      title: "Active Users",
      value: "0",
      change: "No users yet",
      icon: Users,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Your admin dashboard is ready. Use the sidebar to navigate to different sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Manage products in the Products section</li>
                <li>• View and process orders in Orders</li>
                <li>• Monitor customer activity in Customers</li>
                <li>• Check analytics and reports in Analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
