import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Ips.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CaracteristicasIcon from "../assets/caracteristicas.png";
import UbicacionIcon from "../assets/ubicacion.png";
import styled, { StyleSheetManager } from "styled-components";
import {
  faEdit,
  faTrash,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import { Await } from "react-router-dom";
import envs from "react-dotenv";

const MONGO_URI = "http://10.18.11.31:5000/gestorips";
const MONGO_URI_SEGMENTOSBD = "http://10.18.11.31:5000/segmentosbd";

const StyledCell = styled.div`
  font-size: 13px;
  min-width: 100px;
`;
//estilo de la tabla
const customStyles = {
  headRow: {
    style: {
      backgroundColor: "lightblue",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      borderBottom: "1px solid #ccc",
    },
  },
  cells: {
    style: {
      padding: "8px",
      margin: "4px",
    },
    pagination: {
      style: {
        backgroundColor: "#f2f2f2", // Color de fondo de la paginación
      },
    },
  },
};
//funcion para crear el componente
function IP() {
  const [ip, setIp] = useState("");
  const [hostname, setHostname] = useState("");
  const [area, setArea] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [responsable, setResponsable] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("Seleccione lugar");
  const [estado, setEstado] = useState("Libre");
  const [equipos, setEquipos] = useState("Seleccione un equipo");
  const [ip_publica, setIp_publica] = useState("");
  const [ip_cliente, setIp_cliente] = useState("");
  const [dns, setDns] = useState("");
  const [puerto, setPuerto] = useState("");
  const [caracteristicas, setCaracteristicas] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [records, setRecords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterEquipos, setFilterEquipos] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUbi, setIsModalOpenUbi] = useState(false);
  const [selectedUbi, setSelectedUbi] = useState(null);
  const [isModalOpenCaract, setIsModalOpenCaract] = useState(false);
  const [selectedCaract, setSelectedCaract] = useState(null);
  const [segmento, setSegmento] = useState("");
  const [idInicial, setIdInicial] = useState("");
  const [idFinal, setIdFinal] = useState("");
  const [areas, setAreas] = useState(["Desarrollo", "Administración", "Test"]);
  const [loading, setLoading] = useState(false);

  const [segmentos, setSegmentos] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [isReloading, setIsReloading] = useState(false);

  const [selectedSegmentData, setSelectedSegmentData] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);

  //const [segmentosIngresados, setSegmentosIngresados] = useState([]);
  //const [segmentosSeleccionados, setSegmentosSeleccionados] = useState([]);
  //crea la tabla de la base de datos
  const columns = [
    {
      name: "Equipos",
      selector: (row) => row.equipos, //hacerlo asi por los errores
      sortable: true,
      cell: (row) => <StyledCell>{row.equipos}</StyledCell>,
    },
    {
      name: "Ip Local",
      selector: "ip",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip}</StyledCell>,
    },
    {
      name: "Hostname",
      selector: "hostname",
      sortable: true,
      cell: (row) => <StyledCell>{row.hostname}</StyledCell>,
    },
    {
      name: "Area",
      selector: "area",
      sortable: true,
      cell: (row) => <StyledCell>{row.area}</StyledCell>,
    },
    {
      name: "Solicitante",
      selector: "solicitante",
      sortable: true,
      cell: (row) => <StyledCell>{row.solicitante}</StyledCell>,
    },
    {
      name: "Responsable",
      selector: "responsable",
      sortable: true,
      cell: (row) => <StyledCell>{row.responsable}</StyledCell>,
    },
    {
      name: "Fecha Entrada",
      selector: "fecha",
      sortable: true,
      cell: (row) => <StyledCell>{row.fecha}</StyledCell>,
    },
    {
      name: "Lugar",
      selector: "lugar",
      sortable: true,
      cell: (row) => <StyledCell>{row.lugar}</StyledCell>,
    },
    {
      name: "Estado",
      selector: "estado",
      sortable: true,
      cell: (row) => <StyledCell>{row.estado}</StyledCell>,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          <button
            className="btn btn-warning btn-sm mr-2 mx-2"
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="btn btn-danger btn-sm mx-2"
            onClick={() => handleDelete(row)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];
  //crea la segunda tabla de la base de datos
  const columns2 = [
    {
      name: "Equipos",
      selector: "equipos",
      sortable: true,
      cell: (row) => <StyledCell>{row.equipos}</StyledCell>,
    },
    {
      name: "IP del servidor",
      selector: "ip",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip}</StyledCell>,
    },
    {
      name: "IP Pública",
      selector: "ip_publica",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip_publica}</StyledCell>,
    },
    {
      name: "IP de la maquina",
      selector: "ip_cliente",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip_cliente}</StyledCell>,
    },
    {
      name: "Puerto",
      selector: "puerto",
      sortable: true,
      cell: (row) => <StyledCell>{row.puerto}</StyledCell>,
    },
    {
      name: "Dns",
      cell: (row) => (
        <button
          onClick={() => handleVerDnsClick(row)}
          className="btn btn-link text-primary"
        ></button>
      ),
    },
    {
      name: "Características",
      cell: (row) => (
        <img
          src={CaracteristicasIcon}
          alt="Caracteristicas Icon"
          onClick={() => handleVerCaracteristicasClick(row)}
          className="image-icon btn btn-warning btn-sm mr-2 mx-2"
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      name: "Ubicación",
      cell: (row) => (
        <img
          src={UbicacionIcon}
          alt="Ubicacion Icon"
          onClick={() => handleVerUbicacionClick(row)}
          className="image-icon btn btn-warning btn-sm mr-2 mx-2"
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  //Es el que trae information desde la base de datos par verla en la tabl y tabla-modificar datos
  const fetchRecords = async () => {
    try {
      const response = await axios.get(MONGO_URI); //obtiene los datos desde la base de datos
      const data = response.data;
      setRecords(data);
      setFilteredRecords(data); // Agregar esta línea para inicializar filteredRecords
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
      setLoading(false);
    }
  };

  // Carga los registros iniciales cuando se monta el componente
  useEffect(() => {
    fetchRecords();
  }, []);

  //crea un nuevo segmento
  const handleAddSegment = () => {
    if (segmento && idInicial && idFinal) {
      const formattedSegment = `${segmento} (${idInicial} - ${idFinal})`;
      const newSegmento = {
        segmento: formattedSegment,
        ip_inicial: idInicial,
        ip_final: idFinal,
      };

      // Primera solicitud a la primera colección
      axios
        .post("http://10.18.11.31:5000/gestorips", newSegmento)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error al enviar los datos a GESTORIPS:", error);
        });

      console.log("Datos enviados a segmentos:", newSegmento);

      // Segunda solicitud a la segunda colección
      axios
        .post("http://10.18.11.31:5000/segmentosbd", newSegmento)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error al enviar los datos a SEGMENTOSBD:", error);
        });

      //setSegmentos([...segmento, newSegmento]);

      // Establecer el nuevo segmento como seleccionado
      //setSelectedSegment(formattedSegment);

      const ipSegments = segmento.split(".");
      const idInicio = parseInt(idInicial);
      const idFin = parseInt(idFinal);
      const segmentoBase = `${ipSegments[0]}.${ipSegments[1]}.${ipSegments[2]}.`;

      const segmentoData = [];

      //JUNTA LA IP COMPLETA
      for (let id = idInicio; id <= idFin; id++) {
        const ipCompleta = `${segmentoBase}${id}`;
        segmentoData.push({
          equipos: equipos,
          ip: ipCompleta,
          hostname: hostname,
          area: area,
          solicitante: solicitante,
          responsable: responsable,
          fecha: fecha,
          lugar: lugar,
          estado: estado,
        });
      }
      // Agregar lógica para guardar el nuevo segmento en la base de datos
      segmentoData.forEach((data) => {
        agregarRegistro(data); // Utiliza tu función agregarRegistro para guardar en la base de datos
      });
      // Limpiar los campos después de agregar el segmento
      setSegmento("");
      setIdInicial("");
      setIdFinal("");
      setIsModalOpen(false);
    }
  };

  // Función para filtrar los registros en función del segmento seleccionado
  const filterRecordsBySegment = (selectedSegment) => {
    console.log("selectedSegment:", JSON.stringify(selectedSegment));
    console.log("Records: (Primera Colección):", JSON.stringify(records));

    if (selectedSegment) {
      // Filtra los registros que coincidan con el segmento seleccionado
      const filtered = records.filter((record) => {
        // Agrega lógica para relacionar el segmento de la segunda colección con la primera colección
        // Por ejemplo, podrías comparar el número de segmento entre ambas colecciones
        // Si hay una relación específica entre las dos colecciones, asegúrate de aplicarla aquí
        return record.segmento.includes(selectedSegment.segment);
      });
      console.log(filtered); // Agrega este console.log
      return filtered;
    }
    // Si no se selecciona un segmento, muestra todos los registros de la primera colección
    return records;
  };

  // Maneja el cambio de segmento seleccionado
  const handleSegmentChange = (e) => {
    const selectedSegment = e.target.value;
    setSelectedSegment(selectedSegment);
    console.log(selectedSegment); // Agrega este console.log

    // Realiza una solicitud para obtener los datos relacionados de la segunda colección
    axios
      .get(`http://10.18.11.31:5000/gestorips?segmento=${selectedSegment}`)
      .then((response) => {
        const relatedData = response.data;
        console.log("Datos relacionados de la segunda colección:", relatedData);
        // Agrega este console.log para ver las direcciones IP en los datos relacionados
        const ipsInRelatedData = relatedData.map((item) => item.ip);
        console.log(
          "Direcciones IP en los datos relacionados:",
          ipsInRelatedData
        );
        // Filtra las IPs relacionadas que coinciden con el segmento seleccionado
        // Filtrar las IPs que coinciden con el segmento
        const filteredIPs = ipsInRelatedData.filter(
          (ip) => ip && ip.startsWith(selectedSegment)
        );
        console.log("IPs filtradas:", filteredIPs);
      })
      .catch((error) => {
        console.error(
          "Error al obtener los datos relacionados de la segunda colección:",
          error
        );
      });
  };

  useEffect(() => {
    // Realiza una solicitud para obtener los segmentos desde tu backend
    axios
      .get("http://10.18.11.31:5000/segmentosbd") //AQUI PERMITE VER LOS SEGMENTOS QUE AGREGO EN EL SELECT
      .then((response) => {
        // Cuando se obtienen los segmentos con éxito, actualiza el estado
        setSegmentos(response.data);
        console.log("segmentos:", response.data); // Agrega este console.log
      })
      .catch((error) => {
        console.error("Error al obtener los segmentos:", error);
      });
  }, []);

  //post agrega registros de los nuevos gefmentos a la base de datos
  const agregarRegistro = async (nuevoRegistro) => {
    try {
      const response = await axios.post(MONGO_URI, nuevoRegistro);
      console.log(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error("Error al agregar el registro:", error);
    }
    try {
      const response = await axios.post(MONGO_URI_SEGMENTOSBD, nuevoRegistro);
      console.log(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.error("Error al agregar el registro:", error);
    }
  };

  //aade o actualiza los campos a la tabla desde MODIFICAR DATOS, si se borran aparecen nulos... no lo hagas xd
  const handleAddRecord = () => {
    const newRecord = {
      equipos: equipos,
      ip: ip,
      hostname: hostname,
      area: area,
      solicitante: solicitante,
      responsable: responsable,
      fecha: fecha,
      lugar: lugar,
      estado: estado,
      ip_publica: ip_publica,
      ip_cliente: ip_cliente,
      puerto: puerto,
      dns: dns,
      caracteristicas: caracteristicas,
      ubicacion: ubicacion,
    };

    if (selectedRecord) {
      actualizarRegistro({ ...newRecord, _id: selectedRecord._id });
    } else {
      agregarRegistro(newRecord);
    }
    // Limpia los campos después de agregar o actualizar desde MODIFCAR DATOS
    setEquipos("");
    setIp("");
    setIp_publica("");
    setIp_cliente("");
    setHostname("");
    setArea("");
    setSolicitante("");
    setResponsable("");
    setFecha("");
    setLugar("Seleccione un lugar");
    setEstado("Ocupado");
    setPuerto("");
    setDns("");
    setCaracteristicas("");
    setUbicacion("");
    setSelectedRecord(null);
    setIsModalOpen(false);
    fetchRecords(); // Vuelve a cargar los registros después de agregar o actualizar
    console.log(records);
  };

  //put actualiza los registro desde el MODIFICAR DATOS
  const actualizarRegistro = async (registroActualizado) => {
    try {
      console.log(loading); // Antes de setLoading(true)
      setLoading(true); // Inicia el indicador de carga
      console.log(loading); // Después de setLoading(true)
      const response = await axios.put(
        `http://10.18.11.31:5000/gestorips/${registroActualizado._id}`,
        registroActualizado
      );
      console.log(response.data.message);
      console.log(loading); // Antes de setLoading(false)
      setLoading(false);
      console.log(loading); // Después de setLoading(false)
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      console.error("Error:", error);
      setLoading(false);
    }
  };

  //función para actualizar el registro en el servidor
  const updateRecord = async (row) => {
    try {
      setLoading(true);
      // Realiza la solicitud al servidor para actualizar el registro
      await axios.put(`http://10.18.11.31:5000/gestorips${row._id}`, row);
      console.log("User updated successfully");

      fetchRecords();
      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      setLoading(false);
    }
  };

  //Boton para Editar los registros en MODIFICAR DATOS
  const handleEdit = (row) => {
    setSelectedRecord(row);
    setEquipos(row.equipos);
    setIp(row.ip);
    setHostname(row.hostname);
    setArea(row.area);
    setSolicitante(row.solicitante);
    setResponsable(row.responsable);
    setFecha(row.fecha);
    setLugar(row.lugar);
    setEstado(row.estado);
    // Actualiza el estado local con los cambios primero
    const updatedRecords = records.map((record) => {
      if (record._id === row._id) {
        return {
          ...record,
          equipos: row.equipos,
          ip: row.ip,
          // Otras propiedades actualizadas
        };
      }
      return record;
    });
    setRecords(updatedRecords);

    // Luego realiza la solicitud al servidor
    updateRecord(row); // Supongo que tienes una función para actualizar el registro en el servidor
  };

  const paginado = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const estiloSeleccion = [
    {
      when: (row) => row.toggleSelected,
      style: {
        backgroundColor: "#3f101d",
        userSelect: "none",
        color: "white",
        size: "30px",
      },
    },
  ];

  const click_Pendientes = async (row) => {
    setSelectedRow(row);
    // Establecer los datos de la fila seleccionada en los estados del formulario
    setIp(row.ip);
    setHostname(row.hostname);
    setArea(row.area);
    setSolicitante(row.solicitante);
    setResponsable(row.responsable);
    setFecha(row.fecha);
    setLugar(row.lugar);
    setEstado(row.estado);
    setEquipos(row.equipos);
  };

  //Boton Cancelar dentro de MODIFICAR DATOS
  const handleCancel = () => {
    setSelectedRecord(null);
    setEquipos("");
    setIp("");
    setHostname("");
    setArea("");
    setSolicitante("");
    setResponsable("");
    setFecha("");
    setLugar("Seleccione un lugar");
    setEstado("libre");
  };

  //Boton para eliminar un dato en la base de datos y tabla
  const handleDelete = (row) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      axios
        .delete(`http://10.18.11.31:5000/gestorips/${row._id}`)
        .then(() => {
          const updatedRecords = records.filter(
            (record) => record._id !== row._id
          );
          console.log("Registro eliminado");
          setRecords(updatedRecords);
          setSelectedRecord(null);
          fetchRecords(); // Vuelve a cargar los registros después de eliminar
        })
        .catch((error) => {
          console.error("Error al eliminar el registro:", error);
        });
    }
  };

  //Busca los datos en la tabla desde los filtros
  const handleSearch = async () => {
    try {
      const response = await axios.get(MONGO_URI, {
        params: {
          searchText: filterText,
          filterEstado: filterEstado,
        },
      });
      const data = response.data;
      setRecords(data);
      setSearchError(data.length === 0 && filterText !== "");
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  /* 
  Mnera local pero se pierden los datos:
  useEffect(() => {
    // Recuperar segmentos del localStorage al cargar el componente
    const storedSegmentos = localStorage.getItem("segmentos");
    if (storedSegmentos) {
      setSegmentosIngresados(JSON.parse(storedSegmentos));
    }
  }, []); */

  //Boton para cerrar el modal de DNS
  const handleClose = () => {
    setSegmento("");
    setIdInicial("");
    setIdFinal("");
  };

  //Funcion para abrir el modal de DNS
  const openModal = () => {
    setIsModalOpen(true);
  };

  //Boton para cerrar el modal de DNS
  const closeModal = () => {
    setIsModalOpen(false);
  };

  //Boton para cerrar el modal de dns
  const handleVerDnsClick = (dnsData) => {
    setSelectedUbi(dnsData);
    setIsModalOpenUbi(true);
  };

  //Boton para cerrar el modal de caracteristicas
  const handleVerCaracteristicasClick = (caractData) => {
    setSelectedCaract(caractData);
    setIsModalOpenCaract(true);
  };

  //Boton para cerrar el modal de ubicacion
  const handleVerUbicacionClick = (ubiData) => {
    setSelectedUbi(ubiData);
    setIsModalOpenUbi(true);
  };

  const [pending, setPending] = useState(true);

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== "$sortActive"}>
      <div className="ips">
        <div className="navbar">
          <h4>SISTEMA DE SOPORTE TÉCNICO</h4>
        </div>
        <br></br>
        {isReloading ? <p>Recargando la página...</p> : null}
        <div className="row mt-3 ">
          <div className="col-md-2 segment-container">
            <label id="txt_segmento" htmlFor="segmento">
              Segmentos:
            </label>
            <select
              id="select_segmento"
              className="form-control"
              value={selectedSegment}
              onChange={(e) => {
                //setSelectedSegment(e.target.value);
                handleSegmentChange(e);
              }}
            >
              <option value="" disabled>
                Selecciona un segmento
              </option>
              {segmentos.map((segmento, index) => (
                <option key={index} value={segmento.segmento}>
                  {segmento.segmento}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 añadir-rigth">
            <label htmlFor="segmento">Añadir Segmentos:</label>
            <button className="btn btn-primary btn-space" onClick={openModal}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
        <div className="row mt-3 filtrar-equipo-estado">
          <div className="col-md-12">&nbsp;</div>
          <div className="col-md-1">
            <div className="mb-3">
              <label id="txt_filtroEquipos" htmlFor="filtroEquipos">
                Filtrar por equipos:
              </label>
              <select
                id="select_filtroEquipos"
                className="form-control"
                value={filterEquipos}
                onChange={(e) => {
                  setFilterEquipos(e.target.value);
                }} //llenar_tabla
              >
                <option value="Todos">Todos</option>
                <option value="server">Server</option>
                <option value="grabadores">Grabadores</option>
                <option value="pc">PC</option>
                <option value="impresora">Impresora</option>
                <option value="movil">Móvil</option>
                <option value="laptop">Lap-top</option>
                <option value="xbox">Xbox</option>
                <option value="etc">Etc</option>
              </select>
            </div>
          </div>
          <div className="col-md-1">
            <div className="mb-3">
              <label id="txt_filtroEstado" htmlFor="filtroEstado">
                Filtrar por Estado:
              </label>
              <select
                id="select_filtroEstado"
                className="form-control"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Libre">Libre</option>
              </select>
            </div>
          </div>
          <div className="col-md-3 buscar-rigth">
            <div style={{ marginBottom: "20px" }}>
              <label id="lbl_searchText" htmlFor="searchText">
                Buscar:
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="txt_searchText"
                  className="form-control"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSearch}
                  >
                    <FontAwesomeIcon icon={faSearch} /> Buscar
                  </button>
                </div>
              </div>
              {searchError && (
                <p className="text-danger mt-2">
                  No se encontraron resultados.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ips*/}

        <div className="container">
          <div className="tabla-ips">
            <h4 className="gestor-ips">Gestor de IPS</h4>
            <DataTable
              columns={columns}
              data={filteredRecords}
              noHeader
              dense
              responsive
              customStyles={customStyles}
              paginationComponentOptions={paginado}
              progressComponent={<loader></loader>}
              noDataComponent="Sin registro de IPS"
              onRowClicked={click_Pendientes}
              conditionalRowStyles={estiloSeleccion}
              highlightOnHover
              pagination // Habilitar paginación
              paginationPerPage={3} // Número de elementos por página
              paginationRowsPerPageOptions={[6, 9, 12]}
              highlightOnSelect={true}
              selectableRowsHighlight
              selected={selectedRow ? [selectedRow._id] : []}
            />
          </div>
        </div>

        {/* servidores */}
        <div className="container">
          <div className="d-flex">
            <div className="tabla-servidores">
              <h4 className="gestor-servidores">Gestor de los Servidores</h4>
              <DataTable
                columns={columns2}
                data={filteredRecords.length > 0 ? filteredRecords : records}
                noHeader
                dense
                responsive
                customStyles={customStyles}
                pagination // Habilitar paginación
                paginationPerPage={3} // Número de elementos por página
                paginationRowsPerPageOptions={[6, 9, 12]} // Opciones de cantidad de elementos por página
              />
              {/* Modal para mostrar detalles de ubicación */}
              {selectedUbi && (
                <Modal
                  show={isModalOpenUbi}
                  onHide={() => setIsModalOpenUbi(false)}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Ubicación</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedUbi ? (
                      <div>
                        <p>City: {selectedUbi.ubicacion.city || "N/A"}</p>
                        <p>Region: {selectedUbi.ubicacion.region || "N/A"}</p>
                        <p>Country: {selectedUbi.ubicacion.country || "N/A"}</p>
                        <p>Location: {selectedUbi.ubicacion.loc || "N/A"}</p>
                      </div>
                    ) : (
                      <p>No se encontraron datos de ubicación.</p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setIsModalOpenUbi(false)}
                    >
                      Cerrar
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
              {/* Modal para mostrar caracteristicas del servidor */}
              {selectedCaract && (
                <Modal
                  show={isModalOpenCaract}
                  onHide={() => setIsModalOpenCaract(false)}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Caracteristicas del servidor</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedCaract ? (
                      <div>
                        {selectedCaract.caracteristicas &&
                        selectedCaract.caracteristicas ? (
                          <div>
                            <p>
                              Sistema: {selectedCaract.caracteristicas.System}
                            </p>
                            <p>
                              Hostname:{" "}
                              {selectedCaract.caracteristicas["Node Name"]}
                            </p>
                            <p>
                              Versión del sistema operativo:{" "}
                              {selectedCaract.caracteristicas.Release}
                            </p>
                            <p>
                              Version: {selectedCaract.caracteristicas.Version}
                            </p>
                            <p>
                              Arquitectura del servidor:{" "}
                              {selectedCaract.caracteristicas.Machine}
                            </p>
                            <p>
                              Procesador:{" "}
                              {selectedCaract.caracteristicas.Processor}
                            </p>
                            <p>
                              Available RAM:{" "}
                              {Math.round(
                                selectedCaract.caracteristicas.RAM[
                                  "Available RAM"
                                ] / 1073741824
                              )}{" "}
                              GB
                            </p>
                            <p>
                              Total RAM:{" "}
                              {Math.round(
                                selectedCaract.caracteristicas.RAM[
                                  "Total RAM"
                                ] / 1073741824
                              )}{" "}
                              GB
                            </p>
                            <p>
                              Used RAM:{" "}
                              {Math.round(
                                selectedCaract.caracteristicas.RAM["Used RAM"] /
                                  1073741824
                              )}{" "}
                              GB
                            </p>
                          </div>
                        ) : (
                          <p>La información del servidor no está completa.</p>
                        )}
                      </div>
                    ) : (
                      <p>No se encontraron datos de ubicación.</p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setIsModalOpenCaract(false)}
                    >
                      Cerrar
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
            </div>
          </div>
        </div>
        <div class="container-wrapper">
          <div responsive className="custom-container">
            <h3 className="container-title">Modificar Datos</h3>
            {selectedRecord ? (
              <div className="row">
                <div className="col-md-6">
                  <div className="styleip mx-auto">
                    <label id="lbl_ip" htmlFor="ip">
                      Ip:
                    </label>
                    <input
                      type="text"
                      id="txt_ip"
                      className="form-control"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylehost mx-auto">
                    <label id="lbl_hostname" htmlFor="hostname">
                      Hostname:
                    </label>
                    <input
                      type="text"
                      id="txt_hostname"
                      className="form-control"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylearea mx-auto">
                    <label id="lbl_area" htmlFor="area">
                      Área:
                    </label>
                    <select
                      id="txt_area"
                      className="form-control"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    >
                      <option value="">Selecciona un área</option>
                      {areas.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylesolicitante mx-auto">
                    <label id="lbl_solicitante" htmlFor="solicitante">
                      Solicitante:
                    </label>
                    <input
                      type="text"
                      id="txt_solicitante"
                      className="form-control"
                      value={solicitante}
                      onChange={(e) => setSolicitante(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="styleresponsable mx-auto">
                    <label id="lbl_responsable" htmlFor="responsable">
                      Responsable:
                    </label>
                    <input
                      type="text"
                      id="txt_responsable"
                      className="form-control"
                      value={responsable}
                      onChange={(e) => setResponsable(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylefecha mx-auto">
                    <Form.Group>
                      <Form.Label>Fecha Entrada</Form.Label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylelugar mx-auto">
                    <label id="lbl_lugar" htmlFor="lugar">
                      Lugar:
                    </label>
                    <select
                      id="txt_lugar"
                      className="form-control"
                      value={lugar}
                      onChange={(e) => setLugar(e.target.value)}
                    >
                      <option value="">Selecciona un lugar</option>
                      <option value="C5i-Pachuca">C5i-Pachuca</option>
                      <option value="C5i-Tulancingo">C5i-Tulancingo</option>
                      <option value="C5i-">C5i-Tula</option>
                      <option value="C5i-Huejutla">C5i-Tulancingo</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="styleestado mx-auto">
                    <label id="lbl_estado" htmlFor="estado">
                      Estado:
                    </label>
                    <select
                      id="txt_estado"
                      className="form-control"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    >
                      <option value="Ocupado">Ocupado</option>
                      <option value="Libre">Libre</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="styleequipos mx-auto">
                    <Form.Group controlId="SetEquipos">
                      <Form.Label>Equipos</Form.Label>
                      <select
                        id="SetEquipos"
                        className="form-control"
                        value={equipos}
                        onChange={(e) => setEquipos(e.target.value)}
                      >
                        <option value="">Selecciona un equipo</option>
                        <option value="server">Server</option>
                        <option value="grabadores">Grabadores</option>
                        <option value="pc">PC</option>
                        <option value="impresora">Impresora</option>
                        <option value="movil">Móvil</option>
                        <option value="laptop">Lap-top</option>
                        <option value="xbox">Xbox</option>
                        <option value="etc">Etc</option>
                      </select>
                    </Form.Group>
                  </div>
                </div>
                <div className="custom-button-container">
                  {loading && <div>Cargando...</div>}
                  <button
                    className="btn btn-primary mx-3 save-button"
                    type="button"
                    onClick={handleAddRecord}
                  >
                    Guardar Cambios
                  </button>
                  <button
                    className="btn btn-primary mx-3 cancel-button"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6">
                  <div className="styleip mx-auto">
                    <label id="lbl_ip" htmlFor="ip">
                      Ip:
                    </label>
                    <input
                      type="text"
                      id="txt_ip"
                      className="form-control"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylehost mx-auto">
                    <label id="lbl_hostname" htmlFor="hostname">
                      Hostname:
                    </label>
                    <input
                      type="text"
                      id="txt_hostname"
                      className="form-control"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylearea mx-auto">
                    <label id="lbl_area" htmlFor="area">
                      Área:
                    </label>
                    <select
                      id="txt_area"
                      className="form-control"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    >
                      <option value="">Selecciona un área</option>
                      {areas.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylesolicitante mx-auto">
                    <label id="lbl_solcitante" htmlFor="solicitante">
                      Solicitante:
                    </label>
                    <input
                      type="text"
                      id="txt_solicitante"
                      className="form-control"
                      value={solicitante}
                      onChange={(e) => setSolicitante(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="styleresponsable mx-auto">
                    <label id="lbl_responsable" htmlFor="responsable">
                      Responsable:
                    </label>
                    <input
                      type="text"
                      id="txt_responsable"
                      className="form-control"
                      value={responsable}
                      onChange={(e) => setResponsable(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylefecha mx-auto">
                    <Form.Group>
                      <Form.Label>Fecha Entrada</Form.Label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stylelugar mx-auto">
                    <label id="lbl_lugar" htmlFor="lugar">
                      Lugar:
                    </label>
                    <select
                      id="txt_lugar"
                      className="form-control"
                      value={lugar}
                      onChange={(e) => setLugar(e.target.value)}
                    >
                      <option value="">Selecciona un lugar</option>
                      <option value="C5i-Pachuca">C5i-Pachuca</option>
                      <option value="C5i-Tulancingo">C5i-Tulancingo</option>
                      <option value="C5i-">C5i-Tula</option>
                      <option value="C5i-Huejutla">C5i-Tulancingo</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="styleestado mx-auto">
                    <label id="lbl_estado" htmlFor="estado">
                      Estado:
                    </label>
                    <select
                      id="txt_estado"
                      className="form-control"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    >
                      <option value="Ocupado">Ocupado</option>
                      <option value="Libre">Libre</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="styleequipos mx-auto">
                    <Form.Group controlId="setEquipos">
                      <Form.Label>Equipos</Form.Label>
                      <select
                        id="setEquipos"
                        className="form-control"
                        value={equipos}
                        onChange={(e) => setEquipos(e.target.value)}
                      >
                        <option value="">Selecciona un equipo</option>
                        <option value="server">Server</option>
                        <option value="grabadores">Grabadores</option>
                        <option value="pc">PC</option>
                        <option value="impresora">Impresora</option>
                        <option value="movil">Móvil</option>
                        <option value="laptop">Lap-top</option>
                        <option value="xbox">Xbox</option>
                        <option value="etc">Etc</option>
                      </select>
                    </Form.Group>
                  </div>
                </div>
                <div className="custom-button-container">
                  <button
                    className="btn btn-primary mx-3 save-button"
                    type="button"
                    onClick={handleAddRecord}
                  >
                    Agregar Registro
                  </button>
                  <button
                    className="btn btn-primary mx-3 cancel-button"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/*SEGMENTOOOOS PARA SLECT*/}
        <Modal show={isModalOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Añadir Segmento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="segmento">
                    <Form.Label>Segmento</Form.Label>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="XX.XX.XX"
                        className="form-control"
                        value={segmento}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          // Utiliza una expresión regular para permitir solo números y puntos
                          const sanitizedValue = enteredValue.replace(
                            /[^0-9.]/g,
                            ""
                          );
                          // Limita la cadena a tener solo 2 puntos
                          const pointsCount =
                            sanitizedValue.split(".").length - 1;
                          if (pointsCount <= 2) {
                            setSegmento(sanitizedValue);
                          }
                        }}
                      />
                    </div>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="idInicial">
                    <Form.Label>ID Inicial</Form.Label>
                    <input
                      type="text"
                      placeholder="ID Inicial"
                      className="form-control"
                      value={idInicial}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        if (
                          /^\d*$/.test(enteredValue) &&
                          enteredValue >= 0 &&
                          enteredValue <= 254
                        ) {
                          setIdInicial(enteredValue);
                        } else if (
                          enteredValue === "" ||
                          enteredValue === "0"
                        ) {
                          setIdInicial(enteredValue);
                        }
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="idFinal">
                    <Form.Label>ID Final</Form.Label>
                    <input
                      type="text"
                      placeholder="ID Final"
                      className="form-control"
                      value={idFinal}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        if (
                          /^\d*$/.test(enteredValue) &&
                          enteredValue >= 0 &&
                          enteredValue <= 254
                        ) {
                          setIdFinal(enteredValue);
                        } else if (
                          enteredValue === "" ||
                          enteredValue === "0"
                        ) {
                          setIdFinal(enteredValue);
                        }
                      }}
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Limpiar
            </Button>
            <Button variant="primary" onClick={handleAddSegment}>
              Agregar Segmento
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </StyleSheetManager>
  );
}
export default IP;
