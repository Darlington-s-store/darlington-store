
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Admin functionality has been disabled
    toast({
      title: "Admin Access Disabled",
      description: "Admin functionality is currently not available.",
      variant: "destructive"
    });
    navigate('/');
  }, [navigate, toast]);

  return null;
};

export default AdminLayout;
