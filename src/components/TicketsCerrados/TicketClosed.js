import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../CSS/prueba.css';
import '../../CSS/styles.css';
import '../../CSS/cerrados.css'
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Loader from '../TicketsAbiertos/loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import envs from 'react-dotenv';
import { MdClear } from "react-icons/md";
import { Document, Page } from 'react-pdf';

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

const TickeClosed = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userArea, setUserArea] = useState("");


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documentUrl, setDocumentUrl] = useState("");

    const [pageNumber] = useState(0);
    const ticketsPerPage = 10;

    const [showImage, setShowImage] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const [showDOC, setShowDOC] = useState(false);

    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

    const [notes, setNotes] = useState("");
    const [selectedTicketNotes, setSelectedTicketNotes] = useState([]);
    const [folioTitle, setFolioTitle] = useState("Nota:");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredTickets, setFilteredTickets] = useState([]);
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

    const handleExpandDescription = (description) => {
        console.log(description);
    };

    const storedUserArea = sessionStorage.getItem('USUARIO_AREADES');

    const fetchTickets = async () => {
        try {
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

            const response = await fetch(envs.API_LIST_CLOSED, requestOptions);
            const data = await response.json();
            const sortedTickets = data.sort((a, b) => b.Folio.localeCompare(a.Folio));
            setTickets(sortedTickets);
        } catch (error) {
            console.error('Error al obtener los tickets:', error);
        }
    };

    useEffect(() => {
        setUserArea(storedUserArea || "");


        fetchTickets();
        //ACTUALIZCIÓN CADA 5 SEGUNDOS
        /* const intervalId = setInterval(fetchTickets, 5000);
        return () => clearInterval(intervalId); */
    }, []);



    useEffect(() => {
        if (selectedTicket) {
            const fileType = getFileType(selectedTicket.Archivo);
            setShowImage(fileType === 'png' || fileType === 'jpg');
            setShowPDF(fileType === 'pdf');
            setShowDOC(fileType === 'docx');
        }
    }, [selectedTicket]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                if (selectedTicket) {
                    const response = await fetch(`${envs.API_LOAD_NOTES}${selectedTicket.Folio}`);
                    const data = await response.json();
                    const sortedNotes = data.sort((a, b) => new Date(a.FECHA + ' ' + a.HORA) - new Date(b.FECHA + ' ' + b.HORA));
                    const reversedNotes = sortedNotes.reverse();

                    setSelectedTicketNotes(reversedNotes);
                }
            } catch (error) {
                console.error('Error al obtener las notas:', error);
            }
        };

        fetchNotes();
    }, [selectedTicket]);

    const getFileType = (fileName) => {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        return fileExtension;
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
        setFolioTitle(`Nota - ${ticket.Folio}:`);
    };

    const formatTime = (time) => {
        if (time) {
            const timeWithoutMilliseconds = time.split('.')[0];
            return timeWithoutMilliseconds;
        } else {
            return "Hora no válida";
        }
    };

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        const parts = formattedDate.split('/');
        const formattedResult = `${parts[2]}-${parts[0]}-${parts[1]}`;

        return formattedResult;
    }


    //const displayedTickets = tickets.slice(pageNumber * ticketsPerPage, (pageNumber + 1) * ticketsPerPage);

    const openDocumentModal = (documentUrl) => {
        setDocumentUrl(documentUrl);
        setIsModalOpen(true);
    };

    const handleSendNote = () => {
        if (selectedTicket && notes) {
            const timestamp = new Date().toLocaleString();
            const formattedDate = formatDate(timestamp);
            const formattedTime = formatTime(timestamp);
            const newNote = { note: notes, timestamp };

            setNotes("");
        }
    };

    const filterTickets = () => {
        // Filtra los tickets basados en las fechas seleccionadas
        const filteredTickets = tickets.filter((ticket) => {
            const ticketDate = new Date(ticket.Fecha);
            const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
            const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

            console.log('Ticket Date:', ticketDate);
            console.log('Start Date:', start);
            console.log('End Date:', end);

            return (
                (!start || ticketDate >= start) &&
                (!end || ticketDate <= end)
            );
        });

        console.log('Filtered Tickets:', filteredTickets);

        setFilteredTickets(filteredTickets);
    };


    const displayedTicketsToUse = filteredTickets.length > 0 ? filteredTickets : tickets;

    const displayedTickets = displayedTicketsToUse.slice(
        pageNumber * ticketsPerPage,
        (pageNumber + 1) * ticketsPerPage
    );

    const clearStartDate = () => {
        setStartDate(null);
        if (!endDate) {
            setFilteredTickets([]);
        }

    };

    const clearEndDate = () => {
        setEndDate(null);
        if (!startDate) {
            setFilteredTickets([]);
        }
    };
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
        <div className="ticket-app">
            <div className='row'>
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="ticket-navbar-cerrados">
                        <div className="filter-section">
                            <DatePicker
                                selected={startDate}
                                className="filterclose"
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Fecha de Inicio"
                            />
                            {startDate && (
                                <MdClear className="clear-button" onClick={clearStartDate} />
                            )}
                            <DatePicker
                                selected={endDate}
                                className="filterclose"
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Fecha de Fin"
                            />
                            {endDate && (
                                <MdClear className="clear-button" onClick={clearEndDate} />
                            )}
                            <button className="btn-filtro-close" onClick={() => filterTickets()}>FILTRAR</button>
                        </div>
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
                            paginationPerPage={30}
                            paginationRowsPerPageOptions={[10, 20, 30]}
                            onRowClicked={(row, index) => { handleTicketClick(row, index); rowSelected(row); }}
                            highlightOnSelect={true}
                            selectableRowsHighlight
                        />
                    </div>
                </div>
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="ticket-container-cerrados">
                        <div className="ticket-details-container">
                            <div className="ticket-section">
                                <h2 className="title_detalles">Detalles del Ticket: {selectedTicket ? selectedTicket.Folio : ""}</h2>
                            </div>
                            <div className="ticket-section">
                                <div className="left-column">
                                    <p><span className="bold-title">Nombre:</span> {selectedTicketDetails ? selectedTicketDetails.Nombre : ""}</p>
                                    <p><span className="bold-title">Subcentro:</span> {selectedTicket ? selectedTicket.NombreSubcentro : ""}</p>
                                    <p><span className="bold-title">Área:</span> {selectedTicketDetails ? selectedTicketDetails.Subarea : ""}</p>
                                    <p><span className="bold-title">Servicio:</span> {selectedTicket ? selectedTicket.NombreServicio : ""}</p>

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
                                    <p><span className="bold-title">Fecha:</span> {selectedTicket ? selectedTicket.Fecha : ""}</p>
                                    <p><span className="bold-title">Hora:</span> {selectedTicket ? selectedTicket.Hora : ""}</p>
                                    <p className="estatus-style"><span className="bold-title">Estatus:</span> {selectedTicket ? selectedTicket.NombreEstatus : ""}</p>
                                </div>
                                <div className="right-column">
                                    {selectedTicket && selectedTicket.Archivo && (
                                        <>
                                            {showImage && (
                                                <div className="image-section">
                                                    <p><span className="bold-title">Imagen:</span></p>
                                                    <img
                                                        id="img_ArcvhioImagenes"
                                                        src={`http://10.18.11.32:5000/uploads/images/${selectedTicket.Archivo}`}
                                                        alt="Imagen del Ticket"
                                                        style={{
                                                            cursor: 'pointer',
                                                            maxWidth: '40%',
                                                            maxHeight: '100%'
                                                        }}
                                                        onClick={() => openDocumentModal(`http://10.18.11.32:5000/uploads/images/${selectedTicket.Archivo}`)} />
                                                </div>
                                            )}
                                            {showPDF && (
                                                <div className="pdf-section">
                                                    <p><span className="bold-title">PDF:</span></p>
                                                    <button
                                                        id="btn_pdf"
                                                        className="btn-pdf"
                                                        onClick={() => window.open(`http://10.18.11.32:5000/uploads/documents/${selectedTicket.Archivo}`)}>
                                                        Ver PDF
                                                    </button>
                                                </div>
                                            )}
                                            {showDOC && (
                                                <div className="doc-section">
                                                    <p><span className="bold-title">Documento DOCX:</span></p>
                                                    <button
                                                        id="btn_doc"
                                                        className="btn-doc"
                                                        onClick={() => window.open(`http://10.18.11.32:5000/uploads/documents/${selectedTicket.Archivo}`)}>
                                                        Ver DOC
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {/* Imagen predeterminada*/}
                                    {selectedTicket && !showImage && !showPDF && !showDOC && (
                                        <div className="default-image-section">
                                            <p><span className="bold-title">Archivo:</span></p>
                                            <img
                                                id="img_PredeterminadaClose"
                                                src="https://i.ibb.co/wLb5xnM/Logo-Tickets.png"
                                                alt="Imagen por defecto"
                                                style={{
                                                    maxWidth: '40%',
                                                    maxHeight: '100%'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>


                                <div className="description-section">
                                    <p><span className="bold-title">Solicitud: </span>
                                        <span className="estatus-style" style={{ maxHeight: "100px", overflowY: "auto", display: "block" }}>
                                            {selectedTicket ? selectedTicket.Requerimiento : ""}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="notas-container-cerrados">
                        <h2>Respuestas</h2>
                        <DataTable
                            columns={[
                                {
                                    name: 'NOTAS',
                                    selector: row => row.CONTESTACION,
                                    sortable: true,
                                    cell: row => (
                                        <div style={{ maxWidth: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.CONTESTACION}
                                        </div>
                                    ),
                                },
                                {
                                    name: 'P_SISTEMAS',
                                    selector: row => row.P_SISTEMAS,
                                    sortable: true,
                                    cell: row => (
                                        <div style={{ maxWidth: '35%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.P_SISTEMAS}
                                        </div>
                                    ),
                                },
                                {
                                    name: 'FECHA',
                                    selector: row => row.FECHA,
                                    cell: row => (
                                        <div style={{ maxWidth: '35%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.FECHA}
                                        </div>
                                    ),
                                },
                                {
                                    name: 'HORA',
                                    selector: row => row.HORA,
                                    cell: row => (
                                        <div style={{ maxWidth: '30%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.HORA}
                                        </div>
                                    ),
                                },
                            ]}

                            data={selectedTicketNotes}
                            paginationComponentOptions={paginado}
                            progressComponent={<Loader></Loader>}
                            noDataComponent="Sin registro de Notas"
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
                            paginationPerPage={3}
                            paginationRowsPerPageOptions={[3, 6, 9]}
                        />
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} size="xl">
                <Modal.Header>
                    <Modal.Title>Visualización previa</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center', width: '100%', height: '600px' }}>
                    <div style={{ width: '100%', height: '100%', margin: '0 auto' }}>

                        <div className="close-button" onClick={() => setIsModalOpen(false)}>
                            <img
                                id="img_PredeterminadaVistaPrevia"
                                className="close-icon"
                                src="https://i.ibb.co/QPG9RBX/cerrar.png"
                                alt="Cerrar"
                            />
                        </div>
                        {documentUrl.endsWith(".pdf") ? (
                            <Document file={documentUrl} style={{ display: 'block' }}>
                                <Page pageNumber={1} />
                            </Document>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
                                        <img src={documentUrl} style={{ width: '100%' }}></img>
                                    </div>

                                </div>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default TickeClosed;