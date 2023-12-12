import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const GraficaLineYearly = ({ ticketData }) => {
    console.log('ticketData en el componente:', ticketData);

    const transformedData = ticketData.map((entry) => entry.TotalTickets);

    const labels = ticketData.map((entry) => entry.Anio);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Total de Tickets',
                data: transformedData,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        scales: {
          x: {
            type: 'category',
            labels: labels,
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      };
    
    return <Line data={data} options={options} />;
};


export default GraficaLineYearly;
