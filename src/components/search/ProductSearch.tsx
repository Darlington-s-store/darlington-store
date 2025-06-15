
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SearchFilters {
  searchTerm: string;
  categoryId: string;
  brand: string;
  priceRange: [number, number];
  inStock: boolean;
  featured: boolean;
}

const defaultFilters: SearchFilters = {
  searchTerm: '',
  categoryId: '',
  brand: '',
  priceRange: [0, 10000],
  inStock: false,
  featured: false,
};

export default function ProductSearch() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch brands for filter dropdown
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .eq('is_active', true);
      
      if (error) throw error;
      const uniqueBrands = [...new Set(data.map(p => p.brand))].filter(Boolean);
      return uniqueBrands;
    }
  });

  // Main products query with filters
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-search', debouncedSearchTerm, filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      // Apply search term
      if (debouncedSearchTerm) {
        query = query.or(`name.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%,brand.ilike.%${debouncedSearchTerm}%`);
      }

      // Apply category filter
      if (filters.categoryId) {
        query = query.eq('category_id', parseInt(filters.categoryId));
      }

      // Apply brand filter
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }

      // Apply price range filter
      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);

      // Apply stock filter
      if (filters.inStock) {
        query = query.gt('stock_quantity', 0);
      }

      // Apply featured filter
      if (filters.featured) {
        query = query.eq('featured', true);
      }

      // Order by relevance (featured first, then by name)
      query = query.order('featured', { ascending: false })
                  .order('name', { ascending: true });

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  const handleAddToWishlist = (product: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      brand: product.brand,
      rating: 4.5
    };

    const existingWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
    const isAlreadyInWishlist = existingWishlist.some((item: any) => item.id === product.id);

    if (isAlreadyInWishlist) {
      alert('Item is already in your wishlist!');
      return;
    }

    const updatedWishlist = [...existingWishlist, wishlistItem];
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist));
    
    window.dispatchEvent(new Event('wishlistUpdated'));
    alert(`Added ${product.name} to wishlist!`);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'searchTerm') return value !== '';
    if (key === 'priceRange') return value[0] !== 0 || value[1] !== 10000;
    if (key === 'categoryId' || key === 'brand') return value !== '';
    return value === true;
  }).length;

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search products, brands, or descriptions..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={filters.categoryId} onValueChange={(value) => updateFilter('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-sm font-medium">Brand</label>
                <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium">
                  Price Range: ₵{filters.priceRange[0]} - ₵{filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                  max={10000}
                  min={0}
                  step={100}
                  className="mt-2"
                />
              </div>

              {/* Boolean Filters */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">In Stock Only</label>
                  <Button
                    variant={filters.inStock ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('inStock', !filters.inStock)}
                  >
                    {filters.inStock ? 'On' : 'Off'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Featured Only</label>
                  <Button
                    variant={filters.featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('featured', !filters.featured)}
                  >
                    {filters.featured ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.searchTerm}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('searchTerm', '')} 
              />
            </Badge>
          )}
          {filters.categoryId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find(c => c.id.toString() === filters.categoryId)?.name}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('categoryId', '')} 
              />
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Brand: {filters.brand}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('brand', '')} 
              />
            </Badge>
          )}
          {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: ₵{filters.priceRange[0]} - ₵{filters.priceRange[1]}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('priceRange', [0, 10000])} 
              />
            </Badge>
          )}
          {filters.inStock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              In Stock
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('inStock', false)} 
              />
            </Badge>
          )}
          {filters.featured && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Featured
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('featured', false)} 
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            {isLoading ? 'Searching...' : `${products.length} product(s) found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg shadow-md border animate-pulse">
                <div className="w-full h-44 bg-gray-300 rounded-t-lg" />
                <div className="px-4 py-3 space-y-2">
                  <div className="h-6 bg-gray-300 rounded" />
                  <div className="h-4 bg-gray-300 rounded" />
                  <div className="h-6 bg-gray-300 rounded" />
                  <div className="h-10 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
