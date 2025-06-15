
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₵45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Orders",
      value: "234",
      change: "+12% from last month",
      icon: ShoppingCart,
      trend: "up"
    },
    {
      title: "Products",
      value: "1,429",
      change: "+8 new products",
      icon: Package,
      trend: "up"
    },
    {
      title: "Active Users",
      value: "573",
      change: "+201 since last hour",
      icon: Users,
      trend: "up"
    }
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", product: "iPhone 15 Pro", amount: "₵8,999", status: "Completed" },
    { id: "ORD-002", customer: "Jane Smith", product: "MacBook Air", amount: "₵12,499", status: "Processing" },
    { id: "ORD-003", customer: "Mike Johnson", product: "AirPods Pro", amount: "₵2,299", status: "Shipped" },
    { id: "ORD-004", customer: "Sarah Wilson", product: "iPad Air", amount: "₵5,799", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
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
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You have {recentOrders.length} orders this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.product}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Add New Product</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">View All Orders</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Manage Customers</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">View Analytics</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
