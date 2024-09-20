import React from 'react';

interface CropPrice {
  crop: string;
  price: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const MarketTrends: React.FC = () => {
  const cropPrices: CropPrice[] = [
    { crop: 'Maize', price: 180.5, change: 2.3, trend: 'up' },
    { crop: 'Wheat', price: 210.75, change: -1.5, trend: 'down' },
    { crop: 'Rice', price: 250.0, change: 0.5, trend: 'stable' },
    { crop: 'Soybeans', price: 390.25, change: 5.2, trend: 'up' },
    { crop: 'Potatoes', price: 120.0, change: -0.8, trend: 'down' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Market Trends</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Crop Prices</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Crop</th>
                <th className="px-4 py-2 text-left">Price (USD/ton)</th>
                <th className="px-4 py-2 text-left">Change</th>
                <th className="px-4 py-2 text-left">Trend</th>
              </tr>
            </thead>
            <tbody>
              {cropPrices.map((crop) => (
                <tr key={crop.crop} className="border-b">
                  <td className="px-4 py-2">{crop.crop}</td>
                  <td className="px-4 py-2">${crop.price.toFixed(2)}</td>
                  <td className={`px-4 py-2 ${getTrendColor(crop.trend)}`}>
                    {crop.change > 0 ? '+' : ''}{crop.change.toFixed(2)}
                  </td>
                  <td className={`px-4 py-2 ${getTrendColor(crop.trend)}`}>
                    {getTrendIcon(crop.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Market Insights</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Soybean prices are rising due to increased global demand.</li>
            <li>Wheat prices are slightly down due to favorable weather conditions in major producing regions.</li>
            <li>Rice prices remain stable with balanced supply and demand.</li>
            <li>Consider diversifying crop portfolio to mitigate market risks.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
