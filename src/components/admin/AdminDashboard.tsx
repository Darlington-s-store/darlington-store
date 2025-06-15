import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard statistics...');
      
      // Fetch total revenue from completed orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'completed');

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      }

      // Fetch total number of orders
      const { count: orderCount, error: orderCountError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (orderCountError) {
        console.error('Error fetching order count:', orderCountError);
      }

      // Fetch total number of products
      const { count: productCount, error: productCountError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (productCountError) {
        console.error('Error fetching product count:', productCountError);
      }

      // Fetch total number of users
      const { count: userCount, error: userCountError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userCountError) {
        console.error('Error fetching user count:', userCountError);
      }

      // Calculate total revenue
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalRevenue,
        totalOrders: orderCount || 0,
        totalProducts: productCount || 0,
        totalUsers: userCount || 0
      });

      console.log('Dashboard stats updated:', {
        totalRevenue,
        totalOrders: orderCount,
        totalProducts: productCount,
        totalUsers: userCount
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: loading ? "Loading..." : `₵${stats.totalRevenue.toFixed(2)}`,
      change: stats.totalRevenue > 0 ? "From completed orders" : "No completed orders yet",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: loading ? "Loading..." : stats.totalOrders.toString(),
      change: stats.totalOrders > 0 ? "Total orders placed" : "No orders yet",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: loading ? "Loading..." : stats.totalProducts.toString(),
      change: stats.totalProducts > 0 ? "Active products" : "No products yet",
      icon: Package,
    },
    {
      title: "Users",
      value: loading ? "Loading..." : stats.totalUsers.toString(),
      change: stats.totalUsers > 0 ? "Registered users" : "No users yet",
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
        {dashboardStats.map((stat, index) => {
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

      {/* Recent Activity or Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>
            Your store statistics and quick access to management sections.
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
            
            {!loading && (
              <div className="p-4 bg-secondary border rounded-lg">
                <h3 className="font-medium text-secondary-foreground mb-2">Current Status</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Products: </span>
                    <span className="font-medium text-secondary-foreground">{stats.totalProducts} active</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Orders: </span>
                    <span className="font-medium text-secondary-foreground">{stats.totalOrders} total</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue: </span>
                    <span className="font-medium text-secondary-foreground">₵{stats.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Users: </span>
                    <span className="font-medium text-secondary-foreground">{stats.totalUsers} registered</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
