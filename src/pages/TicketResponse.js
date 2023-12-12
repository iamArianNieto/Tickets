import React from "react";

const TicketResponse = ({ selectedTicket, onReply }) => {
    return (
        <div className="ticket-response">
            <h2>Responder Ticket</h2>
            {selectedTicket && (
                <div className="selected-ticket">
                    <div className="ticket-info">
                        <span className={`priority-dot ${selectedTicket.priority}`}>
                            &#8226;
                        </span>
                    </div>
                    <div className="user-name">
                        <span className="ticket-user">
                            {selectedTicket.user}
                        </span>
                    </div>
                    <div className="ticket-info">
                        <span className="ticket-title">
                            {selectedTicket.title}
                        </span>
                    </div>
                    <div className="ticket-time">
                        <span>
                            {selectedTicket.time}
                        </span>
                    </div>
                </div>
            )}
            <textarea
                placeholder="Escribe tu respuesta aquí..."
                rows="5"
                cols="40"
            ></textarea>
            <br></br>
            <button onClick={onReply}>Responder</button>
        </div>
    );
};

export default TicketResponse;
