
import { useState } from "react";
import { Check } from "lucide-react";

interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface ProductColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const defaultColors: ColorOption[] = [
  { name: "Space Gray", value: "space-gray", hex: "#8E8E93" },
  { name: "Silver", value: "silver", hex: "#C0C0C0" },
  { name: "Gold", value: "gold", hex: "#FFD700" },
  { name: "Rose Gold", value: "rose-gold", hex: "#E8B4B8" },
  { name: "Midnight", value: "midnight", hex: "#191919" },
  { name: "Blue", value: "blue", hex: "#007AFF" },
  { name: "Purple", value: "purple", hex: "#AF52DE" },
  { name: "Red", value: "red", hex: "#FF3B30" }
];

export default function ProductColorSelector({
  colors = defaultColors.slice(0, 4),
  selectedColor,
  onColorChange
}: ProductColorSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`relative w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color.value
                ? 'border-gray-900 scale-110'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {selectedColor === color.value && (
              <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Selected: {colors.find((c) => c.value === selectedColor)?.name || 'None'}
      </p>
    </div>
  );
}
