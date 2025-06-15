
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ProductVariant {
  id: string;
  product_id: number;
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock_quantity: number;
  sku: string | null;
  is_active: boolean;
}

interface ProductVariantsManagerProps {
  productId: number;
  productName: string;
}

const ProductVariantsManager = ({ productId, productName }: ProductVariantsManagerProps) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    variant_name: '',
    variant_value: '',
    price_adjustment: '0',
    stock_quantity: '0',
    sku: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVariants();
  }, [productId]);

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product variants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = async () => {
    try {
      const variantData = {
        product_id: productId,
        variant_name: formData.variant_name,
        variant_value: formData.variant_value,
        price_adjustment: parseFloat(formData.price_adjustment),
        stock_quantity: parseInt(formData.stock_quantity),
        sku: formData.sku || null,
        is_active: true
      };

      const { error } = await supabase
        .from('product_variants')
        .insert(variantData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product variant added successfully"
      });

      setIsAddDialogOpen(false);
      setFormData({
        variant_name: '',
        variant_value: '',
        price_adjustment: '0',
        stock_quantity: '0',
        sku: ''
      });
      fetchVariants();
    } catch (error) {
      console.error('Error adding variant:', error);
      toast({
        title: "Error",
        description: "Failed to add product variant",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product variant deleted successfully"
      });

      fetchVariants();
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast({
        title: "Error",
        description: "Failed to delete product variant",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Variants for {productName}</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product Variant</DialogTitle>
              <DialogDescription>
                Create a new variant for this product (e.g., size, color).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variant_name" className="text-right">Name *</Label>
                <Input
                  id="variant_name"
                  value={formData.variant_name}
                  onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Size, Color"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variant_value" className="text-right">Value *</Label>
                <Input
                  id="variant_value"
                  value={formData.variant_value}
                  onChange={(e) => setFormData({ ...formData, variant_value: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Large, Red"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price_adjustment" className="text-right">Price Adjustment</Label>
                <Input
                  id="price_adjustment"
                  type="number"
                  step="0.01"
                  value={formData.price_adjustment}
                  onChange={(e) => setFormData({ ...formData, price_adjustment: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock_quantity" className="text-right">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddVariant} 
                disabled={!formData.variant_name || !formData.variant_value}
              >
                Add Variant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading variants...</div>
      ) : variants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No variants found. Add variants to manage different sizes, colors, etc.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Price Adjustment</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>{variant.variant_name}</TableCell>
                <TableCell>{variant.variant_value}</TableCell>
                <TableCell>₦{variant.price_adjustment.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={variant.stock_quantity > 0 ? "default" : "destructive"}>
                    {variant.stock_quantity}
                  </Badge>
                </TableCell>
                <TableCell>{variant.sku || '-'}</TableCell>
                <TableCell>
                  <Badge variant={variant.is_active ? "default" : "secondary"}>
                    {variant.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ProductVariantsManager;
