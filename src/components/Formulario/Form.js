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

function Form({ Nombre, usuarioNombre, usuarioArea, usuarioAreaDes }) {
    const location = useLocation();
    const { USUARIO } = sessionStorage.getItem('USUARIO_NOMBRE');

    const [Subcentro, setSubcentro] = useState('P');
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
    const [folio, setFolio] = useState(null);

    const userPrivilege = sessionStorage.getItem('PRIVILEGIO');
    const usuarioSubcentro = sessionStorage.getItem('Subcentro');
    console.log("Usuario en FORM:", Nombre);
    console.log("Nombre en FORM:", usuarioNombre);
    console.log("Area en FORM:", usuarioArea);


    //PERMITE RECIBIR EL ARCHIVO Y ASÍ SUBIRLO JUNTO CON EL FORMULARIO
    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    //MOSTRAR LA MODAL
    const handleShowModal = (isVisible, privilege) => {
        setShowModal(isVisible);
        setShowModal(isVisible && privilege !== 5);
    };

    const getServiceName = (serviceId) => {
        const service = servicios.find((s) => s.id === serviceId);
        return service ? service.nombre : 'Servicio no encontrado';
    };

    const getPriorityName = (priorityId) => {
        const priority = prioridades.find((p) => p.id === priorityId);
        return priority ? priority.nombre.toUpperCase() : 'Prioridad no encontrada';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Usuario Nombre en handleSubmit:", usuarioNombre);
        console.log("Usuario  en handleSubmit:", Nombre);
        console.log("Usuario ID en handleSubmit:", usuarioArea);

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
            formData.append('Area', usuarioArea);
            formData.append('Nombre', Nombre);

            const requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'manual'
            };

            //POST PARA VER LA INFORMACION DEL USUARIO
            async function usarioInformacion(subcentro) {
                let resultado;
                let resultado2;
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");


                var raw = JSON.stringify({
                    "subcentro": subcentro
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                await fetch(envs.API_USUARIO_INFO, requestOptions)
                    .then(response => response.text())
                    .then(result => resultado = result)
                    .catch(error => console.log('error', error));
                resultado2 = JSON.parse(resultado)
                console.log("resultado2: " + resultado2[0].Celular + resultado2[0].Sigla + resultado2[0].Id_subcentro);
                return resultado;
            }

            //POST PARA VER LA INFORMACIÓN DEL SERVICIO
            async function servicioInfo(idServicio) {
                let resultado;
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");


                var raw = JSON.stringify({
                    "idServicio": idServicio
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                await fetch(envs.API_SERVICIO_INFO, requestOptions)
                    .then(response => response.text())
                    .then(result => resultado = result)
                    .catch(error => console.log('error', error));
                return resultado;
            }

            //GET PARA LOS USUARIOS ESPECIALES
            async function obtenerUsuariosEspeciales(idServicio) {
                var myHeaders = new Headers();

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                try {
                    const response = await fetch(`${envs.API_GUARDAR_USERESPECIALES}?idServicio=${idServicio}`, requestOptions);
                    if (response.ok) {
                        const result = await response.json();
                        console.log('Usuarios especiales obtenidos:', result);
                        return result;
                    } else {
                        console.error('Error al obtener usuarios especiales:', response.statusText);
                        return [];
                    }
                } catch (error) {
                    console.error('Error al obtener usuarios especiales:', error);
                    return [];
                }
            }

            //OBTENER EL SERVICIO CON BASE A UN ID_SERVICIO COMO PARAMETRO
            const obtenerTipoServicioPredeterminado = async () => {
                try {
                    console.log('Entrando a obtenerTipoServicioPredeterminado');

                    const ID_SERVICIO = 35;

                    const response = await fetch(envs.API_PRUEBA, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ID_SERVICIO: ID_SERVICIO,
                        }),
                    });
                    const data = await response.json();
                    console.log('Respuesta del servidor:', data);

                    return data;
                } catch (error) {
                    console.error('Error al obtener el tipo de servicio predeterminado:', error);
                    return null;
                }
            };

            // Función para generar el mensaje de WhatsApp
            const generateWhatsappMessage = (numero, folio, usuarioNombre, Servicio, Requerimiento, Prioridad) => {
                console.log("numero y mensaje whats: " + numero + Requerimiento);

                return JSON.stringify({
                    "numero": numero,
                    "mensaje": `*🔴TICKET DE PRIORIDAD: ${getPriorityName(Prioridad)}*
                                
                    *No.ticket: ${folio}*
                    *Usuario:* ${usuarioNombre}
                    *Área:* Desarrollo de Tecnologías
                    *Servicio:* ${getServiceName(Servicio)}
                    *Solicitud:* ${Requerimiento}
                    *¡Gracias por su atención, Buen día!* 👏`
                });
            };

            //POST PARA WHATSAPP 
            async function envioWhatsapp(numero, mensaje) {
                console.log("numero y mensaje envio whats: " + numero + mensaje);
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: mensaje,
                    redirect: 'follow'
                };
                fetch(envs.API_WHATSAPP, requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
            }

            //ENVIAR WHATSAPP
            async function enviarMensajesWhatsapp(personalArray, folio, usuarioNombre, Servicio, Requerimiento, Prioridad) {
                for (const personal of personalArray) {
                    console.log(personal.Nombre);
                    const whatsappMessage = generateWhatsappMessage(
                        personal.Celular,
                        folio,
                        usuarioNombre,
                        Servicio,
                        Requerimiento,
                        Prioridad
                    );

                    await envioWhatsapp(personal.Celular, whatsappMessage);
                    console.log('Mensaje de WhatsApp enviado exitosamente.');
                }
            }

            //ENVIAR WHATSAPP PERSONAL POR SUBCENTRO PACHUCA
            async function enviarMensajesWhatsappPorSiglas(personalArray, siglasArray, folio, usuarioNombre, Servicio, Requerimiento, Prioridad) {
                let cont = 0;

                for (const personal of personalArray) {
                    if (siglasArray.includes(personal.Sigla)) {
                        console.log("NOMBRE: " + personal.Nombre);
                        const whatsappMessage = generateWhatsappMessage(
                            personal.Celular,
                            folio,
                            usuarioNombre,
                            Servicio,
                            Requerimiento,
                            Prioridad
                        );

                        await envioWhatsapp(personal.Celular, whatsappMessage);
                    }
                    cont = cont + 1;
                }
            }

            //POST PARA LEVANTAR TICKETS
            const response = await fetch(`${envs.API_TICKETS}`, requestOptions);
            if (response.ok) {
                const data = await response.json();
                setFolio(data.folio);
                console.log("FOLIO:", data);
                Swal.fire({
                    title: envs.TICKETEXITOSO,
                    icon: 'success',
                    showConfirmButton: false,
                });

                //VARIABLES PARA LOS WHATSAPP
                let dataServicio = JSON.parse(await servicioInfo(Servicio));
                let dataSigla = dataServicio[0].SIGLA;
                const dataUsuario = await usarioInformacion(Subcentro);

                const tipoServicioPredeterminado = await obtenerTipoServicioPredeterminado();
                console.log('Respuesta del servidor:', tipoServicioPredeterminado);

                let data2 = JSON.parse(dataUsuario)

                if (Prioridad === 4) {
                    //GRUPO DE PACHUCA Y AL PERSONAL DEL SUBCENTRO
                    if (Subcentro != 'P') {
                        setNotificationVisible(true);

                        const dataUsuarioGR = JSON.parse(await usarioInformacion("GR"));
                        console.log("usarioInformacion: " + dataUsuarioGR[0].Celular);

                        const whatsappMessage = generateWhatsappMessage(
                            dataUsuarioGR[0].Celular,
                            data.folio,
                            usuarioNombre,
                            Servicio,
                            Requerimiento,
                            Prioridad
                        );
                        await envioWhatsapp(dataUsuarioGR[0].Celular, whatsappMessage);

                        await enviarMensajesWhatsapp(data2, data.folio, usuarioNombre, Servicio, Requerimiento, Prioridad);
                    }
                    //GRUPO DE PACHUCA
                    else {
                        setNotificationVisible(true);

                        const dataUsuarioGR = JSON.parse(await usarioInformacion("GR"));
                        console.log("usarioInformacion: " + dataUsuarioGR[0].Celular);

                        const whatsappMessage = generateWhatsappMessage(
                            dataUsuarioGR[0].Celular,
                            data.folio,
                            usuarioNombre,
                            Servicio,
                            Requerimiento,
                            Prioridad
                        );
                        await envioWhatsapp(dataUsuarioGR[0].Celular, whatsappMessage);
                    }
                } else {
                    //BANDERA 3 Y PARA USUARIOS ESPECIALES
                    if (dataServicio[0].BANDERA === 3) {
                        console.log('Condiciones para enviar WhatsApp cumplidas');
                        console.log('Entrando al bloque para servicio con bandera 3 puede ser prioridad alta, media o baja');

                        try {
                            const usuariosEspecialesResponse = await obtenerUsuariosEspeciales(Servicio);
                            console.log('Usuarios especiales obtenidos:', usuariosEspecialesResponse);

                            if (usuariosEspecialesResponse && Array.isArray(usuariosEspecialesResponse.closedTickets)) {
                                const usuariosEspeciales = usuariosEspecialesResponse.closedTickets;

                                usuariosEspeciales.forEach(async (usuarioEspecial) => {
                                    console.log('Enviando mensaje de WhatsApp a usuario especial:', usuarioEspecial);

                                    const whatsappMessage = generateWhatsappMessage(
                                        usuarioEspecial.Celular,
                                        data.folio,
                                        usuarioNombre,
                                        Servicio,
                                        Requerimiento,
                                        Prioridad
                                    );

                                    await envioWhatsapp(usuarioEspecial.Celular, whatsappMessage);
                                    console.log('Mensaje de WhatsApp enviado exitosamente.');
                                });
                            } else {
                                console.error('La respuesta de la API no contiene el formato esperado:', usuariosEspecialesResponse);
                            }
                        } catch (error) {
                            console.error('Error al obtener usuarios especiales:', error);
                        }
                    }
                    else {
                        //BANDERA 2 Y PARA USUARIOS CON SUBCENTRO DISTINTO A PACHUCA
                        if (dataServicio[0].BANDERA === 2) {
                            if (Subcentro !== 'P') {
                                console.log("Entrando en BANDERA == 2 con Subcentro diferente de 'P'");
                                console.log("Nombres del personal del subcentro:");
                                await enviarMensajesWhatsapp(data2, data.folio, usuarioNombre, Servicio, Requerimiento, Prioridad);
                            }
                            //BANDERA 2 Y PARA USUARIOS CON SUBCENTRO A PACHUCA
                            else {
                                console.log("bandera: " + dataServicio[0].BANDERA);
                                console.log("Siglas: " + dataSigla);

                                const siglasArray = dataSigla.split(',');

                                let cont = 0;

                                console.log("entro con bandera 2 y es de Pachuca");
                                console.log("LONGITUD DE USUARIO : " + data2.length);

                                await enviarMensajesWhatsappPorSiglas(data2, siglasArray, data.folio, usuarioNombre, Servicio, Requerimiento, Prioridad);

                            }
                        }
                        //BANDERA 1 Y PARA USUARIOS CON SUBCENTRO DISTINTO A PACHUCA
                        if (dataServicio[0].BANDERA === 1) {
                            if (Subcentro !== 'P') {
                                //UBICA EL PERSONAL DEL SUBCENTRO
                                // envias whasta app a todo del subcentro
                                console.log("Entrando en BANDERA == 1 con Subcentro diferente de 'P'");
                                console.log("Nombres del personal del subcentro:");
                                enviarMensajesWhatsapp(data2, data.folio, usuarioNombre, Servicio, Requerimiento, Prioridad);
                            }
                            //BANDERA 1 Y PARA USUARIOS CON SUBCENTRO A PACHUCA
                            else {
                                let cont = 0;

                                console.log("entro con bandera 1 y es de Pachuca");
                                console.log("LONGITUD DE USUARIO : " + data2.length);
                                const siglasArray = dataSigla.split(',');

                                await enviarMensajesWhatsappPorSiglas(data2, siglasArray, data.folio, usuarioNombre, Servicio, Requerimiento, Prioridad);

                            }
                        }
                    }
                }
            }
            handleSend(selectedFile);
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            alert('Error al crear el ticket. Por favor, inténtalo nuevamente.');
        }
    };

    //LIMPIAR LOS CAMPOS
    const handleLimpiar = () => {
        setSubcentro("");
        setServicio("");
        setPrioridad("");
        setRequerimiento("");
    };

    //CARGAR LOS SELECT DESDE EL SERVICIO
    useEffect(() => {

        fetch(`${envs.API_SERVICIOS}`)
            .then((response) => response.json())
            .then((data) => setServicios(data))
            .catch((error) => console.error("Error al obtener los servicios:", error));

        fetch(`${envs.API_SUBCENTRO}`)
            .then((response) => response.json())
            .then((data) => {
                setCentros(data);
                const subcentrosPermitidos = ['B', 'H', 'P', 'T'];
                const subcentroPorDefecto = subcentrosPermitidos.includes(usuarioSubcentro)
                    ? usuarioSubcentro
                    : 'P';
                const subcentroPorDefectoData = data.find((s) => s.nombre === `C5i ${subcentroPorDefecto}`);
                if (subcentroPorDefectoData) {
                    setSubcentro(subcentroPorDefectoData.id);
                    console.log("subcentro:", usuarioSubcentro);
                }
            })
            .catch((error) => console.error("Error al obtener los subcentros:", error));

        fetch(`${envs.API_PRIORIDAD}`)
            .then((response) => response.json())
            .then((data) => setPrioridades(data))
            .catch((error) => console.error("Error al obtener las prioridades:", error));

        const handleNAV = () => {
            window.location.href = 'http://10.18.11.32:3000/abiertos';
        };

        //Notificación  
        const notificationInterval = setInterval(() => {
            if (notificationVisible) {
                console.log("Prioridad:", Prioridad);
                if (Prioridad === 3 || Prioridad === 4) {
                    console.log("Mostrar notificación");
                    const usuarioNombreString = sessionStorage.getItem('USUARIO_NOMBRE');

                    if (usuarioNombreString) {
                        const USUARIO = usuarioNombreString; 
                        console.log(USUARIO);

                        const audio = new Audio('/sounds/Sirena.mp3');
                        audio.play();
                        toast.error('¡ALERTA!, TIENES UN TICKET DE PRIORIDAD URGENTE', {
                            autoClose: 10000, // 10 segundos
                            onClick: handleNAV,
                        });
                    } else {
                        console.error('Error al obtener el nombre de usuario desde sessionStorage');
                    }
                }
            }
        }, 10000); // 20 segundos

        return () => {
            clearInterval(notificationInterval);
        };
    }, [notificationVisible, Prioridad, usuarioSubcentro]);

    //MAPEAR TODOS LOS SELECT
    const renderSelectOptions = (options) => {
        return options.map((option) => (
            <option key={option.id} value={option.id}>
                {option.nombre}
            </option>
        ));
    };

    return (
        <div className="App">
            <div className=" ml-2 mr-2">
                <form id="frm_principal-1" className="">
                    <div className='row'>
                        <ToastContainer />
                        <div className='col-12 col-sm-12 col-lg-12 col-xl-6'>
                            <div className="formulario_tickets">
                                <div className="centro">
                                    <label id="lbl_centro" className="titulo">Subcentro</label>
                                    <select
                                        id="select_subcentro"
                                        className="select_form_tickets"
                                        type="Subcentro"
                                        value={Subcentro || 'P'}
                                        onChange={(e) => {
                                            const selectCentroId = e.target.value;
                                            setSubcentro(selectCentroId);

                                            console.log("Valor seleccionado:", selectCentroId);
                                            console.log("Arreglo de Subcentro: ", centros);

                                            const selectedCentro = centros.find((s) => s.id === selectCentroId);
                                            if (selectedCentro) {
                                                console.log(`Centro seleccionado - ID: ${selectedCentro.id}, Nombre: ${selectedCentro.nombre}`);
                                            } else {
                                                console.log("Subcentro no encontrado");
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
                                        {userPrivilege === '2' && (
                                            <button
                                                title="Agregar servicio"
                                                id="btn_agregarServicio"
                                                className="agregar"
                                                type="button"
                                                onClick={() => handleShowModal(true)}
                                            >
                                                <BsFillPatchPlusFill />
                                            </button>
                                        )}

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
