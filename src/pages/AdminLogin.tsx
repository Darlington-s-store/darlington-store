
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Shield, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@darlingtonstore.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAndSetupAdmin();
    }
  }, [user, navigate]);

  const checkAndSetupAdmin = async () => {
    if (!user) return;

    try {
      console.log('Checking admin setup for user:', user.id);
      
      // First, ensure the user has a profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating profile for admin user');
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: 'Admin',
            last_name: 'User',
            email: user.email
          });

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
        }
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (roleError && roleError.code === 'PGRST116') {
        // No admin role found, create it for admin email
        if (user.email === 'admin@darlingtonstore.com') {
          console.log('Assigning admin role to user');
          const { error: assignRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: 'admin'
            });

          if (assignRoleError) {
            console.error('Error assigning admin role:', assignRoleError);
            toast({
              title: "Setup Error",
              description: "Could not assign admin role. Please try again.",
              variant: "destructive"
            });
            return;
          }
        }
      }

      // Final check - verify admin role
      const { data: finalRoleCheck } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (finalRoleCheck && finalRoleCheck.role === 'admin') {
        console.log('Admin role confirmed, redirecting to admin panel');
        navigate('/admin');
      } else if (user.email === 'admin@darlingtonstore.com') {
        toast({
          title: "Setup Required",
          description: "Admin role assignment failed. Please contact support.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error in admin setup:', err);
      toast({
        title: "Error",
        description: "An error occurred during admin setup.",
        variant: "destructive"
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (email !== 'admin@darlingtonstore.com') {
      toast({
        title: "Error",
        description: "Admin account can only be created with admin@darlingtonstore.com email.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting admin signup...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
          data: {
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@darlingtonstore.com'
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        
        if (error.message.includes('User already registered')) {
          toast({
            title: "Account Exists",
            description: "This admin account already exists. Please use the login form instead.",
            variant: "destructive"
          });
          setIsSignUp(false);
          return;
        }
        
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        console.log('Admin user created successfully');
        toast({
          title: "Success",
          description: "Admin account created successfully! You are now logged in.",
        });
        
        // The user will be automatically logged in and useEffect will handle setup
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred during signup.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting admin login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          if (email === 'admin@darlingtonstore.com') {
            toast({
              title: "Login Failed",
              description: "Invalid credentials. If you haven't created an admin account yet, use the 'Create Admin Account' option below.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login Failed",
              description: "Invalid email or password.",
              variant: "destructive"
            });
          }
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before logging in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }

      if (data.user) {
        console.log('User logged in successfully');
        toast({
          title: "Success",
          description: "Login successful! Setting up admin access...",
        });
        
        // The useEffect will handle admin setup and redirection
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred during login.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-red-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/95 border border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create Admin Account' : 'Admin Login'}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isSignUp ? 'Set up your admin account' : 'Access the admin dashboard'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@darlingtonstore.com"
                  required
                  className="w-full"
                  disabled={isSignUp} // Lock email for admin signup
                />
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Admin account must use: admin@darlingtonstore.com
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? "Create a secure password (min 6 chars)" : "Enter your password"}
                    required
                    className="w-full pr-10"
                    minLength={isSignUp ? 6 : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Choose a secure password (minimum 6 characters)
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    {isSignUp ? 'Create Admin Account' : 'Sign In'}
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPassword(""); // Clear password when switching modes
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
                disabled={loading}
              >
                {isSignUp ? '← Back to Login' : 'Need to create admin account? →'}
              </button>
            </div>

            {!isSignUp && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>First time?</strong> If you haven't created an admin account yet, click "Need to create admin account?" above.
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
                disabled={loading}
              >
                ← Back to Main Site
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
