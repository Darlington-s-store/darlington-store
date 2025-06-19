
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, X, Star, Truck, Shield, Clock, Grid, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SearchFilters {
  searchTerm: string;
  categoryId: string;
  brand: string;
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  featured: boolean;
  sortBy: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  brand: string | null;
  model: string | null;
  category_id: number | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  image_url: string | null;
  images: any;
  sku: string | null;
  weight: number | null;
  featured: boolean | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
  } | null;
}

const defaultFilters: SearchFilters = {
  searchTerm: '',
  categoryId: '',
  brand: '',
  priceRange: [0, 10000],
  rating: 0,
  inStock: false,
  featured: false,
  sortBy: 'newest',
};

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Best Rating' },
];

export default function EnhancedProductSearch() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debounce search term for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Fetch categories
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

  // Fetch brands
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .eq('is_active', true);
      if (error) throw error;
      return [...new Set(data.map(p => p.brand))].filter(Boolean);
    }
  });

  // Main products query with optimized performance
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products-enhanced-search', debouncedSearchTerm, filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          brand,
          model,
          category_id,
          stock_quantity,
          is_active,
          image_url,
          images,
          sku,
          weight,
          featured,
          status,
          created_at,
          updated_at,
          categories(name)
        `)
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

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('featured', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      return (data as Product[]) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Group products by category for better organization
  const productsByCategory = useMemo(() => {
    const grouped = allProducts.reduce((acc, product) => {
      const categoryName = product.categories?.name || 'Other';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
    
    return grouped;
  }, [allProducts]);

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleAddToWishlist = (product: Product) => {
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
    if (key === 'categoryId' || key === 'brand' || key === 'sortBy') return value !== '' && value !== 'newest';
    if (key === 'rating') return value > 0;
    return value === true;
  }).length;

  return (
    <div className="space-y-6">
      {/* Enhanced Search Header with Jumia-inspired features */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for products, brands, or categories..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger className="min-w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

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
                  <h3 className="font-semibold">Advanced Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
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
                  <label className="text-sm font-medium mb-2 block">Brand</label>
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
                  <label className="text-sm font-medium mb-2 block">
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

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant={filters.rating >= rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateFilter('rating', rating)}
                        className="p-1"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
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
          </div>
        </div>

        {/* Trust badges - Jumia inspired */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Verified Products</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Easy Returns</span>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.searchTerm}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('searchTerm', '')} />
            </Badge>
          )}
          {filters.categoryId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find(c => c.id.toString() === filters.categoryId)?.name}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('categoryId', '')} />
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Brand: {filters.brand}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('brand', '')} />
            </Badge>
          )}
        </div>
      )}

      {/* Results Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-lg">
            {isLoading ? 'Searching...' : 
             Object.keys(productsByCategory).length > 0 ? 
             `${allProducts.length} products found in ${Object.keys(productsByCategory).length} categories` : 
             'No products found'}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
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
        ) : Object.keys(productsByCategory).length === 0 ? (
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
          <Tabs defaultValue={Object.keys(productsByCategory)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Object.keys(productsByCategory).slice(0, 6).map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category} ({productsByCategory[category].length})
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(productsByCategory).map(([category, products]) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                  <p className="text-gray-600">{products.length} products available</p>
                </div>
                
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
