
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Kwame Asante",
    location: "Accra",
    rating: 5,
    comment: "Amazing service! Got my MacBook delivered in 2 days. The quality is exactly as described.",
    product: "MacBook Pro 13''"
  },
  {
    id: 2,
    name: "Ama Osei",
    location: "Kumasi",
    rating: 5,
    comment: "Best electronics store in Ghana! Mobile money payment was so convenient.",
    product: "iPhone 14"
  },
  {
    id: 3,
    name: "Michael Addo",
    location: "Tema",
    rating: 5,
    comment: "Fast delivery and excellent customer service. Will definitely shop here again!",
    product: "Gaming Laptop"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of satisfied customers across Ghana
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.comment}"
              </p>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
                <p className="text-sm text-red-600 font-medium">{testimonial.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
