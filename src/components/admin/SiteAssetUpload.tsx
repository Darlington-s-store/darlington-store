
import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SiteAssetUploadProps {
  label: string;
  currentUrl: string | null | undefined;
  onUploadSuccess: (url: string) => void;
  bucket: string;
  folder?: string;
}

export default function SiteAssetUpload({ label, currentUrl, onUploadSuccess, bucket, folder = 'public' }: SiteAssetUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please select an image file.", variant: "destructive" });
        return;
    }

    setIsUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${label.toLowerCase().replace(' ', '-')}-${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
        
        onUploadSuccess(publicUrl);

        toast({
            title: "Success!",
            description: `${label} uploaded successfully.`
        });

    } catch (error: any) {
        toast({
            title: "Upload Error",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive"
        });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-center space-x-4">
        {currentUrl ? (
          <img src={currentUrl} alt={label} className="w-16 h-16 bg-gray-200 rounded-lg object-contain" />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-sm text-gray-500">None</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.ico"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  );
}
