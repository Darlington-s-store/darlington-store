
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ProductTag {
  id: string;
  name: string;
  color: string;
}

interface ProductTagsManagerProps {
  productId: number;
  productName: string;
}

const ProductTagsManager = ({ productId, productName }: ProductTagsManagerProps) => {
  const [allTags, setAllTags] = useState<ProductTag[]>([]);
  const [productTags, setProductTags] = useState<ProductTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
    fetchProductTags();
  }, [productId]);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('product_tags')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAllTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchProductTags = async () => {
    try {
      const { data, error } = await supabase
        .from('product_tag_assignments')
        .select(`
          product_tags (
            id,
            name,
            color
          )
        `)
        .eq('product_id', productId);

      if (error) throw error;
      
      const tags = data?.map(item => item.product_tags).filter(Boolean) || [];
      setProductTags(tags as ProductTag[]);
    } catch (error) {
      console.error('Error fetching product tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('product_tags')
        .insert({ name: newTagName.trim() })
        .select()
        .single();

      if (error) throw error;

      setAllTags([...allTags, data]);
      setNewTagName('');
      
      toast({
        title: "Success",
        description: "Tag created successfully"
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive"
      });
    }
  };

  const addTagToProduct = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('product_tag_assignments')
        .insert({
          product_id: productId,
          tag_id: tagId
        });

      if (error) throw error;

      fetchProductTags();
      
      toast({
        title: "Success",
        description: "Tag added to product"
      });
    } catch (error) {
      console.error('Error adding tag to product:', error);
      toast({
        title: "Error",
        description: "Failed to add tag to product",
        variant: "destructive"
      });
    }
  };

  const removeTagFromProduct = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('product_tag_assignments')
        .delete()
        .eq('product_id', productId)
        .eq('tag_id', tagId);

      if (error) throw error;

      fetchProductTags();
      
      toast({
        title: "Success",
        description: "Tag removed from product"
      });
    } catch (error) {
      console.error('Error removing tag from product:', error);
      toast({
        title: "Error",
        description: "Failed to remove tag from product",
        variant: "destructive"
      });
    }
  };

  const availableTags = allTags.filter(
    tag => !productTags.some(productTag => productTag.id === tag.id)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tags for {productName}</h3>
      
      {/* Current Product Tags */}
      <div>
        <h4 className="text-sm font-medium mb-2">Current Tags:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {productTags.length === 0 ? (
            <span className="text-sm text-gray-500">No tags assigned</span>
          ) : (
            productTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                {tag.name}
                <button
                  onClick={() => removeTagFromProduct(tag.id)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Add Existing Tags */}
      <div>
        <h4 className="text-sm font-medium mb-2">Add Existing Tags:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {availableTags.length === 0 ? (
            <span className="text-sm text-gray-500">No available tags</span>
          ) : (
            availableTags.map((tag) => (
              <Button
                key={tag.id}
                variant="outline"
                size="sm"
                onClick={() => addTagToProduct(tag.id)}
              >
                + {tag.name}
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Create New Tag */}
      <div>
        <h4 className="text-sm font-medium mb-2">Create New Tag:</h4>
        <div className="flex gap-2">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            onKeyPress={(e) => e.key === 'Enter' && createTag()}
          />
          <Button onClick={createTag} disabled={!newTagName.trim()}>
            <Plus className="w-4 h-4 mr-1" />
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTagsManager;
