
import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-700 to-red-800 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Mail className="mx-auto mb-4 h-12 w-12 text-white" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Latest Tech
          </h2>
          <p className="text-red-100 text-lg">
            Get exclusive deals, new product alerts, and tech tips delivered to your inbox
          </p>
        </div>
        
        {isSubscribed ? (
          <div className="flex items-center justify-center gap-2 text-white">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <span className="text-lg font-medium">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white"
              required
            />
            <Button 
              type="submit"
              className="bg-white text-red-700 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
