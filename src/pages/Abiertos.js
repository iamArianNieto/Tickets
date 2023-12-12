import React, { useState } from "react";
import TicketList from "../components/TicketsAbiertos/TicketList.js";
import Footer from '../components/Footer/footer.js'
import '../CSS/prueba.css';

const Abiertos = (location) => {
  const { state: routeState } = location;

  const usuarioArea = routeState?.usuarioArea || sessionStorage.getItem('USUARIO_AREA');
  const usuarioAreaDes = routeState?.usuarioAreaDes || sessionStorage.getItem('USUARIO_AREADES');

  const [tickets] = useState([]);
  const [setSelectedTicket] = useState(null);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="app">
      <div className="navbarTitle">
        <h3>Tickets Abiertos</h3>
      </div>
      <TicketList tickets={tickets} onTicketClick={handleTicketClick}usuarioArea={usuarioArea} usuarioAreaDes={usuarioAreaDes} />
      <Footer esLoggin={'No'}></Footer>
    </div>
  );
};

export default Abiertos;
