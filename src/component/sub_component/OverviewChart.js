import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverviewChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Active time',
        data: [1000, 2000, 3000, 4000, 5000, 4500, 6000, 5000, 5500, 6000, 2000, 1000],
        backgroundColor: '#000000',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#000',
        },
      },
      x: {
        ticks: {
          color: '#000',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default OverviewChart;
