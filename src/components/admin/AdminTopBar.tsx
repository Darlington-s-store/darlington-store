
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, User, Bell, Settings, Printer } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface AdminTopBarProps {
  onMenuClick: () => void;
}

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

const AdminTopBar = ({ onMenuClick }: AdminTopBarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Admin signing out...');
      setIsDropdownOpen(false);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Error",
          description: "Failed to sign out.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been signed out successfully.",
        });
        navigate('/admin/login');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handlePrintReceipt = () => {
    toast({
      title: "Print Receipt",
      description: "Receipt printing functionality activated.",
    });
    
    // Create a simple receipt template
    const receiptContent = `
      <div style="font-family: monospace; max-width: 300px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px;">
          <h2>DAR STORE</h2>
          <p>Ghana's Premier Electronics Store</p>
          <p>Tanoso - Kumasi, Ashanti Ghana</p>
          <p>Tel: 0552945333</p>
        </div>
        <div style="margin-bottom: 10px;">
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          <p><strong>Receipt #:</strong> ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
        <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
          <p><strong>SAMPLE RECEIPT</strong></p>
          <p>This is a test receipt print.</p>
        </div>
        <div style="text-align: center; margin-top: 10px;">
          <p>Thank you for your business!</p>
          <p>Visit us again soon</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { margin: 0; padding: 20px; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${receiptContent}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return user?.email || 'Admin';
  };

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      const firstName = profile.first_name || '';
      const lastName = profile.last_name || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'A';
  };

  return (
    <header className="bg-background border-b border-border px-6 fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Right side - Print, Notifications and user menu */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrintReceipt}
            className="relative"
            title="Print Receipt"
          >
            <Printer className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-red-100 text-red-700 text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground/80 hidden md:block">
                {getDisplayName()}
              </span>
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-20">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-popover-foreground">{getDisplayName()}</p>
                      <p className="text-xs text-popover-foreground/70">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/admin/settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
