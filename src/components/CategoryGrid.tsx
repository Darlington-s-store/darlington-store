
const categories = [
  {
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=420&q=80",
  },
  {
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=420&q=80",
  },
  {
    name: "Headphones",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=420&q=80",
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full py-10 px-2 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold mb-1">Shop by Category</h2>
        <p className="text-gray-500 text-base mb-4">
          Browse our extensive collection of premium electronics, carefully curated for the Ghanaian market.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition group">
            <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" />
            <div className="py-3 text-lg font-semibold group-hover:text-red-700 text-gray-800 text-center">{cat.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
