
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, User, Heart, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

const UserMenu = () => {
  const { user, signOut } = useAuth();
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
      <Link to="/auth">
        <Button variant="outline" className="ml-1 flex items-center gap-1 border">
          <User className="mr-1 h-4 w-4" />
          Sign In
        </Button>
      </Link>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
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
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
            <div className="py-1">
              <div className="px-4 py-2 border-b">
                <p className="text-sm text-gray-500">Welcome back!</p>
                <p className="text-sm font-medium truncate">{getDisplayName()}</p>
              </div>
              
              <Link
                to="/account"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
              
              <Link
                to="/orders"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Package className="mr-2 h-4 w-4" />
                My Orders
              </Link>
              
              <Link
                to="/wishlist"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </Link>
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
