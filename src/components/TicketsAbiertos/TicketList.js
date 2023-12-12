import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../CSS/prueba.css';
import "../../CSS/styles.css";
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Loader from "./loader";
import Swal from 'sweetalert2';
import envs from 'react-dotenv';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userArea, setUserArea] = useState("");
    const [ticketArea, setTicketArea] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documentUrl, setDocumentUrl] = useState("");

    const [pageNumber] = useState(0);
    const ticketsPerPage = 10;

    const [showImage, setShowImage] = useState(false);
    const [showPDF, setShowPDF] = useState(false);
    const [showDOC, setShowDOC] = useState(false);

    const [notes, setNotes] = useState("");
    const [selectedTicketNotes, setSelectedTicketNotes] = useState([]);
    const [folioTitle, setFolioTitle] = useState("");
    const [isNoteActive, setIsNoteActive] = useState(false);
    const [isTicketClosed, setIsTicketClosed] = useState(false);
    const [ticketState, setTicketState] = useState(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);


    const userName = sessionStorage.getItem('USUARIO_NOMBRE');

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


    //ÁREA DESCRPCIÓN DEL USUARIO
    const storedUserArea = sessionStorage.getItem('USUARIO_AREADES');

    //ÁREA DEL USUARIO
    useEffect(() => {
        if (selectedTicket) {
            setUserArea(selectedTicket.Desc_areaOmuni || storedUserArea || "");
            setTicketArea(selectedTicket.Desc_areaOmuni || "");
        } else {
            setUserArea(storedUserArea || "");
            setTicketArea("");
        }
        setIsNoteActive(!selectedTicket ? false : isNoteActive);

        // TRAE LA LISTA EN DATATABLE
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

                const response = await fetch(envs.API_LIST, requestOptions);
                const data = await response.json();
                const sortedTickets = data.sort((a, b) => b.Folio.localeCompare(a.Folio));


                setTickets(sortedTickets);

            } catch (error) {
                console.error('Error al obtener los tickets:', error);
            }
        };
        fetchTickets();
        //ACTUALIZCIÓN CADA 30 SEGUNDOS
        const intervalId = setInterval(fetchTickets, 30000);
        return () => clearInterval(intervalId);
    }, [isNoteActive, selectedTicket]);

    //TRAE LOS ARCHIVOS A LOS DETALLES
    useEffect(() => {
        if (selectedTicket) {
            const fileType = getFileType(selectedTicket.Archivo);
            setShowImage(fileType === 'png' || fileType === 'jpg');
            setShowPDF(fileType === 'pdf');
            setShowDOC(fileType === 'docx');
        }
    }, [selectedTicket]);

    //CARGA LAS NOTAS POR CADA USUARIO
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
        //ACTUALIZCIÓN CADA 30 SEGUNDOS
        const intervalId = setInterval(fetchNotes, 5000);
        return () => clearInterval(intervalId);
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
                return '#EB8C5E';
            case 'Media':
                return '#FFCD6A';
            case 'Baja':
                return '#94C18F';
            default:
                return 'dark';
        }
    };

    const handleTicketClick = async (ticket, index) => {
        setSelectedTicket(ticket);
        setSelectedRowIndex(index);
        setFolioTitle(ticket.Folio);
        setIsNoteActive(true);

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

    const displayedTickets = tickets.slice(pageNumber * ticketsPerPage, (pageNumber + 1) * ticketsPerPage);

    const openDocumentModal = (documentUrl) => {
        setDocumentUrl(documentUrl);
        setIsModalOpen(true);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    //ENVIA LAS NOTAS
    const handleSendNote = () => {
        console.log('Valor de notes:', notes);

        if (selectedTicket && notes && userName) {
            const timestamp = new Date().toLocaleString();
            const formattedDate = formatDate(timestamp);
            const formattedTime = formatTime(timestamp);
            const newNote = { note: notes, timestamp };

            setNotes("");

            fetch(`${envs.API_SEND_NOTE} `, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'usuario-Nombre': userName,
                },
                body: JSON.stringify({
                    folio: folioTitle,
                    fecha: formattedDate,
                    hora: formattedTime,
                    notes: notes,
                    status: 2,
                    author: userName,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    setIsTicketClosed(false);
                    toast.success("NOTA ENVIADA CON ÉXITO", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });
                })
                .catch(error => {
                    console.error('ERROR AL ENVIAR LA NOTA:', error);
                    toast.error("¡Ups!, Hubo un error al enviar la nota. Por favor, inténtalo nuevamente.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });
                });
        }
    };

    //CIERRA LOS TICKETS 
    const handleCloseTicket = async () => {
        if (!selectedTicket) {
            console.error('No hay ticket seleccionado para cerrar.');
            return;
        }

        if (selectedTicket.Status === 3) {
            console.log('El ticket ya está cerrado.');
            return;
        }

        try {
            const notesResponse = await fetch(`${envs.API_LOAD_NOTES}${selectedTicket.Folio}`);
            const notesData = await notesResponse.json();

            if (!notesData || notesData.length === 0) {
                alert('No se puede cerrar el ticket sin una nota. Debe insertar una nota antes de cerrar el ticket.');
                return;
            }

            const timestamp = new Date().toLocaleString();
            const formattedDate = formatDate(timestamp);
            const formattedTime = formatTime(timestamp);

            const newStatusId = 3;

            // Actualizar el estado del ticket
            console.log('Nuevo estado del ticket:', newStatusId);

            const response = await fetch(`${envs.API_UPDATE_TICKET_STATUS}${selectedTicket.Folio}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'usuario-Nombre': userName,
                },
                body: JSON.stringify({
                    status: newStatusId,
                }),
            });
            console.log('estado del ticket:', newStatusId);

            if (!response.ok) {

                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Update Ticket Result:', data);

            resetTicketDetails();

            Swal.fire({
                icon: 'success',
                title: envs.TICKET_CERRADO,
                text: envs.TEXT_TICKET_CERRADO,
            });

        } catch (error) {
            console.error('Error al actualizar el estado del ticket o enviar la nota:', error);
            Swal.fire({
                icon: 'error',
                title: envs.ERROR_TICKET_CERRADO,
                text: envs.TEXT_ERROR_TICKET_CERRADO,
            });
        }
    };

    //LIMPIAR LOS CAMPOS DESPUES DE CERRAR TICKET
    const resetTicketDetails = () => {
        setSelectedTicket(null);
        setFolioTitle("");
        setDocumentUrl("");
        setShowImage(false);
        setShowPDF(false);
        setShowDOC(false);
        setNotes("");
        setSelectedTicketNotes([]);
        setIsNoteActive(false);
        setIsTicketClosed(false);
        setTicketState(null);
        setSelectedRowIndex(-1);
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
            <ToastContainer />
            <div className='row'>
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="ticket-navbar">
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
                            selectableRowsHighlight
                            pagination
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 10, 15]}
                            onRowClicked={(row, index) => { handleTicketClick(row, index); rowSelected(row); }}
                            highlightOnSelect={true}
                        />
                    </div>
                </div>
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="ticket-container">
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
                                    {selectedTicket && selectedTicket.Archivo &&(
                                        <>
                                            {selectedTicket.Archivo && (
                                                <div className="image-section" style={{ display: showImage ? 'block' : 'none' }}>
                                                    <p><span className="bold-title">Imagen:</span></p>
                                                    <img
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
                                            {selectedTicket.Archivo && (
                                                <div className="pdf-section" style={{ display: showPDF ? 'block' : 'none' }}>
                                                    <p><span className="bold-title">PDF:</span></p>
                                                    <button
                                                        className="btn-pdf"
                                                        onClick={() => window.open(`http://10.18.11.32:5000/uploads/documents/${selectedTicket.Archivo}`)}>
                                                        Ver PDF
                                                    </button>
                                                </div>
                                            )}
                                            {selectedTicket.Archivo && (
                                                <div className="doc-section" style={{ display: showDOC ? 'block' : 'none' }}>
                                                    <p><span className="bold-title">Documento DOCX:</span></p>
                                                    <button
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
                </div>
            </div>
            <div className="row">
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="contenedor-notas">
                        <h4>Respuesta al ticket</h4>
                        <div class="inputtxt validate-input">
                            <textarea
                                id="textarea_nota"
                                className="inputtxtarea"
                                name="message"
                                placeholder={`Ingresa una respuesta al ticket - ${folioTitle}`}
                                value={notes}
                                onChange={handleNotesChange}
                                disabled={!isNoteActive}
                            ></textarea>
                            <span class="focus-inputtxt"></span>
                        </div>
                        <div class="container-form-btn">
                            <button
                                id="btn_enviarnota"
                                className="form-btn-enviarnota"
                                onClick={handleSendNote}
                                disabled={!isNoteActive || !notes}>
                                Enviar Nota
                            </button>
                            <div className="separacion-notas"></div>
                            <button
                                id="btn_cerrarticket"
                                className="form-btn-cerrarnota"
                                onClick={handleCloseTicket}
                                disabled={!isNoteActive}>
                                Cerrar Ticket
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                    <div className="notas-container">
                        <h2>Respuestas</h2>
                        <DataTable
                            columns={[
                                {
                                    name: 'NOTAS',
                                    selector: row => row.CONTESTACION,
                                    sortable: true,
                                    cell: row => (
                                        <div style={{ maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.CONTESTACION}
                                        </div>
                                    ),
                                },
                                {
                                    name: 'P_SISTEMAS',
                                    selector: row => row.P_SISTEMAS,
                                    sortable: true,
                                    cell: row => (
                                        <div style={{ maxWidth: '30%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.P_SISTEMAS}
                                        </div>
                                    ),
                                },
                                {
                                    name: 'FECHA',
                                    selector: row => row.FECHA,
                                    cell: row => (
                                        <div style={{ maxWidth: '25%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {row.FECHA}
                                        </div>
                                    ),
                                },
                                {
                                    name: 'HORA',
                                    selector: row => row.HORA,
                                    cell: row => (
                                        <div style={{ maxWidth: '20%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                            subHeaderComponent={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4>Respuesta al ticket</h4>
                                </div>
                            }
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
                                id="img_predeterminadaAbiertos"
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
                                <div style={{ display: 'flex', justifyContent: 'center', maxHeight: '80vh' }}>
                                    <div style={{ maxWidth: '80vw', maxHeight: '60vh', overflow: 'hidden' }}>
                                        <img
                                            id="img_Archivosabiertos"
                                            src={documentUrl}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                            }}
                                            alt="Visualización previa"
                                        />
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
export default TicketList;