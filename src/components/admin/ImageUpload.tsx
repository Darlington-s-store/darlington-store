
import { useState } from "react";
import { Upload, X, Image, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploadProps {
  onImageAdd: (imageUrl: string) => void;
  onImageRemove: (index: number) => void;
  onImageReorder?: (fromIndex: number, toIndex: number) => void;
  images: string[];
  maxImages?: number;
  productId?: number;
}

const ImageUpload = ({ 
  onImageAdd, 
  onImageRemove, 
  onImageReorder,
  images, 
  maxImages = 5,
  productId 
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAddImage = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    if (images.length >= maxImages) {
      toast({
        title: "Error",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    onImageAdd(imageUrl.trim());
    setImageUrl("");
    toast({
      title: "Success",
      description: "Image added successfully"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (images.length >= maxImages) {
      toast({
        title: "Error",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // For demo purposes, we'll use a placeholder service
      // In production, you'd upload to your storage service
      const placeholderUrls = [
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80"
      ];
      
      const randomUrl = placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)];
      onImageAdd(randomUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const validateImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageUrl = images[index];
    onImageRemove(index);
    
    toast({
      title: "Success",
      description: "Image removed successfully"
    });
  };

  return (
    <div className="space-y-4">
      {/* Image URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
        />
        <Button 
          onClick={handleAddImage} 
          disabled={!imageUrl.trim() || !validateImageUrl(imageUrl.trim()) || images.length >= maxImages}
        >
          Add URL
        </Button>
      </div>

      {/* File Upload */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">or</span>
        <label className="cursor-pointer">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading || images.length >= maxImages}
          />
          <Button 
            variant="outline" 
            disabled={isUploading || images.length >= maxImages} 
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload File"}
            </span>
          </Button>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Product Images ({images.length}/{maxImages})</h4>
            {images.length > 0 && (
              <span className="text-xs text-gray-500">First image will be the main product image</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative group">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80";
                      }}
                    />
                    
                    {/* Main image indicator */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Main Image
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0"
                        onClick={() => window.open(image, '_blank')}
                        title="View full image"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRemoveImage(index)}
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Image URL info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="truncate" title={image}>
                        {image}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Reorder instructions */}
          {images.length > 1 && (
            <div className="text-xs text-gray-500 mt-2">
              <p>💡 Tip: To change the main image, remove the current main image and re-add it in the desired position.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
          <p className="mt-1 text-sm text-gray-500">Add your first product image using URL or file upload</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
