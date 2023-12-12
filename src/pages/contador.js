import React, { useState } from "react";
import Cargar from "../components/cargar";
import fakeApi from "./api";
import "./styles.css";
import { BsFillPatchPlusFill } from "react-icons/bs";

const steps = [
    {
        id: "Tickets",
        title: ""
    },
];

export default function App() {
    const [currentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        centro: "",
        servicio: "",
        prioridad: "",
        descripcion: "",
    });

    const [ticketCounter, setTicketCounter] = useState(0);
    const [ticketList, setTicketList] = useState([]);
    
    function handleInputChange(event) {
        const { name, value } = event.target;

        setFormValues((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);

        // Simular el envío del formulario a la API
        await fakeApi(() => {
            setLoading(false);
            setTicketCounter(ticketCounter + 1); // Incrementar el contador de tickets
            const newTicket = {
                id: ticketCounter + 1, // Asignar un ID único al ticket
                ...formValues,
            };
            setTicketList([...ticketList, newTicket]); // Agregar el nuevo ticket a la lista
            setFormValues({
                centro: "",
                servicio: "",
                prioridad: "",
                descripcion: "",
            });
        }, 2000);
    }

    return (
        <div className="App">
            
            <p>Total de Tickets: {ticketCounter}</p> {/* Mostrar el contador de tickets */}
            <br></br>
            <form className="steps-form" onSubmit={handleSubmit}>
                {/* ... Resto del formulario */}
            </form>
            <Cargar />
            {/* Agregar una sección para mostrar la lista de tickets */}
            <div>
                <h2>Lista de Tickets</h2>
                <ul>
                    {ticketList.map((ticket) => (
                        <li key={ticket.id}>
                            ID: {ticket.id}, Centro: {ticket.centro}, Servicio: {ticket.servicio}, Prioridad: {ticket.prioridad}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
