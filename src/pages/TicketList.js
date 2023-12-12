import React from "react";

const TicketList = ({ tickets, onTicketClick }) => {
    const titleStyle = {
        marginLeft: '89px',
        fontSize: '20px', // Cambia el tamaño del texto
      };
    return (
        <div className="ticket-list">
            <h1 style={titleStyle}>Tickets Recibidos</h1>
            <ul>
                {tickets.map((ticket) => (
                    <li key={ticket.id} onClick={() => onTicketClick(ticket)}>
                        <div className="ticket-card">
                            <div className="ticket-info">
                                <span className={`priority-dot ${ticket.priority}`}>
                                    &#8226;
                                </span>
                            </div>
                            <div className="user-name">
                                <span className="ticket-user">
                                    {ticket.user}
                                </span>
                            </div>
                            <div className="ticket-info">
                                <span className="ticket-title">
                                    {ticket.title}
                                </span>
                            </div>
                            <div className="ticket-time">
                                <span>
                                    {ticket.time}
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketList;
