import React, { useState, useEffect } from "react";
import Cargar from "./cargar.js";
import { handleSend } from './cargar.js';
import "../../CSS/styles.css";
import Swal from 'sweetalert2';
import { Link, useLocation } from "react-router-dom";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "../Formulario/Modal.js";

import envs from 'react-dotenv';

function Form() {
    const location = useLocation(); // Usa useLocation para obtener la ubicación actual

    const [Subcentro, setSubcentro] = useState('');
    const [Servicio, setServicio] = useState('');
    const [Prioridad, setPrioridad] = useState('');
    const [Requerimiento, setRequerimiento] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const FechaCreacion = new Date().toJSON();

    const [centros, setCentros] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [prioridades, setPrioridades] = useState([]);

    const [notificationVisible, setNotificationVisible] = useState(false);

    const [showModal, setShowModal] = useState(false);


    //este permitira traer el archivo y asi poderlo subir junto con el formulario
    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    //Mostrar el modal 
    const handleShowModal = (isVisible) => {
        setShowModal(isVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Subcentro || !Servicio || !Prioridad || !Requerimiento) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('Subcentro', Subcentro);
            formData.append('Servicio', Servicio);
            formData.append('Prioridad', Prioridad);
            formData.append('Requerimiento', Requerimiento);
            formData.append('file', selectedFile);
            formData.append('FechaCreacion', FechaCreacion);

            const requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'manual'
            };

            const response = await fetch(`${envs.API_TICKETS}`, requestOptions);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                Swal.fire({
                    title: envs.TICKETEXITOSO,
                    icon: 'success',
                    showConfirmButton: false,
                });
                if (Prioridad === 1) {
                    setNotificationVisible(true);
                } else {
                    setNotificationVisible(false);
                }
            } else {
                console.error('Error al crear el ticket:', response.statusText);
                alert('Error al crear el ticket. Por favor, inténtalo nuevamente.');
            }
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            alert('Error al crear el ticket. Por favor, inténtalo nuevamente.');
        }
        handleSend(selectedFile);
    };

    const handleLimpiar = () => {
        setSubcentro("");
        setServicio("");
        setPrioridad("");
        setRequerimiento("");
    };

    // Cargar datos de select
    useEffect(() => {

        fetch(`${envs.API_SERVICIOS}`)
            .then((response) => response.json())
            .then((data) => setServicios(data))
            .catch((error) => console.error("Error al obtener los servicios:", error));

        fetch(`${envs.API_SUBCENTRO}`)
            .then((response) => response.json())
            .then((data) => setCentros(data))
            .catch((error) => console.error("Error al obtener los subcentros:", error));

        fetch(`${envs.API_PRIORIDAD}`)
            .then((response) => response.json())
            .then((data) => setPrioridades(data))
            .catch((error) => console.error("Error al obtener las prioridades:", error));

        const handleNAV = () => {
            window.location.href = 'http://localhost:3000/abiertos';
        };

        //Notificación  
        const notificationInterval = setInterval(() => {
            if (notificationVisible) {
                console.log("Prioridad:", Prioridad); // Agregar este console.log
                if (Prioridad === 1) { // Solo mostrar notificación si la prioridad es igual a 1 (ALTA)
                    console.log("Mostrar notificación"); // Agregar este console.log
                    const audio = new Audio('/sounds/Sirena.mp3');
                    audio.play();
                    toast.error('¡ALERTA!, TIENES UN TICKET DE ALTA PRIORIDAD', {
                        autoClose: 10000, // 10 segundos
                        onClick: handleNAV,
                    });
                }
            }
        }, 20000);  // 20 segundos

        return () => {
            clearInterval(notificationInterval);
        };
    }, [notificationVisible, Prioridad]);

    //mapear opciones de los select
    const renderSelectOptions = (options) => {
        return options.map((option) => (
            <option key={option.id} value={option.id}>
                {option.nombre}
            </option>
        ));
    };
    return (
        <div className="App">
            <div className="">
                <form id="frm_principal" className="">
                    <div className='row'>
                        <ToastContainer />
                        <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                            <div className="formulario_tickets">
                                <div className="centro">
                                    <label id="lbl_centro" className="titulo">Subcentro</label>
                                    <select
                                        id="select_subcentro"
                                        type="Subcentro"
                                        className="select_form_tickets"
                                        value={Subcentro}
                                        onChange={(e) => {
                                            const selectCentroId = e.target.value;
                                            setSubcentro(selectCentroId);

                                            console.log("Valor seleccionado:", selectCentroId);
                                            console.log("Arreglo de servicios: ", centros);

                                            const selectedCentro = centros.find((s) => s.id === selectCentroId);
                                            if (selectedCentro) {
                                                console.log(`Centro seleccionado - ID: ${selectedCentro.id}, Nombre: ${selectedCentro.nombre}`);
                                            } else {
                                                console.log("Servicio no encontrado");
                                            }

                                        }}>
                                        <option value="">Selecciona una opción</option>
                                        {centros && centros.length > 0 ? (
                                            renderSelectOptions(centros)
                                        ) : (
                                            <option value="" disabled>Cargando los datos...</option>
                                        )}
                                    </select>
                                </div>

                                <div className="centro" >
                                    <label id="lbl_servicio" className="titulo2">Servicio</label>
                                    <div className="servicio" style={{ display: "flex", alignItems: "center" }}>
                                        <select
                                            id="select_servicio"
                                            type="servicio"
                                            className="select_form_tickets"
                                            value={Servicio}
                                            onChange={(e) => {
                                                const selectedServiceId = parseInt(e.target.value, 10);
                                                setServicio(selectedServiceId);

                                                console.log("Valor seleccionado:", selectedServiceId);
                                                console.log("Arreglo de servicios:", servicios);

                                                const selectedService = servicios.find((s) => s.id === selectedServiceId);
                                                if (selectedService) {
                                                    console.log(`Servicio seleccionado - ID: ${selectedService.id}, Nombre: ${selectedService.nombre}`);
                                                } else {
                                                    console.log("Servicio no encontrado");
                                                }
                                            }}>
                                            <option value="">Selecciona una opción</option>
                                            {servicios && servicios.length > 0 ? (
                                                renderSelectOptions(servicios)
                                            ) : (
                                                <option value="" disabled>Cargando los datos...</option>
                                            )}
                                        </select>
                                        <button
                                            title="Agregar servicio"
                                            id="btn_agregarServicio"
                                            className="agregar"
                                            type="button"
                                            onClick={() => handleShowModal(true)} >
                                            <BsFillPatchPlusFill />
                                        </button>
                                    </div>
                                </div>

                                <div className="centro">
                                    <label id="lbl_prioridad" className="titulo3">Prioridad</label>
                                    <select
                                        id="select_prioridad"
                                        type="prioridad"
                                        className="select_form_tickets"
                                        value={Prioridad}
                                        onChange={(e) => {
                                            const selectPrioridadId = parseInt(e.target.value, 10);
                                            setPrioridad(selectPrioridadId);

                                            console.log("Valor seleccionado: ", selectPrioridadId);
                                            console.log("Arreglo seleccionado: ", prioridades);

                                            const selectPrioridades = prioridades.find((s) => s.id === selectPrioridadId);
                                            if (selectPrioridades) {
                                                console.log(`Servicio seleccionado - ID:${selectPrioridades.id}, Nombre: ${selectPrioridades.nombre}`);
                                            } else {
                                                console.log("Servicio no encontrado");
                                            }

                                        }}>
                                        <option value="">Selecciona una opción</option>
                                        {prioridades && prioridades.length > 0 ? (
                                            renderSelectOptions(prioridades)
                                        ) : (
                                            <option value="" disabled>Cargando los datos...</option>
                                        )}
                                    </select>
                                </div>

                                <div className="descripcion">
                                    <label id="lbl_descripcion" className="titulo4">Descripción</label>
                                    <textarea
                                        id="txtarea_descripcion"
                                        className="textarea"
                                        type="descripcion"
                                        value={Requerimiento}
                                        onChange={(e) => setRequerimiento(e.target.value)}
                                        placeholder="Descripción"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                            <div className="subirArchivos">
                                <Cargar selectedFile={selectedFile} handleFileChange={handleFileChange} />
                            </div>
                            <img src="https://images.hola.com/imagenes/mascotas/20190426140762/perro-huevo-pompom-gt/0-669-982/portada-pompom-t.jpg?tx=w_1200" />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='botones_Form'>
                            <button id="btn_enviarForm" className="button1" type="submit" onClick={handleSubmit}>Enviar</button>
                           <div className="separacion"></div>
                            <button id="btn_limpiarForm" className="button2" type="submit" onClick={handleLimpiar}>Limpiar</button>
                        </div>
                    </div>
                </form>
            </div>
            <Modal showModal={showModal} handleShowModal={handleShowModal} />
        </div>
    );
}
export default Form;