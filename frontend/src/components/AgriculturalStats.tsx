import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from '../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CropYield {
  crop: string;
  yield: number;
}

interface MonthlyRainfall {
  month: string;
  rainfall: number;
}

interface SoilComposition {
  type: string;
  percentage: number;
}

const AgriculturalStats: React.FC = () => {
  const [cropYields, setCropYields] = useState<CropYield[]>([]);
  const [monthlyRainfall, setMonthlyRainfall] = useState<MonthlyRainfall[]>([]);
  const [soilComposition, setSoilComposition] = useState<SoilComposition[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yieldsResponse = await axios.get('/api/crop-yields');
        setCropYields(yieldsResponse.data);

        const rainfallResponse = await axios.get('/api/monthly-rainfall');
        setMonthlyRainfall(rainfallResponse.data);

        const soilResponse = await axios.get('/api/soil-composition');
        setSoilComposition(soilResponse.data);
      } catch (error) {
        console.error('Error fetching agricultural data:', error);
      }
    };

    fetchData();
  }, []);

  const cropYieldData = {
    labels: cropYields.map(item => item.crop),
    datasets: [
      {
        label: 'Crop Yield (tons/hectare)',
        data: cropYields.map(item => item.yield),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const rainfallData = {
    labels: monthlyRainfall.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Rainfall (mm)',
        data: monthlyRainfall.map(item => item.rainfall),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const soilData = {
    labels: soilComposition.map(item => item.type),
    datasets: [
      {
        data: soilComposition.map(item => item.percentage),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Agricultural Statistics</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Crop Yields</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <Bar data={cropYieldData} />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Monthly Rainfall</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={rainfallData} />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Soil Composition</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <Pie data={soilData} />
        </div>
      </div>
    </div>
  );
};

export default AgriculturalStats;
