
import { X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
  onPreview: () => void;
}

export default function ImagePreview({ src, alt, onRemove, onPreview }: ImagePreviewProps) {
  return (
    <div className="relative group border rounded-lg overflow-hidden bg-gray-50">
      <img 
        src={src} 
        alt={alt}
        className="w-full h-24 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onPreview}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
