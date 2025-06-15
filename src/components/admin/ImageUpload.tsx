
import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ImagePreview from "./ImagePreview";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
}

export default function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 5,
  maxFileSize = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check if we're at max images
    if (images.length >= maxImages) {
      return `Maximum ${maxImages} images allowed`;
    }

    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        continue;
      }

      try {
        // Initialize progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Simulate upload progress (replace with actual upload logic)
        const reader = new FileReader();
        
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            newImages.push(result);
            
            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
              progress += 20;
              setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
              
              if (progress >= 100) {
                clearInterval(interval);
                resolve(result);
              }
            }, 100);
          };
          
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Clean up progress
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });

      } catch (error) {
        console.error('Upload error:', error);
        errors.push(`${file.name}: Upload failed`);
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
      toast({
        title: "Success",
        description: `${newImages.length} image(s) uploaded successfully`,
      });
    }

    if (errors.length > 0) {
      toast({
        title: "Upload Errors",
        description: errors.join(', '),
        variant: "destructive",
      });
    }

    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
    toast({
      title: "Image Removed",
      description: "Image has been removed from the product",
    });
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0 && fileInputRef.current) {
      // Set files to the file input and trigger change event
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      fileInputRef.current.files = dt.files;
      
      // Create a proper change event
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images ({images.length}/{maxImages})
        </label>
        <span className="text-xs text-gray-500">
          Max {maxFileSize}MB per image
        </span>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || images.length >= maxImages}
            >
              {uploading ? 'Uploading...' : 'Choose Images'}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            or drag and drop images here
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading...</h4>
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{filename}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {progress === 100 && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <ImagePreview
                key={index}
                src={image}
                alt={`Product image ${index + 1}`}
                onRemove={() => handleRemoveImage(index)}
                onPreview={() => setPreviewImage(image)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Usage Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <h4 className="font-medium mb-1">Image Guidelines</h4>
            <ul className="space-y-1 text-xs">
              <li>• Use high-quality images for better customer experience</li>
              <li>• First image will be used as the main product image</li>
              <li>• Recommended size: 800x800px or larger</li>
              <li>• Supported formats: JPG, PNG, WebP</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl max-h-full p-4">
            <img 
              src={previewImage} 
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
