
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, [user, loading]);

  const checkAdminAccess = async () => {
    if (loading) return;

    if (!user) {
      console.log('No user found, redirecting to admin login');
      navigate('/admin/login');
      return;
    }

    try {
      console.log('Checking admin access for user:', user.id);
      
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user role:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin privileges.",
          variant: "destructive"
        });
        navigate('/admin/login');
        return;
      }

      const hasAdminRole = roleData && roleData.role === 'admin';
      console.log('User role check:', { hasAdminRole, roleData });

      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive"
        });
        navigate('/admin/login');
        return;
      }

      setIsAdmin(true);
    } catch (err) {
      console.error('Error checking admin access:', err);
      navigate('/admin/login');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading while checking authentication
  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Only render admin layout if user is confirmed admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <AdminTopBar onMenuClick={toggleSidebar} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
