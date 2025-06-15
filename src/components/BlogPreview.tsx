
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "Best Laptops for Students in Ghana 2024",
    excerpt: "Discover affordable yet powerful laptops perfect for students, from budget-friendly options to premium choices.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80",
    date: "2024-06-10",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Mobile Money vs Bank Transfer: Best Payment Methods",
    excerpt: "Compare payment options for online electronics shopping in Ghana and choose what works best for you.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80",
    date: "2024-06-08",
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "How to Choose the Right Smartphone in 2024",
    excerpt: "Complete guide to selecting the perfect smartphone based on your needs, budget, and usage patterns.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80",
    date: "2024-06-05",
    readTime: "7 min read"
  }
];

const BlogPreview = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tech Tips & Guides
          </h2>
          <p className="text-gray-600 text-lg">
            Stay informed with our latest tech insights and buying guides
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition group">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-red-700 transition">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                <Button variant="ghost" className="p-0 h-auto text-red-700 hover:text-red-800 group">
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
