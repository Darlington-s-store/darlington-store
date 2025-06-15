
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Folder } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  image_url: string | null;
}

const AdminCategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        // Log the activity
        await supabase
          .from('activity_logs')
          .insert({
            action: 'update_category',
            resource_type: 'category',
            resource_id: editingCategory.id.toString(),
            details: { name: formData.name }
          });

        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null
          });

        if (error) throw error;

        // Log the activity
        await supabase
          .from('activity_logs')
          .insert({
            action: 'create_category',
            resource_type: 'category',
            details: { name: formData.name }
          });

        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      setDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', image_url: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || ''
    });
    setDialogOpen(true);
  };

  const toggleCategoryStatus = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ 
          is_active: !category.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id);

      if (error) throw error;

      // Log the activity
      await supabase
        .from('activity_logs')
        .insert({
          action: 'toggle_category_status',
          resource_type: 'category',
          resource_id: category.id.toString(),
          details: { is_active: !category.is_active }
        });

      toast({
        title: "Success",
        description: `Category ${!category.is_active ? 'activated' : 'deactivated'}`,
      });

      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast({
        title: "Error",
        description: "Failed to update category status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '', image_url: '' });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  type="url"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {category.image_url ? (
                          <img 
                            src={category.image_url} 
                            alt={category.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          <Folder className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="font-medium">{category.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-gray-600">
                      {category.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={category.is_active ? "default" : "secondary"}
                      className={category.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(category.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCategoryStatus(category)}
                      >
                        {category.is_active ? (
                          <Trash2 className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryManager;
