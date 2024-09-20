import React, { useState } from 'react';

const CropPlanner: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [plantingDate, setPlantingDate] = useState('');

  const crops = ['Maize', 'Wheat', 'Rice', 'Soybeans', 'Potatoes'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Crop planning submitted:', { selectedCrop, plantingDate });
    // Here you would typically send this data to your backend
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Crop Planner</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-2">
            Select Crop
          </label>
          <select
            id="crop"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Choose a crop</option>
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700 mb-2">
            Planting Date
          </label>
          <input
            type="date"
            id="plantingDate"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Plan Crop
        </button>
      </form>
    </div>
  );
};

export default CropPlanner;
