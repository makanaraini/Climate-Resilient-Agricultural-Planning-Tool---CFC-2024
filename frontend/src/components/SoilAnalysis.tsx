import React from 'react';

interface SoilProperty {
  name: string;
  value: number;
  unit: string;
  status: 'low' | 'optimal' | 'high';
}

const SoilAnalysis: React.FC = () => {
  const soilProperties: SoilProperty[] = [
    { name: 'pH', value: 6.5, unit: '', status: 'optimal' },
    { name: 'Nitrogen', value: 20, unit: 'mg/kg', status: 'low' },
    { name: 'Phosphorus', value: 15, unit: 'mg/kg', status: 'optimal' },
    { name: 'Potassium', value: 180, unit: 'mg/kg', status: 'high' },
    { name: 'Organic Matter', value: 3.2, unit: '%', status: 'optimal' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'text-red-600';
      case 'optimal':
        return 'text-green-600';
      case 'high':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Soil Analysis</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Soil Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {soilProperties.map((property) => (
            <div key={property.name} className="border rounded-lg p-4">
              <h3 className="font-semibold">{property.name}</h3>
              <p className="text-2xl font-bold">
                {property.value} {property.unit}
              </p>
              <p className={`${getStatusColor(property.status)} capitalize`}>
                {property.status}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Apply nitrogen-rich fertilizer to improve soil nitrogen levels.</li>
            <li>Maintain current phosphorus levels through balanced fertilization.</li>
            <li>Reduce potassium application in the next growing season.</li>
            <li>Continue practices that maintain optimal organic matter content.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;
