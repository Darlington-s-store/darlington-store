
import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  console.log('AdminLayout - Rendering admin interface (no auth required)');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <AdminTopBar onMenuClick={toggleSidebar} />
        
        <main className="p-6 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
