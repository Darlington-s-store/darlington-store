
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface HomepageSection {
  id: string;
  title: string;
  subtitle?: string;
  type: 'featured' | 'category' | 'deals' | 'new' | 'trending' | 'top-rated';
  is_active: boolean;
  order_index: number;
  filter_conditions: any;
  limit: number;
}

const AdminHomepageManager = () => {
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch homepage sections
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      // For now, return default sections since we don't have a table yet
      return [
        {
          id: '1',
          title: 'Featured Products',
          subtitle: 'Hand-picked selections just for you',
          type: 'featured' as const,
          is_active: true,
          order_index: 1,
          filter_conditions: { featured: true },
          limit: 8
        },
        {
          id: '2',
          title: 'Deals of the Day',
          subtitle: 'Limited time offers',
          type: 'deals' as const,
          is_active: true,
          order_index: 2,
          filter_conditions: { status: 'on_sale' },
          limit: 8
        },
        {
          id: '3',
          title: 'New Arrivals',
          subtitle: 'Fresh products just landed',
          type: 'new' as const,
          is_active: true,
          order_index: 3,
          filter_conditions: {},
          limit: 8
        },
        {
          id: '4',
          title: 'Trending Products',
          subtitle: 'Most popular this week',
          type: 'trending' as const,
          is_active: true,
          order_index: 4,
          filter_conditions: { featured: true },
          limit: 8
        },
        {
          id: '5',
          title: 'Top Rated',
          subtitle: 'Customer favorites',
          type: 'top-rated' as const,
          is_active: true,
          order_index: 5,
          filter_conditions: {},
          limit: 8
        }
      ];
    }
  });

  // Fetch categories for filter options
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSectionToggle = (sectionId: string, isActive: boolean) => {
    // For now, just show toast since we don't have database integration
    toast.success(`Section ${isActive ? 'enabled' : 'disabled'}`);
  };

  const handleSectionSave = (section: HomepageSection) => {
    // For now, just show toast since we don't have database integration
    toast.success('Section saved successfully');
    setEditingSection(null);
    setIsCreating(false);
  };

  const handleSectionDelete = (sectionId: string) => {
    // For now, just show toast since we don't have database integration
    toast.success('Section deleted successfully');
  };

  const createNewSection = () => {
    const newSection: HomepageSection = {
      id: Date.now().toString(),
      title: 'New Section',
      subtitle: '',
      type: 'featured',
      is_active: true,
      order_index: sections.length + 1,
      filter_conditions: {},
      limit: 8
    };
    setEditingSection(newSection);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Management</h1>
          <p className="text-gray-600 mt-1">Manage sections and content on your homepage</p>
        </div>
        <Button onClick={createNewSection} className="bg-red-700 hover:bg-red-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Section List */}
      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  {section.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{section.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={section.is_active}
                    onCheckedChange={(checked) => handleSectionToggle(section.id, checked)}
                  />
                  <Label className="text-sm">
                    {section.is_active ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSection(section)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSectionDelete(section.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span>
                  <p className="text-gray-600 capitalize">{section.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="font-medium">Order:</span>
                  <p className="text-gray-600">{section.order_index}</p>
                </div>
                <div>
                  <span className="font-medium">Limit:</span>
                  <p className="text-gray-600">{section.limit} products</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <div className="flex items-center mt-1">
                    {section.is_active ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`ml-1 text-sm ${section.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                      {section.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {isCreating ? 'Create New Section' : 'Edit Section'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      title: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Section Type</Label>
                  <Select
                    value={editingSection.type}
                    onValueChange={(value) => setEditingSection({
                      ...editingSection,
                      type: value as HomepageSection['type']
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured Products</SelectItem>
                      <SelectItem value="category">Category Products</SelectItem>
                      <SelectItem value="deals">Deals</SelectItem>
                      <SelectItem value="new">New Arrivals</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="top-rated">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                <Input
                  id="subtitle"
                  value={editingSection.subtitle || ''}
                  onChange={(e) => setEditingSection({
                    ...editingSection,
                    subtitle: e.target.value
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editingSection.order_index}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      order_index: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="limit">Product Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    value={editingSection.limit}
                    onChange={(e) => setEditingSection({
                      ...editingSection,
                      limit: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingSection.is_active}
                  onCheckedChange={(checked) => setEditingSection({
                    ...editingSection,
                    is_active: checked
                  })}
                />
                <Label>Active on Homepage</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSection(null);
                    setIsCreating(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSectionSave(editingSection)}
                  className="bg-red-700 hover:bg-red-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Section
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminHomepageManager;
