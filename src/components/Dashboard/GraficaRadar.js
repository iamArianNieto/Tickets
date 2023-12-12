import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, ArcElement, LineElement } from 'chart.js';

Chart.register(RadialLinearScale, PointElement, ArcElement, LineElement);

const GraficaRadar = ({ ticketData }) => {
  const transformedData = ticketData.map((entry) => entry.TotalTickets);

  const labels = ticketData.map((entry) => getMonthName(entry.Mes));

  const data = {
    datasets: [
      {
        label: labels,
        data: transformedData,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
};

const getMonthName = (dateString) => {
  const [year, month] = dateString.split('-');
  const date = new Date(year, parseInt(month, 10) - 1);
  return date.toLocaleString('default', { month: 'long' });
};

export default GraficaRadar;
