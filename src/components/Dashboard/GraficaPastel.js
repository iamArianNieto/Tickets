import React from 'react';
import { Pie } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';

export const GraficaPastel = ({ ticketData }) => {
  console.log('Datos en GraficaPastel:', ticketData);

  if (!Array.isArray(ticketData) || ticketData.length === 0) {
    return null;
  }

  const { Abierto, Pendiente, Cerrado } = ticketData[0];

  const data = {
    labels: ['Abiertos', 'Pendientes', 'Cerrados'],
    datasets: [
      {
        data: [Abierto, Pendiente, Cerrado],
        backgroundColor: ['#DEBBA4', '#ABDEA4', '#A4BEDE'],
        hoverOffset: 2,
      },
    ],
  };

  return (
    <div>
      <Pie data={data} />
    </div>
  );
};
