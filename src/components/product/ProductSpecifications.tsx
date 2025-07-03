
interface ProductSpecificationsProps {
  specifications: Record<string, any>;
  brand?: string;
  weight?: number;
  dimensions?: Record<string, any>;
}

export default function ProductSpecifications({
  specifications = {},
  brand,
  weight,
  dimensions = {}
}: ProductSpecificationsProps) {
  const allSpecs = {
    Brand: brand,
    Weight: weight ? `${weight}kg` : undefined,
    ...dimensions,
    ...specifications
  };

  const filteredSpecs = Object.entries(allSpecs).filter(([_, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  if (filteredSpecs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <dl className="space-y-3">
          {filteredSpecs.map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <dt className="text-sm font-medium text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </dt>
              <dd className="text-sm text-gray-900">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
