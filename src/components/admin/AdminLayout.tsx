
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

    // Simple email-based admin check - no role system needed
    if (user.email !== 'admin@darlingtonstore.com') {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive"
      });
      navigate('/admin/login');
      return;
    }

    console.log('Admin access confirmed based on email');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Only render admin layout if user is admin email
  if (!user || user.email !== 'admin@darlingtonstore.com') {
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
