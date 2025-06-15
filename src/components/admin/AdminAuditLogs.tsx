
import { useState, useEffect } from "react";
import { Activity, Calendar, User, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  created_at: string;
}

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (actionFilter !== "all") {
        query = query.eq('action', actionFilter);
      }

      if (resourceFilter !== "all") {
        query = query.eq('resource_type', resourceFilter);
      }

      if (dateFilter) {
        const startDate = new Date(dateFilter);
        const endDate = new Date(dateFilter);
        endDate.setDate(endDate.getDate() + 1);
        
        query = query
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString());
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, resourceFilter, dateFilter]);

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'bg-green-100 text-green-800';
    if (action.includes('update')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDetails = (details: any) => {
    if (!details) return 'No details';
    
    return Object.entries(details).map(([key, value]) => 
      `${key}: ${JSON.stringify(value)}`
    ).join(', ');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create_product">Create Product</SelectItem>
            <SelectItem value="update_product">Update Product</SelectItem>
            <SelectItem value="create_category">Create Category</SelectItem>
            <SelectItem value="update_category">Update Category</SelectItem>
            <SelectItem value="update_user_role">Update User Role</SelectItem>
            <SelectItem value="update_order_status">Update Order Status</SelectItem>
          </SelectContent>
        </Select>

        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="product">Products</SelectItem>
            <SelectItem value="category">Categories</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="order">Orders</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-48"
          placeholder="Filter by date"
        />

        <Button
          variant="outline"
          onClick={() => {
            setActionFilter("all");
            setResourceFilter("all");
            setDateFilter("");
          }}
        >
          Clear Filters
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading audit logs...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>
                      {formatAction(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="capitalize">{log.resource_type}</span>
                      {log.resource_id && (
                        <span className="text-xs text-gray-500">
                          #{log.resource_id}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-600 font-mono">
                      {log.user_id ? log.user_id.slice(0, 8) + '...' : 'System'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {formatDetails(log.details)}
                    </div>
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

export default AdminAuditLogs;
