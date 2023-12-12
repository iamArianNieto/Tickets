import React, { useState } from "react";
import TickeClosed from '../components/TicketsCerrados/TicketClosed.js'
import Footer from '../components/Footer/footer.js'

export const Cerrados = () => {
  const [tickets] = useState([]);
  const [setSelectedTicket] = useState(null);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className='cerrados'>
      <div className="navbarTitle">
        <h3>Tickets Cerrados</h3>
      </div>
      <TickeClosed tickets={tickets} onTicketClick={handleTicketClick} />
      <Footer esLoggin={'No'}></Footer>
    </div>
  );
};

export default Cerrados;