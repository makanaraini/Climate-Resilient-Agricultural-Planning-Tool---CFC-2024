import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useNotification } from '../contexts/NotificationContext';

interface CropPlan {
  id: number;
  name: string;
  cropType: string;
  area: number;
  plantingDate: string;
  expectedYield: number;
}

const CropPlans: React.FC = () => {
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [newPlan, setNewPlan] = useState<Omit<CropPlan, 'id'>>({
    name: '',
    cropType: '',
    area: 0,
    plantingDate: '',
    expectedYield: 0
  });

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCropPlans();
  }, []);

  const fetchCropPlans = async () => {
    try {
      const response = await axios.get('/api/crop-plans');
      setCropPlans(response.data);
    } catch (error) {
      console.error('Error fetching crop plans:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/crop-plans', newPlan);
      fetchCropPlans();
      setNewPlan({
        name: '',
        cropType: '',
        area: 0,
        plantingDate: '',
        expectedYield: 0
      });
      showNotification('Crop plan added successfully', 'success');
    } catch (error) {
      console.error('Error creating crop plan:', error);
      showNotification('Failed to add crop plan', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/crop-plans/${id}`);
      fetchCropPlans();
      showNotification('Crop plan deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting crop plan:', error);
      showNotification('Failed to delete crop plan', 'error');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Crop Plans</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Plan Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={newPlan.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cropType">
            Crop Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="cropType"
            type="text"
            name="cropType"
            value={newPlan.cropType}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="area">
            Area (hectares)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="area"
            type="number"
            name="area"
            value={newPlan.area}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plantingDate">
            Planting Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="plantingDate"
            type="date"
            name="plantingDate"
            value={newPlan.plantingDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expectedYield">
            Expected Yield (tons)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="expectedYield"
            type="number"
            name="expectedYield"
            value={newPlan.expectedYield}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add Crop Plan
        </button>
      </form>
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Saved Crop Plans</h3>
        {cropPlans.map(plan => (
          <div key={plan.id} className="mb-4 p-4 border rounded">
            <h4 className="font-bold">{plan.name}</h4>
            <p>Crop: {plan.cropType}</p>
            <p>Area: {plan.area} hectares</p>
            <p>Planting Date: {new Date(plan.plantingDate).toLocaleDateString()}</p>
            <p>Expected Yield: {plan.expectedYield} tons</p>
            <button
              className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleDelete(plan.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropPlans;


