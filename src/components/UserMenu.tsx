
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Heart, Package, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Link to="/admin">
          <Button variant="outline" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Admin
          </Button>
        </Link>
        <Link to="/auth">
          <Button variant="outline" className="flex items-center gap-1 border">
            <User className="mr-1 h-4 w-4" />
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      setIsOpen(false);
      
      // Use Supabase client directly for sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
        // Navigate to home page after successful sign out
        navigate('/');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return user.email;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="rounded-full px-2 py-2"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="text-gray-700" />
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed md:absolute right-4 md:right-0 top-[120px] md:top-full md:mt-2 w-[calc(100vw-2rem)] max-w-xs md:w-64 bg-white rounded-md shadow-xl border z-[101] max-h-[calc(100vh-5rem)] md:max-h-[80vh] overflow-y-auto">
            <div className="py-1">
              <div className="px-4 py-3 border-b bg-gray-50">
                <p className="text-xs text-gray-500 mb-1">Welcome back!</p>
                <p className="text-sm font-medium text-gray-900 truncate">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">Email: {user.email}</p>
              </div>
              
              <div className="py-1">
                <Link
                  to="/account"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span>Account Settings</span>
                </Link>
                
                <Link
                  to="/orders"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span>My Orders</span>
                </Link>
                
                <Link
                  to="/wishlist"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span>Wishlist</span>
                </Link>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
