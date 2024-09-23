import React from 'react';
import { Line, Bar } from 'react-chartjs-2';

function ChartWrapper({ data, xAxis, yAxis, title, chartType = 'line' }) {
  const chartData = {
    labels: data.map(item => item[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: data.map(item => item[yAxis]),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    title: {
      display: true,
      text: title,
    },
  };

  return chartType === 'bar' ? (
    <Bar data={chartData} options={options} />
  ) : (
    <Line data={chartData} options={options} />
  );
}

export default ChartWrapper;