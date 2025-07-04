
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

interface BrandFormData {
  name: string;
  logo_url: string;
  description: string;
  website_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

const AdminBrandManager = () => {
  const queryClient = useQueryClient();
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    logo_url: '',
    description: '',
    website_url: '',
    is_featured: false,
    is_active: true,
    display_order: 0
  });

  // Fetch brands
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create brand mutation
  const createBrand = useMutation({
    mutationFn: async (data: BrandFormData) => {
      const { error } = await supabase
        .from('brands')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      toast.success('Brand created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Error creating brand: ' + error.message);
    }
  });

  // Update brand mutation
  const updateBrand = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BrandFormData> }) => {
      const { error } = await supabase
        .from('brands')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      toast.success('Brand updated successfully');
      setEditingBrand(null);
    },
    onError: (error) => {
      toast.error('Error updating brand: ' + error.message);
    }
  });

  // Delete brand mutation
  const deleteBrand = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      toast.success('Brand deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting brand: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      description: '',
      website_url: '',
      is_featured: false,
      is_active: true,
      display_order: 0
    });
    setIsCreating(false);
    setEditingBrand(null);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logo_url: brand.logo_url || '',
      description: brand.description || '',
      website_url: brand.website_url || '',
      is_featured: brand.is_featured,
      is_active: brand.is_active,
      display_order: brand.display_order
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBrand) {
      updateBrand.mutate({ id: editingBrand.id, data: formData });
    } else {
      createBrand.mutate(formData);
    }
  };

  const handleFeaturedToggle = (brand: Brand) => {
    updateBrand.mutate({
      id: brand.id,
      data: { is_featured: !brand.is_featured }
    });
  };

  const handleActiveToggle = (brand: Brand) => {
    updateBrand.mutate({
      id: brand.id,
      data: { is_active: !brand.is_active }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600 mt-1">Manage brand partnerships and featured brands</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)} 
          className="bg-red-700 hover:bg-red-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingBrand) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBrand ? 'Edit Brand' : 'Create New Brand'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of the brand..."
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>Featured Brand</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-red-700 hover:bg-red-800"
                  disabled={createBrand.isPending || updateBrand.isPending}
                >
                  {editingBrand ? 'Update' : 'Create'} Brand
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Brands List */}
      <div className="grid gap-4">
        {brands.map((brand) => (
          <Card key={brand.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {brand.logo_url && (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="w-16 h-16 object-contain rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{brand.name}</h3>
                    <div className="flex space-x-2">
                      {brand.is_featured && (
                        <Badge variant="default" className="bg-yellow-500">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant={brand.is_active ? "default" : "outline"}>
                        {brand.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="secondary">
                        Order: {brand.display_order}
                      </Badge>
                    </div>
                  </div>
                  
                  {brand.description && (
                    <p className="text-gray-600 mb-2">{brand.description}</p>
                  )}
                  
                  {brand.website_url && (
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      Visit Website <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(brand.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeaturedToggle(brand)}
                  >
                    <Star className={`w-4 h-4 ${brand.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActiveToggle(brand)}
                  >
                    {brand.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(brand)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBrand.mutate(brand.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {brands.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No brands found. Create your first brand!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBrandManager;
