import React, { useState } from "react";
import TicketList from "./TicketList";
import TicketResponse from "./TicketResponse";
import "./../CSS/prueba.css";

const Abiertos = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      user: "Nombre del Usuario 1",
      title: "Problema con el servidor",
      priority: "alta",
      time: "Hace 2 horas",
    },
    {
      id: 2,
      user: "Nombre del Usuario 2",
      title: "Error en la aplicación",
      priority: "media",
      time: "Hace 3 horas",
    },
    {
      id: 3,
      user: "Nombre del Usuario 3",
      title: "Solicitud de soporte técnico",
      priority: "baja",
      time: "Hace 4 horas",
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleReply = () => {
    // Lógica para enviar la respuesta del ticket
    // Puedes implementar la lógica de envío aquí
    console.log("Responder al ticket:", selectedTicket);
  };

  return (
    <div className="app">
      <TicketList tickets={tickets} onTicketClick={handleTicketClick} />
      <TicketResponse
        selectedTicket={selectedTicket}
        onReply={handleReply}
      />
    </div>
  );
};

export default Abiertos;
