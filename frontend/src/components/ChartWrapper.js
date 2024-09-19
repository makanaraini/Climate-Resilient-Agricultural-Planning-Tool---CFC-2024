import React from 'react';
import { Line } from 'react-chartjs-2';

const ChartWrapper = ({ data }) => {
  console.log('ChartWrapper data:', data);
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.crop),
    datasets: [
      {
        label: 'Yield',
        data: data.map(item => item.yield),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Agricultural Data',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ChartWrapper;
