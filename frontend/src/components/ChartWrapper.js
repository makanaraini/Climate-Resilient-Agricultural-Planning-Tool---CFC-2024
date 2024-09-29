import React from 'react.js';
import { Line, Bar } from 'react-chartjs-2.js';
import { Paper, Typography } from '@mui/material.js';
import { styled } from '@mui/material/styles.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

function ChartWrapper({ data, xAxis, yAxis, title, chartType = 'line' }) {
  const chartData = {
    labels: data.map(item => item[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: data.map(item => item[yAxis]),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75,192,192,1)',
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
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const ChartComponent = chartType === 'bar' ? Bar : Line;

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', textAlign: 'center' }}>
        {title}
      </Typography>
      <ChartComponent data={chartData} options={options} />
    </StyledPaper>
  );
}

export default ChartWrapper;
