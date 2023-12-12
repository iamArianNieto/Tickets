import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../CSS/styles.css";
import { Modal, Button } from 'react-bootstrap';
import envs from 'react-dotenv';
import { MdOutlineDeleteOutline } from 'react-icons/md';

function CustomModal({ handleShowModal, showModal }) {
  const [selectedServiciosGenerales, setSelectedServiciosGenerales] = useState([]);
  const [serviciosgenerales, setserviciosgenerales] = useState([]);
  const [selectedServiceSigla, setSelectedServiceSigla] = useState("");

  const [selectedBandera, setSelectedBandera] = useState("1");
  const [showSelectEspecial, setShowSelectEspecial] = useState(false);
  const [usuariosEspeciales, setUsuariosEspeciales] = useState([]);
  const [showServicios, setShowServicios] = useState(true)
  const [selectedUsuarioEspecial, setSelectedUsuarioEspecial] = useState(null);
  const [selectedUsuariosEspeciales, setSelectedUsuariosEspeciales] = useState([]);

  const [modalUsuarios, setModalUsuarios] = useState('');
  const [txtservicio, setTxtServicio] = useState('');

  //GUARDAR LOS SERVICIOS CONFORME A LA BANDERA
  const handleSaveService = async () => {
    if (modalUsuarios === '') {
      const nuevoServicio = document.getElementById('txt_AgregarServicio').value.toUpperCase();
      setTxtServicio(nuevoServicio)

      //VALIDACIÓN PARA QUE OBLIGATORIAMENTE ESCRIBA ALGO EN EL INPUT DE TIPO DE SERVICIO
      if (!nuevoServicio.trim()) {
        alert('El campo de servicio es obligatorio. Por favor, llénelo.');
        return;
      }

      const serviciosSeleccionados = selectedServiciosGenerales.map((servicio) => `${servicio.id} - ${servicio.nombre}`);
      const idsServiciosSeleccionados = selectedServiciosGenerales.map((servicio) => servicio.id);

      //INSERTAR LOS DATOS A SERVICIOS PARA LAS BANDERAS 1 Y 2
      try {

        //VALIDACIÓN DE NO AGREGAR SERVICIOS DUPLICADOS
        const response = await fetch(`${envs.API_VERIFICAR_SERVICIO}${encodeURIComponent(nuevoServicio)}`);
        const data = await response.json();

        if (data.existe) {
          alert('Este servicio ya existe en la base de datos. Por favor, elija otro servicio.');
          return;
        }
        if (selectedBandera === "1" || selectedBandera === "2") {
          const requestBody = {
            NombreServicio: nuevoServicio,
            ServiciosGenerales: serviciosSeleccionados,
            Bandera: selectedBandera,
            Sigla: idsServiciosSeleccionados,
          };

          console.log('Enviando solicitud para bandera 1 o 2:', requestBody);

          const response = await fetch(`${envs.API_SERVICIOS}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();
          alert(data.mensaje);
          handleShowModal(false);
          setModalUsuarios('');
          setSelectedServiciosGenerales([]);

          //INSERTAR LOS DATOS A SERVICIOS PARA LA BANDERA 3
        }
        else if (selectedBandera === "3") {
          const requestBody = {
            NombreServicio: nuevoServicio,
            Bandera: selectedBandera,
            Sigla: ["ESP"],
          };

          console.log('Enviando solicitud para bandera 3:', requestBody);

          const response = await fetch(`${envs.API_SERVICIOS}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();
          alert(data.mensaje);
          setModalUsuarios('Guardado');
          setSelectedServiciosGenerales([]);
        }
      } catch (error) {
        console.error('¡uy!, Ocurrió un error al guardar el servicio:', error);
      }

    }
    else {
      //GUARDAR LOS USUARIOS EN LA TABLA DE USUARIOS ESPECIALES
      const usuarios = selectedUsuariosEspeciales.map((usuario) => ({
        Celular: usuario.Celular,
        Nombre: usuario.Nombre,
        Ape_paterno: usuario.Ape_paterno,
        Ape_materno: usuario.Ape_materno,
        Id_subcentro: usuario.Id_subcentro,
        Bandera: selectedBandera,
        Id_servicio: txtservicio,
      }));

      console.log("usuarios: " + usuarios);
      console.log("selectedUsuariosEspeciales" + selectedUsuariosEspeciales);

      try {
        const response = await fetch(`${envs.API_GUARDAR_USERESPECIALES}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuarios }),
        });

        const data = await response.json();
        alert(data.message);
        handleShowModal(false);
      } catch (error) {
        console.error('Error al guardar usuarios:', error);
      }
      setModalUsuarios('')
      handleShowModal(false);
    }
  };

  const handleInputChange = (event) => {
    const inputElement = document.getElementById('txt_AgregarServicio');

    if (inputElement) {
      inputElement.value = event.target.value.toUpperCase();
    } else {
      console.error('Element with ID txt_AgregarServicio not found.');
    }
  };

  //SELECIÓN DE LAS BANDERAS
  const handleBanderaChange = (e) => {
    setSelectedBandera(e.target.value);
    setShowSelectEspecial(e.target.value === "3");
    setShowServicios(e.target.value !== "3");
  };

  useEffect(() => {
    fetch(`${envs.API_SERVICIOS_GENERALES}`)
      .then((response) => response.json())
      .then((data) => setserviciosgenerales(data))
      .catch((error) => console.error("Error al obtener los servicios:", error));

    //TRAE LA INFORMACIÓN DE TODOS LOS USUARIOS
    const fetchUserInformation = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "subcentro": "TO"
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        const response = await fetch(envs.API_USUARIO_INFO, requestOptions);

        if (!response.ok) {
          throw new Error('Error al obtener la información del usuario');
        }

        const result = await response.json();
        setUsuariosEspeciales(result);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
      }
    };
    fetchUserInformation();
    setModalUsuarios('')
    setTxtServicio('')
  }, []);

  //TRAE EL SERVICIO CON SU SIGLA EN SELECT DE SERVICIOS GENERALES
  const handleServicioGeneralChange = (e) => {
    const selectedServiceId = e.target.value;
    const selectedService = serviciosgenerales.find((s) => s.id === selectedServiceId);

    if (selectedService) {
      console.log("Objeto del servicio seleccionado:", selectedService);
      console.log("Sigla del servicio seleccionado:", selectedService.id);

      setSelectedServiceSigla(selectedService.id);
      setSelectedServiciosGenerales((prevSelected) => [...prevSelected, selectedService]);
    }
  };

  //TRAE EL USUARIO CON SU SIGLA PARA SELECT DE USUARIOS ESPECIALES
  const handleUsuarioEspecialChange = (e) => {
    console.log("handleUsuarioEspecialChange se ejecutó");
    console.log("usuariosEspeciales:", usuariosEspeciales);

    const selectedUserName = e.target.value;
    console.log("ID del usuario especial seleccionado:", selectedUserName);

    const selectedUser = usuariosEspeciales.find(
      (user) => `${user.Nombre} ${user.Ape_paterno} ${user.Ape_materno}` === selectedUserName
    );
    console.log("selectedUser:", selectedUser);

    if (selectedUser) {
      console.log("Objeto del usuario especial seleccionado:", selectedUser);
      console.log("Sigla del servicio seleccionado:", selectedUser.Sigla);

      setSelectedUsuarioEspecial(selectedUser);

      setSelectedUsuariosEspeciales((prevSelected) => [...prevSelected, selectedUser]);
    } else {
      console.log(`Usuario con ID ${selectedUserName} no encontrado.`);
    }
  };

  //ELIMINAR LA SELECCIÓN DE LOS SELECT DE SERVICIOS
  const handleDeleteServicio = (servicioId) => {
    setSelectedServiciosGenerales((prevSelected) =>
      prevSelected.filter((servicio) => servicio.id !== servicioId)
    );
  };

  //ELIMINAR LA SELECCIÓN DE LOS SELECT DE USUARIOS ESPECIALES
  const handleDeleteUsuarioEspecial = (sigla) => {
    setSelectedUsuariosEspeciales((prevSelected) =>
      prevSelected.filter((usuario) => usuario.Sigla !== sigla)
    );
  };

  //BOTÓN DE CERRAR
  const handleCancel = () => {
    setSelectedServiciosGenerales([]);
    setSelectedUsuariosEspeciales([]);
    setShowServicios(true);
    setShowSelectEspecial(false);
    handleShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={() => handleShowModal(false)}>
      <Modal.Header>
        <Modal.Title>{modalUsuarios === '' ? "Agregar nuevo servicio" : "Servicio ya agregado"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className='addServicioEspecifico-contenedor'>
            <label style={{ fontWeight: 'bold' }}>Tipo de Servicio: </label>
            {modalUsuarios === '' ?
              (
                <input
                  id='txt_AgregarServicio'
                  className='form-control'
                  type="text"
                  placeholder="Agrega el servicio específico"
                  autoFocus
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  id='txt_ServicioDisabled'
                  className='form-control'
                  type="text"
                  placeholder=""
                  value={txtservicio}
                  autoFocus
                  disabled
                />
              )
            }
          </div>
          {modalUsuarios === '' ?
            (<div className='radiobutton-contenedor'>
              <label style={{ fontWeight: 'bold' }}>Tipo de Atención:</label>
              <div className="radio-container">
                <div style={{ paddingLeft: "0.7rem" }} >
                  <input
                    type="radio"
                    id="bandera1"
                    name="banderas"
                    value="1"
                    onChange={handleBanderaChange}
                    defaultChecked
                  />
                  <label style={{ paddingLeft: "0.5rem" }} htmlFor="bandera1">Básica</label>
                </div>
                <div style={{ paddingLeft: "1rem" }}>
                  <input
                    type="radio"
                    id="bandera2"
                    name="banderas"
                    onChange={handleBanderaChange}
                    value="2"
                  />
                  <label style={{ paddingLeft: "0.5rem" }} htmlFor="bandera2">Múltiples áreas</label>
                </div>
                <div style={{ paddingLeft: "1rem" }}>
                  <input
                    type="radio"
                    id="bandera3"
                    name="banderas"
                    onChange={handleBanderaChange}
                    value="3"
                  />
                  <label style={{ paddingLeft: "0.5rem" }} htmlFor="bandera3">Atención especializada</label>
                </div>
              </div>
            </div>
            ) : <></>
          }
          {modalUsuarios === '' ? <></> : (
            <div className='select-especial-contenedor'>
              <label style={{ fontWeight: 'bold' }}>Usuarios Especiales:</label>
              <select
                id="select_usuarios_especiales"
                className='form-control'
                onChange={handleUsuarioEspecialChange}>
                <option value="">SELECCIONE UN USUARIO ESPECIAL</option>
                {usuariosEspeciales && usuariosEspeciales.length > 0 ? (
                  usuariosEspeciales.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {`${usuario.Nombre} ${usuario.Ape_paterno} ${usuario.Ape_materno}`}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Cargando los datos...</option>
                )}
              </select>
            </div>
          )}
          {modalUsuarios === '' ? <></> : (
            <div className='ServicioGeneral-contenedor'>
              <label style={{ fontWeight: 'bold' }}>Usuarios Especiales Seleccionados:</label>
              <ul>
                {selectedUsuariosEspeciales.map((usuario, index) => (
                  <li key={`${usuario.Sigla}-${index}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {`${usuario.Sigla} - ${usuario.Nombre} ${usuario.Ape_paterno} ${usuario.Ape_materno}`}
                    <MdOutlineDeleteOutline
                      style={{ cursor: 'pointer', marginLeft: '5px', width: '1.6rem', height: '1.6rem' }}
                      onClick={() => handleDeleteUsuarioEspecial(usuario.Sigla)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showServicios && (
            <div className='addServicio-contenedor'>
              <label style={{ fontWeight: 'bold' }}>Servicio: </label>
              <select
                id="select_servicio_general"
                className='form-control'
                onChange={handleServicioGeneralChange}>
                <option value="">SELECCIONE UNA OPCIÓN</option>
                {serviciosgenerales && serviciosgenerales.length > 0 ? (
                  serviciosgenerales.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.nombre}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Cargando los datos...</option>
                )}
              </select>
            </div>
          )}
          {showServicios && (
            <div className='ServicioGeneral-contenedor'>
              <label style={{ fontWeight: 'bold' }}>Servicios Generales Seleccionados:</label>
              <ul>
                {selectedServiciosGenerales.map((servicio) => (
                  <li key={servicio.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {`${servicio.id} - ${servicio.nombre}`}
                    <MdOutlineDeleteOutline
                      style={{ cursor: 'pointer', marginLeft: '5px', width: '1.6rem', height: '1.6rem' }}
                      onClick={() => handleDeleteServicio(servicio.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button id="btn_guardar" className='buttonModalSave' variant="primary" onClick={handleSaveService}>
          {modalUsuarios === '' ? "Agrear Servicio" : "Guardar"}
        </Button>
        <Button id="btn_cerrar" className='buttonModalClose' variant="secondary" onClick={handleCancel}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
