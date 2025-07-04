
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
import { Star, Plus, Edit, Trash2, Check, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_location: string;
  product_purchased: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
}

interface TestimonialFormData {
  customer_name: string;
  customer_location: string;
  product_purchased: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_active: boolean;
}

const AdminTestimonialManager = () => {
  const queryClient = useQueryClient();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    customer_name: '',
    customer_location: '',
    product_purchased: '',
    rating: 5,
    comment: '',
    is_approved: false,
    is_active: true
  });

  // Fetch testimonials
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create testimonial mutation
  const createTestimonial = useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      const { error } = await supabase
        .from('testimonials')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error('Error creating testimonial: ' + error.message);
    }
  });

  // Update testimonial mutation
  const updateTestimonial = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TestimonialFormData> }) => {
      const { error } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully');
      setEditingTestimonial(null);
    },
    onError: (error) => {
      toast.error('Error updating testimonial: ' + error.message);
    }
  });

  // Delete testimonial mutation
  const deleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting testimonial: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_location: '',
      product_purchased: '',
      rating: 5,
      comment: '',
      is_approved: false,
      is_active: true
    });
    setIsCreating(false);
    setEditingTestimonial(null);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      customer_location: testimonial.customer_location,
      product_purchased: testimonial.product_purchased,
      rating: testimonial.rating,
      comment: testimonial.comment,
      is_approved: testimonial.is_approved,
      is_active: testimonial.is_active
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTestimonial) {
      updateTestimonial.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createTestimonial.mutate(formData);
    }
  };

  const handleApprovalToggle = (testimonial: Testimonial) => {
    updateTestimonial.mutate({
      id: testimonial.id,
      data: { is_approved: !testimonial.is_approved }
    });
  };

  const handleActiveToggle = (testimonial: Testimonial) => {
    updateTestimonial.mutate({
      id: testimonial.id,
      data: { is_active: !testimonial.is_active }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Testimonial Management</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Testimonial Management</h1>
          <p className="text-gray-600 mt-1">Manage customer testimonials and reviews</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)} 
          className="bg-red-700 hover:bg-red-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingTestimonial) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_location">Location</Label>
                  <Input
                    id="customer_location"
                    value={formData.customer_location}
                    onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_purchased">Product Purchased</Label>
                  <Input
                    id="product_purchased"
                    value={formData.product_purchased}
                    onChange={(e) => setFormData({ ...formData, product_purchased: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_approved}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_approved: checked })}
                  />
                  <Label>Approved</Label>
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
                  disabled={createTestimonial.isPending || updateTestimonial.isPending}
                >
                  {editingTestimonial ? 'Update' : 'Create'} Testimonial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Testimonials List */}
      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{testimonial.customer_name}</h3>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant={testimonial.is_approved ? "default" : "secondary"}>
                        {testimonial.is_approved ? "Approved" : "Pending"}
                      </Badge>
                      <Badge variant={testimonial.is_active ? "default" : "outline"}>
                        {testimonial.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    <strong>Location:</strong> {testimonial.customer_location} | 
                    <strong> Product:</strong> {testimonial.product_purchased}
                  </p>
                  
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprovalToggle(testimonial)}
                  >
                    {testimonial.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActiveToggle(testimonial)}
                  >
                    {testimonial.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTestimonial.mutate(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No testimonials found. Create your first testimonial!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTestimonialManager;
