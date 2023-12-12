import React, { useState, useEffect } from "react";
import envs from 'react-dotenv';
import '../../CSS/dash.css'
import GraficaDona from './GraficaDona.js';
import { GraficaPastel } from './GraficaPastel';
import GraficaLineMonthly from './GraficaLineMonthly.js';
import GraficaLineYearly from './GraficaLineYearly.js';
import DataTable from 'react-data-table-component';
import Loader from '../TicketsAbiertos/loader';
import 'bootstrap/dist/css/bootstrap.min.css';


const customStyles = {
    headRow: {
        style: {
            backgroundColor: "#DDC9A3",
            color: "white",
            fontWeight: "bold",
        },
    },
    rows: {
        style: {
            fontsize: "14px",
            borderBottom: "1px solid #ccc",
        }
    },
    cells: {
        style: {
            padding: "8px",
            margin: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
        pagination: {
            style: {
                backgroundColor: "#f2f2f2",
            },
        },
    },
};

const DashboardPrincial = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const [pageNumber] = useState(0);
    const ticketsPerPage = 10;

    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    const [notes, setNotes] = useState("");
    const [dailyTicketData, setDailyTicketData] = useState([]);
    const [monthlyTicketData, setMonthlyTicketData] = useState([]);
    const [yearlyTicketData, setYearlyTicketData] = useState([]);
    const [totalTicketData, setTotalTicketData] = useState([]);
    const [activeTab, setActiveTab] = useState('monthly');
    const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);


    const paginado = {
        rowsPerPageText: "Renglones por página",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
        paginationRowsPerPageOptions: {
            className: "paginado_style",
        }
    };

    const estiloSelection = [
        {
            when: (row) => row.selectedRow,
            style: {
                backgroundColor: "#3f101d",
                userSelect: "none",
                color: "white",
            },
        },
    ];

    const columns = [
        {
            name: 'PRIORIDAD',
            selector: row => row.NombrePrioridad,
            cell: row => (
                <span
                    style={{
                        color: 'white',
                        backgroundColor: getPriorityColor(row.NombrePrioridad),
                        padding: '3px 8px',
                        borderRadius: '5px',
                        display: 'inline-block',
                        fontWeight: 'bold',
                    }}
                >
                    {row.NombrePrioridad}
                </span>
            ),
        },
        {
            name: 'NO. TICKET',
            selector: row => row.Folio,

        },
        {
            name: 'NOMBRE',
            selector: row => row.Nombre,

        },
        {
            name: 'SERVICIO',
            selector: row => row.NombreServicio,

        },

        {
            name: 'FECHA',
            selector: row => row.Fecha,
            cell: row => row.Fecha,
        },

        {
            name: 'HORA',
            selector: row => row.Hora,
            cell: row => row.Hora,
        },
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Crítica':
                return '#9E3F47';
            case 'Alta':
                return '#EB5E6A';
            case 'Media':
                return '#EB8C5E';
            case 'Baja':
                return '#94C18F';
            default:
                return 'dark';
        }
    };

    const handleTicketClick = (ticket, index) => {
        setSelectedTicket(ticket);
        setSelectedRowIndex(index);
        setNotes("");
    };

    const displayedTickets = tickets.slice(pageNumber * ticketsPerPage, (pageNumber + 1) * ticketsPerPage);

    useEffect(() => {
        Inicio()
    }, []);

    const Inicio = async () => {
        const _privilegio = sessionStorage.getItem('PRIVILEGIO');
        const _subcentro = sessionStorage.getItem('USUARIO_SUBCENTRO');
        const _area = sessionStorage.getItem('USUARIO_AREA');

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                'privilegio': _privilegio,
                'subcentro': _subcentro,
                'area': _area
            },
            redirect: 'manual'
        };

        // Obtener datos diarios
        await fetch(`${envs.API_TICKETS_DIARIOS}`, requestOptions)
            .then((response) => response.json())
            .then((data) => setDailyTicketData(data))
            .catch((error) => console.error('Error al obtener datos diarios:', error));

        // Obtener datos mensuales
        await fetch(`${envs.API_TICKETS_MENSUALES}`, requestOptions)
            .then((response) => response.json())
            .then((data) => setMonthlyTicketData(data))
            .catch((error) => console.error('Error al obtener datos mensuales:', error));

        // Obtener datos anuales
        await fetch(`${envs.API_TICKETS_ANUAL}`, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setYearlyTicketData(data))
            .catch((error) => console.error('Error al obtener datos anuales:', error));

        // Obtener datos totales
        await fetch(`${envs.API_TICKETS_TOTALES}`, requestOptions)
            .then((response) => response.json())
            .then((data) => setTotalTicketData(data))
            .catch((error) => console.error('Error al obtener datos totales:', error));

        // Obtener datos de los tickets
        await fetch(`${envs.API_LIST}`, requestOptions)
            .then((response) => response.json())
            .then(data => {
                const sortedTickets = data.sort((a, b) => b.Folio.localeCompare(a.Folio));
                setTickets(sortedTickets);
            })
            .catch((error) => console.error('Error al obtener los tickets:', error));
    }

    function rowSelected(selectedRow) {
        console.log("Fila seleccionada:", selectedRow);
        var nombreSeleccionado = selectedRow.Nombre;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "_usuario": nombreSeleccionado
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://10.18.11.34:8051/dataUser", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result && result.length > 0) {
                    console.log("Detalles del ticket:", result);
                    const detallesTicket = result[0];

                    console.log("Nombre del usuario:", detallesTicket.Nombre);
                    console.log("Subárea del usuario:", detallesTicket.Subarea);
                    setSelectedTicketDetails(detallesTicket);

                } else {
                    console.log("No se encontraron detalles del ticket para el usuario:", nombreSeleccionado);
                    setSelectedTicketDetails(null);

                }
            })
            .catch(error => console.error('Error:', error));
    }


    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='graficas-principales'>
                    <div className='row mb-4'>
                        <div className='col-md-6 col-xl-4 mb-4'>
                            <div className='card mb-4'>
                                <div className='title_detalles-cerrados'>TICKETS DIARIOS</div>
                                <div className='card-body'>
                                    <div className='graficas-container'>
                                        <GraficaPastel ticketData={dailyTicketData} />                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 col-xl-4 mb-4'>
                            <div className='card mb-4'>
                                <div className='title_detalles-cerrados'>TICKETS MENSUALES</div>
                                <div className='card-body'>
                                    <ul className='nav nav-tabs nav-dash'>
                                        <li className='nav-item'>
                                            <a
                                                className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('monthly')}
                                            >
                                                Mensual
                                            </a>
                                        </li>
                                        <li className='nav-item'>
                                            <a
                                                className={`nav-link ${activeTab === 'yearly' ? 'active' : ''}`}
                                                onClick={() => handleTabClick('yearly')}
                                            >
                                                Anual
                                            </a>
                                        </li>
                                    </ul>
                                    <div className='graficas-container-line'>
                                        {activeTab === 'monthly' && <GraficaLineMonthly ticketData={monthlyTicketData} />}
                                        {activeTab === 'yearly' && <GraficaLineYearly ticketData={yearlyTicketData} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 col-xl-4 mb-4'>
                            <div className='card mb-4'>
                                <div className='title_detalles-cerrados'>TOTAL DE TICKETS</div>
                                <div className='card-body'>
                                    <div className='graficas-container'>
                                        <GraficaDona ticketData={totalTicketData} />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="ticket-navbar-dash">
                        <DataTable
                            id="paginadoEstilo"
                            columns={columns}
                            data={displayedTickets}
                            noHeader
                            dense
                            responsive
                            customStyles={customStyles}
                            paginationComponentOptions={paginado}
                            progressComponent={<Loader></Loader>}
                            noDataComponent="Sin Registro de Tickets"
                            conditionalRowStyles={[
                                {
                                    when: row => row === selectedTicket,
                                    style: {
                                        backgroundColor: '#F5ECDF',
                                    },
                                },
                            ]}
                            highlightOnHover
                            pagination
                            paginationPerPage={4}
                            paginationRowsPerPageOptions={[4, 8, 12]}
                            onRowClicked={(row, index) => { handleTicketClick(row, index); rowSelected(row); }}
                            highlightOnSelect={true}
                            selectableRowsHighlight
                        />
                    </div>
                </div>
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="ticket-container-dash">
                        <div className="ticket-details-container">
                            <div className="ticket-section">
                                <h2 className="title_detalles">Detalles del Ticket: </h2>
                            </div>
                            <div className="ticket-section">
                                <div className="left-column">
                                    <p><span className="bold-title">Nombre:</span> {selectedTicketDetails ? selectedTicketDetails.Nombre : ""}</p>
                                    <p><span className="bold-title">Subcentro:</span> {selectedTicket ? selectedTicket.NombreSubcentro : ""}</p>
                                    <p><span className="bold-title">Área:</span> {selectedTicketDetails ? selectedTicketDetails.Subarea : ""}</p>
                                </div>
                                <div className="middle-column">
                                    <p>
                                        <span className="bold-title">Prioridad:</span>{" "}
                                        <span
                                            className="font-weight-bold"
                                            style={{ color: getPriorityColor(selectedTicket ? selectedTicket.NombrePrioridad : 'dark') }}>
                                            {selectedTicket ? selectedTicket.NombrePrioridad : ""}
                                        </span>
                                    </p>
                                    <p><span className="bold-title">Servicio:</span> {selectedTicket ? selectedTicket.NombreServicio : ""}</p>
                                    <p className="estatus-style"><span className="bold-title">Estatus:</span> {selectedTicket ? selectedTicket.NombreEstatus : ""}</p>
                                </div>
                                <div className="right-column">
                                    <p><span className="bold-title">Fecha:</span> {selectedTicket ? selectedTicket.Fecha : ""}</p>
                                    <p><span className="bold-title">Hora:</span> {selectedTicket ? selectedTicket.Hora : ""}</p>
                                </div>
                                <div className="description-section">
                                    <p><span className="bold-title">Solicitud: </span>
                                        <span style={{ maxHeight: "100px", overflowY: "auto", display: "block" }}>
                                            {selectedTicket ? selectedTicket.Requerimiento : ""}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPrincial;
