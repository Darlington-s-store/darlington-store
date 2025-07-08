
import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, Calendar, UserCheck, UserX, Filter, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  city: string | null;
  country: string | null;
  total_orders?: number;
  total_spent?: number;
}

interface CustomerStats {
  total_customers: number;
  new_this_month: number;
  active_customers: number;
  total_orders: number;
}

const EnhancedCustomerManager = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    total_customers: 0,
    new_this_month: 0,
    active_customers: 0,
    total_orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [filterBy, setFilterBy] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCustomers();
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user, sortBy]);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers...');
      
      // Fetch profiles with simpler query first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order(sortBy, { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // If profiles query fails, fall back to empty array
        setCustomers([]);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('No profiles found');
        setCustomers([]);
        return;
      }

      // Get order statistics for each customer with error handling
      const customersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const { data: orderStats } = await supabase
              .from('orders')
              .select('total_amount')
              .eq('user_id', profile.id);

            const totalOrders = orderStats?.length || 0;
            const totalSpent = orderStats?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

            return {
              ...profile,
              total_orders: totalOrders,
              total_spent: totalSpent
            };
          } catch (orderError) {
            console.error('Error fetching orders for profile:', profile.id, orderError);
            return {
              ...profile,
              total_orders: 0,
              total_spent: 0
            };
          }
        })
      );

      console.log('Customers fetched:', customersWithStats.length);
      setCustomers(customersWithStats);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
      toast({
        title: "Error",
        description: "Failed to fetch customers. Please check your permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching customer stats...');
      
      // Get total customers
      const { count: totalCount, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.error('Error fetching total count:', totalError);
        return;
      }

      // Get customers from this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyCount, error: monthlyError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      if (monthlyError) {
        console.error('Error fetching monthly count:', monthlyError);
      }

      // Get total orders count
      const { count: totalOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (ordersError) {
        console.error('Error fetching orders count:', ordersError);
      }

      setStats({
        total_customers: totalCount || 0,
        new_this_month: monthlyCount || 0,
        active_customers: totalCount || 0,
        total_orders: totalOrders || 0
      });

      console.log('Stats updated:', { totalCount, monthlyCount, totalOrders });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'City', 'Country', 'Join Date', 'Total Orders', 'Total Spent'],
      ...filteredCustomers.map(customer => [
        getDisplayName(customer),
        customer.email || '',
        customer.phone || '',
        customer.city || '',
        customer.country || '',
        new Date(customer.created_at).toLocaleDateString(),
        customer.total_orders?.toString() || '0',
        customer.total_spent?.toFixed(2) || '0.00'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCustomers = customers.filter(customer => {
    if (!customer) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const email = (customer.email || '').toLowerCase();
    const firstName = (customer.first_name || '').toLowerCase();
    const lastName = (customer.last_name || '').toLowerCase();
    const phone = (customer.phone || '').toLowerCase();
    
    const matchesSearch = email.includes(searchLower) ||
           firstName.includes(searchLower) ||
           lastName.includes(searchLower) ||
           phone.includes(searchLower);

    if (filterBy === 'active') {
      return matchesSearch && (customer.total_orders || 0) > 0;
    }
    if (filterBy === 'inactive') {
      return matchesSearch && (customer.total_orders || 0) === 0;
    }
    
    return matchesSearch;
  });

  const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const getDisplayName = (customer: Customer) => {
    if (customer.first_name || customer.last_name) {
      return `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    }
    return 'N/A';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <UserX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Please log in to access customer management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Enhanced Customer Management</h1>
        <Button onClick={exportCustomers} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_customers}</div>
            <p className="text-xs text-muted-foreground">All registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new_this_month}</div>
            <p className="text-xs text-muted-foreground">New customers this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => (c.total_orders || 0) > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Customers with orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_orders}</div>
            <p className="text-xs text-muted-foreground">All customer orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Join Date</SelectItem>
            <SelectItem value="first_name">First Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="active">Active (with orders)</SelectItem>
            <SelectItem value="inactive">Inactive (no orders)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Customers Table */}
      <div className="bg-white rounded-lg shadow border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-600 mt-2">
              {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                          {getInitials(customer.first_name, customer.last_name, customer.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {getDisplayName(customer)}
                        </div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {customer.city && customer.country ? 
                        `${customer.city}, ${customer.country}` : 
                        customer.country || customer.city || 'Not specified'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.total_orders && customer.total_orders > 0 ? "default" : "secondary"}>
                      {customer.total_orders || 0} orders
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ₵{(customer.total_spent || 0).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(customer.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.total_orders && customer.total_orders > 0 ? "default" : "secondary"}>
                      <UserCheck className="w-3 h-3 mr-1" />
                      {customer.total_orders && customer.total_orders > 0 ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default EnhancedCustomerManager;
