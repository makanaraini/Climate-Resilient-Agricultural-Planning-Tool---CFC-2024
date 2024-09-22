import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function ChartWrapper({ data, xAxis, yAxis, title, chartType = 'line' }) {
  const chartData = {
    labels: data.map(item => new Date(item[xAxis]).toLocaleDateString()),
    datasets: [
      {
        label: yAxis,
        data: data.map(item => item[yAxis]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
        text: title,
      },
    },
  };

  return chartType === 'line' ? (
    <Line options={options} data={chartData} />
  ) : (
    <Bar options={options} data={chartData} />
  );
}

export default ChartWrapper;