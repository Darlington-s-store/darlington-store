
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();

    // Add loading animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleSuccess = () => {
    if (mode === 'signup') {
      alert('Account created successfully! Please check your email to verify your account.');
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-800 to-red-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Main Content */}
      <main className={`relative z-10 flex items-center justify-center min-h-screen py-12 px-4 transition-all duration-700 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="w-full max-w-md">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Auth Form with Glass Effect */}
          <div className="relative backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl border border-white/20 p-8 animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
            <div className="relative z-10">
              <AuthForm 
                mode={mode} 
                onToggleMode={handleToggleMode}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Auth;
