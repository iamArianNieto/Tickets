import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

const GraficaDona = ({ ticketData }) => {
  console.log('Datos en GraficaDona:', ticketData);

  if (!Array.isArray(ticketData) || ticketData.length === 0) {
    return null;
  }
  const totalTickets = ticketData[0]?.TotalTickets || 0;
  const data = {
    datasets: [
      {
        label: "No. Total de Tickets:",
        data: [totalTickets],
        backgroundColor: ['#C9A4DE'],
        hoverBackgroundColor: ['#C9A4DE'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '65%',
  };

  return <Doughnut data={data} options={options} />;
};

export default GraficaDona;
