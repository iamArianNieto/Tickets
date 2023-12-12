import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tab, Tabs, Navbar, Nav } from "react-bootstrap";
import "../CSS/Ips.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CaracteristicasIcon from "../assets/caracteristicas.png";
import UbicacionIcon from "../assets/ubicacion.png";
import styled, { StyleSheetManager } from "styled-components";
import DatosEquipo from "./DatosEquipo.js";
import DatosSistema from "./DatosSistema.js";
import DatosSegmentos from "./DatosSegmentos.js";
import { Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import { Await } from "react-router-dom";
/* import envs from "react-dotenv"; */
import Loader from "./loader";
import { AiOutlineClear } from "react-icons/ai";
import { HiSearchCircle } from "react-icons/hi";
import { MdOutlineSearch } from "react-icons/md";
import envs from "react-dotenv";
import Swal from "sweetalert2";

import {
  faEdit,
  faTrash,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { data } from "jquery";

const MONGO_URI = envs.MONGO_URI;
const MONGO_URI_SEGMENTOSBD = envs.MONGO_URI_SEGMENTOSBD;

const StyledCell = styled.div`
  font-size: 13px;
  min-width: 100px;
`;
//estilo de la tabla
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
      fontSize: "12px",
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
  const [asignada, setAsignada] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [fecha_creacion, setFechaCreacion] = useState("");
  const [dependencia, setDependencia] = useState("Seleccione Dependencia");
  const [status, setStatus] = useState("Libre");
  const [equipos, setEquipos] = useState("Seleccione un equipo");
  const [ip_publica, setIp_publica] = useState("");
  const [inventario, setInventario] = useState("");
  const [mac, setMac] = useState("");
  const [serie, setSerie] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [dns, setDns] = useState("");
  const [showExample, setShowExample] = useState(true);
  const [puerto, setPuerto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [datosSistema, setDatosSistema] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [records, setRecords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterEquipos, setFilterEquipos] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
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
  const [error, setError] = useState(null);

  const [segmentos, setSegmentos] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("");
  const [selectedSegmento1, setSelectedSegmento1] = useState("");

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [AuxFilteredRecords, setAuxFilteredRecords] = useState([]);

  const [filteredRecordsServidores, setFilteredRecordsServidores] = useState(
    []
  );
  const [AuxFilteredRecordsServidores, setAuxFilteredRecordsServidores] =
    useState([]);
  const segmentosFiltrados = segmentos.filter(
    (segmento) => segmento.segmento !== null
  );
  const [newSegmento, setNewSegmento] = useState(null);
  const [newSegment, setSegment] = useState(null);

  const [isReloading, setIsReloading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [selectedRow, setSelectedRow] = useState(-1);

  const [tab, setTab] = useState("");

  const [selectedSegmentS, setSelectedSegmentS] = useState("");
  const [idInicialS, setIdInicialS] = useState("");
  const [idFinalS, setIdFinalS] = useState("");
  const [fecha_creacionS, setFechaCreacionS] = useState("");

  // Agregar un estado para controlar la visibilidad del mensaje
  const [isSegmentSelected, setIsSegmentSelected] = useState(false);
  const [selectedSegmentMessage, setSelectedSegmentMessage] = useState("");
  const [forceRender, setForceRender] = useState(false);

  const [originalRecords, setOriginalRecords] = useState([]);

  const formatoIpRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const [selectedSegmento, setSelectedSegmento] = useState(null);

  useEffect(() => {
    setTab("IPS");
  }, []);

  const columns = [
    {
      name: "EQUIPO",
      selector: (row) => row.equipos,
      sortable: true,
    },
    {
      name: "IP",
      selector: (row) => row.ip,
      sortable: true,
    },
    {
      name: "HOSTNAME",
      selector: (row) => row.hostname,
      sortable: true,
    },
    {
      name: "IP PÚBLICA",
      selector: (row) => row.ip_publica,
      sortable: true,
    },
    {
      name: "ÁREA",
      selector: (row) => row.area,
      sortable: true,
    },
    {
      name: "ASIGNADA",
      selector: (row) => row.asignada,
      sortable: true,
    },
    {
      name: "FECHA ASIGNACIÓN",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "HORA ASIGNACIÓN",
      selector: (row) => row.hora,
      sortable: true,
    },
    {
      name: "DEPENDENCIA",
      selector: (row) => row.dependencia,
      sortable: true,
    },
    {
      name: "ESTATUS",
      selector: (row) =>row.status,
      sortable: true,
    },
    {
      name: "LIBERAR",
      cell: (row) => (
        <div>
          {/*<button
            className="btn btn-warning btn-sm mr-2 mx-2"
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button> */}
          <button
            className="btn btn-imprimir btn-sm mr-2 mx-2"
            onClick={() => handleLimpiarIp(row)}
          >
            <AiOutlineClear />
          </button>
        </div>
      ),
    },
  ];
  //crea la segunda tabla de la base de datos
  const columns2 = [
    {
      name: "TIPO DE EQUIPOS",
      selector: "equipos",
      sortable: true,
      cell: (row) => <StyledCell>{row.equipos}</StyledCell>,
    },
    {
      name: "IP",
      selector: "ip",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip}</StyledCell>,
    },
    {
      name: "IP PUBLICA",
      selector: "ip_publica",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip_publica}</StyledCell>,
    },
    {
      name: "IP DE LA MAQUINA",
      selector: "ip_cliente",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip_cliente}</StyledCell>,
    },
    {
      name: "PUERTO",
      selector: "puerto",
      sortable: true,
      cell: (row) => <StyledCell>{row.puerto}</StyledCell>,
    },
    {
      name: "DNS",
      cell: (row) => (
        <button
          onClick={() => handleVerDnsClick(row)}
          className="btn btn-link text-primary"
        ></button>
      ),
    },
    {
      name: "SISTEMAS",
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
      name: "UBICACION DEL SERVIDOR",
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

  // Carga los registros iniciales cuando se monta el componente
  useEffect(() => {
    fetchRecords();
  }, []);

  //Es el que trae information desde la base de datos par verla en la tabl y tabla-modificar datos
  const fetchRecords = async () => {
    try {
      const response = await axios.get(MONGO_URI); //obtiene los datos desde la base de datos
      const data = response.data;
      // Ordena los registros por alguna propiedad, por ejemplo, "_id"
      data.sort((a, b) => (a._id > b._id ? 1 : -1));
      setRecords(data);
      setFilteredRecords(data); // Agregar esta línea para inicializar filteredRecords
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    filtrado_servidores();
  }, []);

  const handleAddSegment = async () => {
    if (segmento && idInicial && idFinal) {
      const formattedSegment = `${segmento} (${idInicial} - ${idFinal})`;
      console.log("formattedSegment:", formattedSegment);
      // Obtén la fecha y hora actual
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      const formattedTime = `${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const newSegmento = {
        segmento: formattedSegment,
        segmentoin: segmento || "", //borrar en caso de romperlo
        ip_inicial: idInicial || 0,
        ip_final: idFinal || 0,
      };

      try {
        // Obtener los segmentos existentes desde la base de datos
        const existingSegmentsResponse = await axios.get(MONGO_URI_SEGMENTOSBD);
        const existingSegments = existingSegmentsResponse.data;

        // Divide el nuevo segmento en dos partes: antes y después de los paréntesis
        const [newSegmentPrefix, _] = formattedSegment.split(" (");

        // Verificar si el segmento ya existe en la lista de segmentos existentes
        let isDuplicate = false;

        for (const segment of existingSegments) {
          const [existingSegmentPrefix, _] = segment.segmento.split(" (");
          if (existingSegmentPrefix === newSegmentPrefix) {
            isDuplicate = true;
            break; // Si se encuentra una coincidencia, detén el bucle
          }
        }
        console.log("Nuevo segmento a agregar:", newSegmento);
        console.log("isDuplicate:", isDuplicate);
        if (isDuplicate) {
          console.log("El segmento es un duplicado. No se agregará.");
          // Muestra un mensaje de error si es un segmento duplicado
          window.alert(
            "El segmento ingresado ya existe. Por favor, ingrese un segmento único."
          );
          return; // Sal del manejador de eventos si es un duplicado
        } else {
          // Obtener el rango del segmento utilizando expresiones regulares
          const rangeMatch = formattedSegment.match(/\((\d+) - (\d+)\)/);
          if (rangeMatch) {
            const startRange = parseInt(rangeMatch[1]);
            const endRange = parseInt(rangeMatch[2]);
            console.log("startRange:", startRange);
            console.log("endRange:", endRange);

            if (isNaN(startRange) || isNaN(endRange)) {
              console.error("Error al obtener los rangos.");
              return;
            }

            // Enviar ambas solicitudes en paralelo utilizando Promise.all
            const [response1, response2] = await Promise.all([
              axios.get(MONGO_URI, newSegmento), //Tenia get entonces por eso hacia un documento más ..
              axios.post(MONGO_URI_SEGMENTOSBD, newSegmento),
            ]);

            if (response1.data && response2.data) {
              console.log(
                "Respuesta del servidor (agregar segmento):",
                response1.data
              );
              console.log(
                "Respuesta del servidor (agregar segmento en segunda colección):",
                response2.data
              );

              const ipSegments = segmento.split(".");
              const idInicio = parseInt(idInicial);
              const idFin = parseInt(idFinal);
              const segmentoBase = `${ipSegments[0]}.${ipSegments[1]}.${ipSegments[2]}.`;

              const segmentoData = [];

              for (let id = idInicio; id <= idFin; id++) {
                const ipCompleta = `${segmentoBase}${id}`;
                segmentoData.push({
                  equipos: equipos,
                  ip: ipCompleta,
                  ip_publica: ip_publica,
                  datosSistema: datosSistema,
                  mac: mac,
                  modelo: modelo,
                  serie: serie,
                  color: color,
                  inventario: inventario,
                  hostname: hostname,
                  area: area,
                  solicitante: solicitante,
                  asignada: asignada,
                  fecha: fecha,
                  hora: hora,
                  dependencia: dependencia,
                  status: status,
                });
              }

              segmentoData.forEach(async (data) => {
                try {
                  const response = await axios.post(MONGO_URI, data);
                  console.log(response.data.message);
                } catch (error) {
                  console.error("Error al agregar el registro:", error);
                }
              });

              // Generar direcciones IP y filtrar registros después de agregar el segmento
              const segmentParts = formattedSegment.split(" ");
              const baseSegment = segmentParts[0];
              const startRange = parseInt(rangeMatch[1]);
              const endRange = parseInt(rangeMatch[2]);

              const generatedIPs = [];

              for (let i = startRange; i <= endRange; i++) {
                const ip = `${baseSegment}.${i}`;
                generatedIPs.push(ip);
                console.log(
                  "************IP********** " +
                    ip +
                    "-----------------i-------------------- " +
                    i
                );
              }

              console.log(
                "Direcciones IP generadas para el nuevo segmento:",
                segmentoData.map((data) => data.ip)
              );

              setFilteredRecords(segmentoData);

              // Después de agregar el segmento con éxito
              const updatedSegmentos = [newSegmento, ...segmentos];
              setSegmentos(updatedSegmentos);

              // Seleccionar automáticamente el nuevo segmento en el select
              setSelectedSegment(newSegmento.segmento);

              /* // Llamar a la función handleSegmentChange después de seleccionar automáticamente el nuevo segmento
              const handleSegmentChange = (event) => {
                const selectedSegment = event.target.value;
                setSelectedSegment(selectedSegment);

                // Encuentra el segmento seleccionado en el array de segmentos filtrados
                const selectedSegmentData = segmentosFiltrados.find(
                  (segmento) => segmento.segmento === selectedSegment
                );

                if (selectedSegmentData) {
                  console.log("ipInicial:", selectedSegmentData.ip_inicial);
                  console.log("ipFinal:", selectedSegmentData.ip_final);

                  setIdInicial(selectedSegmentData.ip_inicial);
                  setIdFinal(selectedSegmentData.ip_final);
                  setFechaCreacion(selectedSegmentData.fecha_creacion);
                }
              }; */

              //CODIGO INECESARIO PERO TALVEZ FUNCOIONE PARA ALGO

              // Filtrar los registros para obtener solo aquellos que pertenecen al nuevo segmento
              /*const newSegmentBase = `${ipSegments[0]}.${ipSegments[1]}.${ipSegments[2]}`;
               const filteredRecords = records.filter((record) => {
                if (record.ip) {
                  const ipSegments = record.ip.split(".");
                  const segmentBase = `${ipSegments[0]}.${ipSegments[1]}.${ipSegments[2]}`;
                  return (
                    segmentBase === newSegmentBase || ipSegments.includes(null)
                  );
                }
                return false;
              }); 
              console.log(
                "Registros filtrados después de agregar el segmento:",
                filteredRecords
              );*/
              console.log("filteredRecords------:", filteredRecords);

              // Actualizar el estado con los registros filtrados
              setFilteredRecords(filteredRecords);

              console.log("Prueba:", segmentoData);

              // Limpia los campos después de agregar el segmento
              setSegmento("");
              setIdInicial("");
              setIdFinal("");
              setIsModalOpen(false);

              console.log("Segmentos antes de recargar:", segmentos);

              var n = document.getElementById("select_segmento");
              var input_vlor = n.value;

              await handleSegmentChangeAdd(input_vlor);
            } else {
              console.error("Error al obtener los rangos.");
              return;
            }
          } else {
            console.error("Formato de rango incorrecto en el segmento.");
            return;
          }
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
    } else {
      console.error("Error: segmento, IdInicial, Idfinal es null.");
    }
  };

/*   const [filtro, setFiltro] = useState({
    segmento: "",
    ip_inicial: "",
    ip_final: "",
    fecha_creacion: "",
  }); */

/*useEffect(() => {
    // Realiza una solicitud para obtener los segmentos desde tu backend
    axios
      .get(MONGO_URI_SEGMENTOSBD)
      .then((response) => {
        // Cuando se obtienen los segmentos con éxito, actualiza el estado
        const newSegment = response.data.find(
          (segment) => segment.segmento === newSegmento.segmento
        );
        const updatedSegmentos = newSegment
          ? [newSegment, ...response.data]
          : response.data;
        setSegmentos(updatedSegmentos);
        console.log("segmentos:", updatedSegmentos); // Agrega este console.log
      })
      .catch((error) => {
        console.error("Error al obtener los segmentos:", error);
      });
  }, [newSegmento]);*/ 

useEffect(() => {
    // Realiza una solicitud para obtener los segmentos desde tu backend
    axios
      .get(MONGO_URI_SEGMENTOSBD)
      .then((response) => {
        // Cuando se obtienen los segmentos con éxito, actualiza el estado
        if (newSegmento) {
          const existingSegment = response.data.find(
            (segment) => segment.segmento === newSegmento.segmento
          );
          const updatedSegmentos = existingSegment
            ? [existingSegment, ...response.data]
            : response.data;
          setSegmentos(updatedSegmentos);
          console.log("segmentos:", updatedSegmentos); // Agrega este console.log
        } else {
          setSegmentos(response.data);
          console.log("segmentos:", response.data); // Agrega este console.log
        }
      })
      .catch((error) => {
        console.error("Error al obtener los segmentos:", error);
      });
  }, [newSegmento]);

/*   // Función para manejar cambios en los campos de filtro
  const handleFilterChange = (field, value) => {
    setFiltro((prevFiltro) => ({ ...prevFiltro, [field]: value }));
  };
 */
  useEffect(() => {
    // Si el estado de recarga cambia a true, después de un tiempo (puedes ajustar el tiempo), cambia el estado nuevamente
    if (isReloading) {
      setTimeout(() => {
        setIsReloading(false);
      }, 5000); // Cambia 5000 a la cantidad de tiempo en milisegundos que deseas mostrar el mensaje de recarga
    }
  }, [isReloading]);

  // Maneja el cambio de segmento seleccionado
  const handleSegmentChange = (e) => {
    console.log("handle segment change called");
    setFilteredRecords([]);
    const selectedSegment = e.target.value;
    setSelectedSegment(selectedSegment);
    console.log("Selected segment: ", selectedSegment);

    const selectedSegmentData = segmentosFiltrados.find(
      (segmento) => segmento.segmento === selectedSegment
    );

    if (selectedSegmentData) {
      // Asegúrate de que los valores se asignen como cadenas (strings)
      setIdInicial(String(selectedSegmentData.ip_inicial));
      setIdFinal(String(selectedSegmentData.ip_final));
      // Formatea la fecha
      const fechaCreacion = new Date(selectedSegmentData.fecha_creacion);
      const formattedFechaCreacion = `${fechaCreacion.getFullYear()}-${(
        fechaCreacion.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${fechaCreacion
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      // Asigna la fecha formateada al estado
      setFechaCreacion(formattedFechaCreacion);
    }

    if (!selectedSegment) {
      setIsSegmentSelected(false);
      setSelectedSegmentMessage("No se ha seleccionado un segmento");
      setFilteredRecords([]); // Limpiar los registros filtrados si no hay segmento seleccionado
    } else {
      setIsSegmentSelected(true);
      setSelectedSegmentMessage(""); // Limpiar el mensaje si hay un segmento seleccionado
    }

    console.log(selectedSegment); // Agrega este console.log
    console.log("Antes de la solicitud al servidor");

    // Realiza una solicitud para obtener los datos relacionados de la segunda colección
    axios
      .get(`${MONGO_URI}?segmento=${selectedSegment}`)
      .then(async (response) => {
        console.log("Después de obtener la respuesta del servidor");
        const relatedData = response.data;
        console.log("Datos relacionados de la segunda colección:", relatedData);
        const ipsInRelatedData = relatedData.map((item) => item.ip);
        console.log(
          "Direcciones IP en los datos relacionados:",
          ipsInRelatedData
        );
        // Filtra las IPs relacionadas que coinciden con el segmento seleccionado
        const formattedSelectedSegment = selectedSegment.split(" ")[0];
        const filteredIPs = ipsInRelatedData.filter(
          (ip) => ip !== null && ip.startsWith(formattedSelectedSegment)
        );

        console.log("IPs filtradas:", filteredIPs);

        // Filtra los registros de la primera colección que coinciden con las IPs filtradas
        const filteredRecords = relatedData.filter((record) => {
          return record.ip !== null && filteredIPs.includes(record.ip);
        });
        console.log("Registros filtrados:", filteredRecords);

        // Actualiza el estado con los registros filtrados
        setFilteredRecords(filteredRecords);
        setAuxFilteredRecords(records);
      })
      .catch((error) => {
        console.error(
          "Error al obtener los datos relacionados de la segunda colección:",
          error
        );
      });
  };

  function removeLastOctet(ipAddress) {
    // Use regular expression to remove the last octet
    return ipAddress.replace(/\.\d+$/, "");
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleDatosSegmentos = async (row) => {
    fetch(
      "http://10.18.11.31:5000/segmentosbd?segmentoin=" +
        removeLastOctet(row.ip)
    )
      .then((response) => response.json())
      .then((result) => {
        result.forEach((item) => {
          if (tab === "IPS") {
            setSelectedSegment(item.segmento);
            setIdInicial(item.ip_inicial);
            setIdFinal(item.ip_final);
            setFechaCreacion(item.fecha_creacion);
          } else {
            setSelectedSegmentS(item.segmento);
            setIdInicialS(item.ip_inicial);
            setIdFinalS(item.ip_final);
            setFechaCreacionS(item.fecha_creacion);
          }
        });
      })
      .catch((error) => console.log("error", error));
  };

  const filtrado_servidores = async () => {
    try {
      const response = await axios.get(MONGO_URI, {
        params: { equipos: "Servidor" },
      });

      const filteredData = response.data;
      setAuxFilteredRecordsServidores(filteredData);
      setFilteredRecordsServidores(filteredData);
    } catch (error) {
      console.error("Error al obtener los registros de servidores:", error);
    }
  };

  const handleSegmentChangeAdd = (valor) => {
    setFilteredRecords([]);
    const selectedSegment = valor;
    setSelectedSegment(selectedSegment);
    console.log("Selected segment: ", selectedSegment);

    const selectedSegmentData = segmentosFiltrados.find(
      (segmento) => segmento.segmento === selectedSegment
    );

    if (selectedSegmentData) {
      setIdInicial(selectedSegmentData.ip_inicial);
      setIdFinal(selectedSegmentData.ip_final);
      setFechaCreacion(selectedSegmentData.fecha_creacion);
    }

    if (!selectedSegment) {
      setIsSegmentSelected(false);
      setSelectedSegmentMessage("No se ha seleccionado un segmento");
      setFilteredRecords([]); // Limpiar los registros filtrados si no hay segmento seleccionado
    } else {
      setIsSegmentSelected(true);
      setSelectedSegmentMessage(""); // Limpiar el mensaje si hay un segmento seleccionado
    }

    // Realiza una solicitud para obtener los datos relacionados de la segunda colección
    axios
      .get(`http://10.18.11.31:5000/gestorips?segmento=${selectedSegment}`)
      .then(async (response) => {
        console.log("Después de obtener la respuesta del servidor");
        const relatedData = response.data;
        console.log("Datos relacionados de la segunda colección:", relatedData);
        const ipsInRelatedData = relatedData.map((item) => item.ip);
        console.log(
          "Direcciones IP en los datos relacionados:",
          ipsInRelatedData
        );
        // Filtra las IPs relacionadas que coinciden con el segmento seleccionado
        const formattedSelectedSegment = selectedSegment.split(" ")[0];
        const filteredIPs = ipsInRelatedData.filter(
          (ip) => ip !== null && ip.startsWith(formattedSelectedSegment)
        );

        console.log("IPs filtradas:", filteredIPs);

        // Filtra los registros de la primera colección que coinciden con las IPs filtradas
        const filteredRecords = relatedData.filter((record) => {
          return record.ip !== null && filteredIPs.includes(record.ip);
        });
        console.log("Registros filtrados:", filteredRecords);

        // Actualiza el estado con los registros filtrados
        setFilteredRecords(filteredRecords);
        setAuxFilteredRecords(filteredRecords);
      })
      .catch((error) => {
        console.error(
          "Error al obtener los datos relacionados de la segunda colección:",
          error
        );
      });
  };

  useEffect(() => {
    setIsSegmentSelected(false); // Agrega esta línea
    // Realiza una solicitud para obtener los segmentos desde tu backend
    axios
      .get(MONGO_URI_SEGMENTOSBD) //AQUI PERMITE VER LOS SEGMENTOS QUE AGREGO EN EL SELECT
      .then((response) => {
        // Cuando se obtienen los segmentos con éxito, actualiza el estado
        setSegmentos(response.data);
        console.log("segmentos:", response.data); // Agrega este console.log
      })
      .catch((error) => {
        console.error("Error al obtener los segmentos:", error);
      });
  }, []);

  //añade o actualiza los campos a la tabla desde MODIFICAR DATOS, si se borran aparecen nulos... no lo hagas xd
  const handleAddRecord = () => {
    if (selectedRecord) {
      const updateRecord = {
        equipos: equipos,
        ip: ip,
        hostname: hostname,
        area: area,
        solicitante: solicitante,
        asignada: asignada,
        fecha: fecha,
        hora: hora,
        dependencia: dependencia,
        status: status,
        ip_publica: ip_publica,
        mac: mac,
        serie: serie,
        modelo: modelo,
        color: color,
        puerto: puerto,
        dns: dns,
        descripcion: descripcion,
        caracteristicas: caracteristicas,
        ubicacion: ubicacion,
        inventario: inventario,
        datosSistema: datosSistema,
      };
      // Actualiza el registro seleccionado
      actualizarRegistro({ ...updateRecord, _id: selectedRecord._id });
      // Limpia los campos después de agregar o actualizar desde MODIFCAR DATOS
      setEquipos("Selecciona un equipo");
      setIp("");
      setIp_publica("");
      setHostname("");
      setArea("Selecciona un área");
      setSolicitante("");
      setAsignada("");
      setFecha("");
      setHora("");
      setFechaCreacion("");
      setDependencia("Selecciona Dependencia");
      setStatus("Ocupado");
      setPuerto("");
      setDns("");
      setDescripcion("");
      setCaracteristicas("");
      setUbicacion("");
      setInventario("");
      setMac("");
      setSerie("");
      setModelo("");
      setColor("");
      setDatosSistema("");
      setSelectedRecord(null);
      setIsModalOpen(false);
      setFilteredRecords(filteredRecords); //ANTES TENIA fetchRecords();
      setAuxFilteredRecordsServidores(records);
    } else {
      console.error("No hay ningún registro seleccionado para actualizar.");
    }
  };

  //put actualiza los registro desde el MODIFICAR DATOS
  const actualizarRegistro = async (registroActualizado) => {
    try {
      setLoading(true);
      setError(null);

      // Realiza la solicitud al servidor para actualizar el registro
      const response = await axios.put(
        `${envs.MONGO_URI}/${registroActualizado._id}`,
        registroActualizado
      );

      // Después de la solicitud PUT exitosa, actualiza la lista de registros y los registros filtrados
      const updatedRecords = filteredRecords.map((record) =>
        record._id === registroActualizado._id ? registroActualizado : record
      );
      setRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setAuxFilteredRecords(updatedRecords);

      filtrado_servidores(records);
      setLoading(false);
      handleCancel();

      // Añade la notificación SweetAlert
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registro actualizado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      setError(
        "Error al actualizar el registro. Por favor, inténtalo de nuevo."
      );
      setLoading(false);
    }
  };

  const updateRecord = async (row) => {
    try {
      setLoading(true);
      setError(null);

      // Realiza la solicitud al servidor para actualizar el registro
      await axios.put(`${envs.MONGO_URI}/${row._id}`, row);

      // Después de la solicitud PUT exitosa, actualiza la lista de registros y los registros filtrados
      const updatedRecords = filteredRecords.map((record) =>
        record._id === row._id ? row : record
      );
      setRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setAuxFilteredRecords(updatedRecords);

      setLoading(false);
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      setError(
        "Error al actualizar el registro. Por favor, inténtalo de nuevo."
      );
      setLoading(false);
    }
  };

  const paginado = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
    paginationComponentOptions: {
      className: "paginado_style",
    },
  };

  const estiloSeleccion = [
    {
      when: (row) => row.selectedRow,
      style: {
        backgroundColor: "#3f101d",
        userSelect: "none",
        color: "white",
      },
    },
  ];

  //Boton para Editar los registros en MODIFICAR DATOS
  const handleEdit = (row, index) => {
    setSelectedRow(index);
    setSelectedRecord(row);

    const today = new Date();

    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    const formattedTime = `${today
      .getHours()
      .toString()
      .padStart(2, "0")}:${today.getMinutes().toString().padStart(2, "0")}`;

    setFecha(formattedDate);
    setHora(formattedTime);
    setFechaCreacion(formattedDate); //formatea la fecha de creacion
    setEquipos(row.equipos);
    setIp(row.ip);
    setAsignada(row.asignada);
    setIp_publica(row.ip_publica);
    setHostname(row.hostname);
    setDns(row.dns);
    setPuerto(row.puerto);
    setDescripcion(row.descripcion);
    setArea(row.area);
    setSolicitante(row.solicitante);
    setDependencia(row.dependencia);
    setStatus("Ocupado");
    setMac(row.mac);
    setModelo(row.modelo);
    setColor(row.color);
    setInventario(row.inventario);
    setSerie(row.serie);
    setDatosSistema(row.datosSistema);
    // Actualiza el estado local con los cambios primero
    const updatedRecords = records.map((record) => {
      if (record._id === row._id) {
        return {
          ...record,
          equipos: row.equipos,
          ip: row.ip,
          ip_publica: row.ip_publica,
          asignada: row.asignada,
          hostname: row.hostname,
          dns: row.dns,
          puerto: row.puerto,
          descripcion: row.descripcion,
          datosSistema: row.datosSistema,
          area: row.area,
          solicitante: row.solicitante,
          fecha: row.fecha,
          hora: row.hora,
          dependencia: row.dependencia,
          status: "Ocupado", // Establecer el estado en "Ocupado"
          mac: row.mac,
          serie: row.serie,
          color: row.color,
          modelo: row.modelo,
          inventario: row.inventario,
        };
      }
      return record;
    });
    setRecords(updatedRecords);
    updateRecord(row);
  };

  //Boton Cancelar dentro de MODIFICAR DATOS
  const handleCancel = () => {
    setSelectedRecord(null);
    setEquipos("Selecciona un equipo");
    setIp("");
    setIp_publica("");
    setHostname("");
    setArea("Selecciona un área");
    setSolicitante("");
    setAsignada("");
    setFecha("");
    setHora("");
    setDependencia("Selecciona Dependencia");
    setStatus("Libre");
    setMac("");
    setSerie("");
    setModelo("");
    setColor("");
    setInventario("");
    setDns("");
    setPuerto("");
    setDescripcion("");
  };

  /* //Boton para eliminar un dato en la base de datos y tabla
  const handleDelete = (row) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      axios
        .delete(`${envs.MONGO_URI}/${row._id}`)
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
  }; */

  const handleLimpiarIp = async (row) => {
    try {
      const shouldClean = await showConfirmationDialog("");

      if (shouldClean) {
        await axios
          .put(`${envs.MONGO_URI}/${row._id}`, {
            ip: row.ip,
            dependencia: "Selecciona dependencia",
            status: "Libre",
            equipos: "Selecciona un equipo",
            area: "Selecciona un área",
          })
          .then(() => {
            // Al actualizar me trae los datos del servidor
            axios
              .get(`${MONGO_URI}?segmento=${selectedSegment}`)
              .then(async (response) => {
                console.log("Después de obtener la respuesta del servidor");
                const relatedData = response.data;
                console.log(
                  "Datos relacionados de la segunda colección:",
                  relatedData
                );
                const ipsInRelatedData = relatedData.map((item) => item.ip);
                console.log(
                  "Direcciones IP en los datos relacionados:",
                  ipsInRelatedData
                );
                // Filtra las IPs relacionadas que coinciden con el segmento seleccionado
                const formattedSelectedSegment = selectedSegment.split(" ")[0];
                const filteredIPs = ipsInRelatedData.filter(
                  (ip) => ip !== null && ip.startsWith(formattedSelectedSegment)
                );

                console.log("IPs filtradas:", filteredIPs);

                // Filtra los registros de la primera colección que coinciden con las IPs filtradas
                const filteredRecords = relatedData.filter((record) => {
                  return record.ip !== null && filteredIPs.includes(record.ip);
                });
                console.log("Registros filtrados:", filteredRecords);

                // Actualiza el estado con los registros filtrados
                setFilteredRecords(filteredRecords);
                setAuxFilteredRecords(filteredRecords);
                filtrado_servidores();
              })
              .catch((error) => {
                console.error(
                  "Error al obtener los datos relacionados de la segunda colección:",
                  error
                );
              });
            Swal.fire({
              title: "La IP ha sido liberada.",
              icon: "success",
            });
          });
      }
    } catch (error) {
      console.error("Error al liberar la IP:", error);
      Swal.fire({
        title: "Error",
        text: "Error al liberar la IP.",
        icon: "error",
      });
    }
  };

  const showConfirmationDialog = async (message) => {
    const result = await Swal.fire({
      title: "¿Estás seguro de liberar la IP?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Liberar",
      cancelButtonText: "Cancelar",
    });

    return result.isConfirmed;
  };

  const handleSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();

    // Assuming your data is an array of objects with string values
    const filteredData = AuxFilteredRecords.filter((row) =>
      Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(inputValue)
      )
    );

    console.log(filteredData);

    setFilteredRecords(filteredData);
  };

  const handleSearchServidores = (e) => {
    const inputValue = e.target.value.toLowerCase();

    // Assuming your data is an array of objects with string values
    const filteredData = AuxFilteredRecordsServidores.filter((row) =>
      Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(inputValue)
      )
    );
    setFilteredRecordsServidores(filteredData);
  };

  // useEffect para actualizar la tabla cuando cambian los datos o el segmento seleccionado
  useEffect(() => {
    // Verificar si hay descripción, DNS o puerto antes de agregar a la tabla
    if (descripcion || dns || puerto) {
      // Crear un nuevo objeto de datos para la tabla
      const newData = {
        dns,
        puerto,
        descripcion,
      };

      // Actualizar la tabla con los datos del nuevo objeto
      setTableData([newData]);
    } else {
      // Limpiar la tabla si no hay descripción, DNS o puerto
      setTableData([]);
    }
  }, [dns, puerto, descripcion, selectedRecord]);

  useEffect(() => {
    const fetchPuertoAutomatico = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get_port?url=${dns}`
        );
        const data = await response.json();
        setPuerto(data.port);
      } catch (error) {
        console.error("Error al capturar el puerto:", error);
      }
    };
    // Llamar al servidor solo si hay una URL válida
    if (dns) {
      fetchPuertoAutomatico();
    }
  }, [dns]);

  //Boton para cerrar el modal de DNS
  const handleClose = () => {
    setSegmento("");
    setIdInicial("");
    setIdFinal("");
  };

  //Funcion para abrir el modal de DNS
  const openModal = () => {
    setSegmento("");
    setIdInicial("");
    setIdFinal("");
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

  const handleGuardarSistema = () => {
    // Validar que los campos no estén vacíos
    if (!dns || !puerto || !descripcion) {
      alert("Completa todos los campos del sistema.");
      return;
    }

    // Crear un nuevo objeto con los datos del sistema
    const nuevoSistema = {
      dns,
      puerto,
      descripcion,
    };

    console.log("antes de la actualización de datosSistema:", datosSistema);
    // Si datosSistema es null o undefined, inicialízalo como un array vacío
    const sistemasActuales = datosSistema || [];
    console.log("sistemasActuales:", sistemasActuales);

    console.log("Estado antes de la actualización:", datosSistema);
    // Actualizar el estado con los nuevos datos del sistema
    setDatosSistema([...sistemasActuales, nuevoSistema]);
    console.log("Estado después de la actualización:", datosSistema);

    // Limpiar los campos después de guardar
    setDns("");
    setPuerto("");
    setDescripcion("");
  };

  //paginacion
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentData = Array.isArray(datosSistema)
    ? datosSistema.slice(offset, offset + itemsPerPage)
    : [];

  const handledeseleccionar = (e) => {
    // Obtiene el elemento real al que se le asignó el manejador de clic
    const clickedElement = e.currentTarget;

    // Verifica si el clic ocurrió dentro de la tabla
    const isClickInsideTable =
      clickedElement.contains(e.target) &&
      e.target.closest(".tabla-ips") !== null;

    // Verifica si el clic ocurrió dentro de la nueva tabla
    const isClickInsideTable2 =
      clickedElement.contains(e.target) &&
      e.target.closest(".tabla-servidores") !== null;

    // Verifica si el clic ocurrió dentro del formulario
    const isClickInsideForm = e.target.closest(".Formulario-Navs") !== null; // Reemplaza "tu-formulario" con la clase real de tu formulario

    // Si el clic ocurrió fuera de la tabla y fuera del formulario, deseleccionar la fila y limpiar el formulario
    if (!isClickInsideTable && !isClickInsideTable2 && !isClickInsideForm) {
      setSelectedRecord(null);
      handleCancel();
    }
  };

  const handleRowClicked = (row, index) => {
    // Si la fila ya estaba seleccionada, deseleccionarla y limpiar el formulario
    if (row === selectedRecord) {
      setSelectedRecord(null);
      setSelectedSegmento(null);
      handleCancel();
    } else {
      // Si la fila no estaba seleccionada, realizar las acciones normales (editar)
      handleEdit(row, index);
      //setSelectedSegment(row);
      handleDatosSegmentos(row); //Quitarlo..
    }
  };

  /* axios
    .get("/segmentosbd")
    .then((response) => {
      console.log(response.data); // Imprime los datos en la consola
      setSegmentos(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });*/
    
  const handleChange = (e) => {
    setDns(e.target.value);
    setShowExample(false);
  }; 

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toUpperCase();
    const maxLength = 108;

    // Limita la longitud del contenido
    if (inputValue.length <= maxLength) {
      setDescripcion(inputValue);
    }

    // Calcula el número de filas para ajustar el desplazamiento
    const rows = Math.max(Math.ceil(inputValue.length / 30), 1);
    e.target.rows = rows;
  };

  const handleTabSelect = (key) => {
    setTab(key);
  };

  return (
    <div className="contenedor-principal" onClick={handledeseleccionar}>
      <div className="ips">
        {isReloading ? <p>Recargando la página...</p> : null}
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-8">
            <div className="formulario_tickets">
              <div className="centro">
                <div className="container">
                  <Tabs
                    defaultActiveKey="IPS"
                    id="custom-tabs"
                    className="custom-tabs-container"
                    onSelect={handleTabSelect}
                  >
                    <Tab eventKey="IPS" title="IPS" className="tab-ips">
                      <br></br>
                      <div className="row">
                        <div className="contenedor_segmentos">
                          <div className="col-4 selecciona_segmentos">
                            <select
                              id="select_segmento"
                              className="segmentosselect"
                              value={selectedSegment}
                              onChange={(e) => {
                                //setSelectedSegment(e.target.value);
                                handleSegmentChange(e);
                              }}
                            >
                              <option value="" /*disabled*/>
                                Selecciona un segmento
                              </option>
                              {segmentos.map((segmento) => (
                                <option
                                  key={segmento.id}
                                  value={segmento.segmento}
                                >
                                  {segmento.segmento}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="agregar-segmentos">
                            <button className="btn-space" onClick={openModal}>
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                        <div className="busqueda_ips">
                          <div className="col-md-4">
                            <div style={{ marginTop: "10px" }}>
                              <br></br>
                              {searchError && (
                                <p className="text-danger mt-2">
                                  No se encontraron resultados.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="mb-3">
                            <label
                              id="txt_filtroEquipos"
                              htmlFor="filtroEquipos"
                            >
                              Filtrar por equipos:
                            </label>
                            <select
                              id="select_filtroEquipos"
                              className="filtros_select"
                              value={filterEquipos}
                              onChange={(e) => {
                                setFilterEquipos(e.target.value);
                                handleSearch(e);
                              }}
                            >
                              <option value="">Todos</option>
                              <option value="Servidor">Servidor</option>
                              <option value="Grabador">Grabador</option>
                              <option value="PC">PC</option>
                              <option value="Impresora">Impresora</option>
                              <option value="Móvil">Móvil</option>
                              <option value="Laptop">Laptop</option>
                              <option value="Otros">Otros</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="col-md-12">
                            <label id="lbl_status" htmlFor="status">
                              Filtrar por estatus:
                            </label>
                            <select
                              id="txt_status0"
                              className="filtros_select"
                              onChange={(e) => {
                                //setStatus(e.target.value);
                                handleSearch(e);
                              }}
                            >
                              <option value="">Todos</option>
                              <option value="Ocupado">Ocupado</option>
                              <option value="Libre">Libre</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="col-md-12"></div>
                        </div>
                        <div className="col-md-5">
                          <div className="input-group col-md-8 displayflex">
                            <div
                              className="icono-buscar"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                marginTop: "1.5rem",
                              }}
                            >
                              <MdOutlineSearch
                                style={{
                                  fontSize: "2.5rem",
                                }}
                              ></MdOutlineSearch>
                            </div>
                            <input
                              type="text"
                              id="txt_searchText"
                              className="filtro_busqueda"
                              onChange={(e) => {
                                //setSearchText(e.target.value);
                                handleSearch(e);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="tabla-ips">
                        <DataTable
                          id="paginadoEstilo"
                          columns={columns}
                          data={isSegmentSelected ? filteredRecords : []}
                          noHeader
                          dense
                          responsive
                          customStyles={customStyles}
                          paginationComponentOptions={paginado}
                          progressComponent={<loader></loader>}
                          noDataComponent={
                            isSegmentSelected
                              ? "No hay registros para el segmento seleccionado"
                              : "No se ha seleccionado un segmento"
                          }
                          onRowClicked={handleRowClicked}
                          conditionalRowStyles={[
                            {
                              when: (row) => row === selectedRecord,
                              style: {
                                backgroundColor: "#F5ECDF",
                              },
                            },
                          ]}
                          highlightOnHover
                          pagination // Habilitar paginación
                          paginationPerPage={10} // Número de elementos por página
                          paginationRowsPerPageOptions={[10, 15, 20]}
                          highlightOnSelect={true}
                          selectableRowsHighlight
                          selected={selectedRow ? [selectedRow._id] : []}
                        />
                      </div>
                    </Tab>
                    <Tab
                      eventKey="servidores"
                      title="Servidores"
                      className="tab-servidor"
                    >
                      <div>
                        <div className="tabla-servidores">
                          <br></br>
                          <div className="row">
                            <div className="col-md-2">
                              <div className="mb-3"></div>
                            </div>
                            <div className="col-md-3">
                              <div className="col-md-12"></div>
                            </div>
                            <div className="col-md-2">
                              <div className="col-md-12"></div>
                            </div>
                            <div className="col-md-5">
                              <div className="input-group col-md-8 displayflex">
                                <div
                                  className="icono-buscar btn-sm"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    marginTop: "1.5rem",
                                  }}
                                >
                                  <MdOutlineSearch
                                    style={{
                                      fontSize: "2.5rem",
                                    }}
                                  ></MdOutlineSearch>
                                </div>
                                <input
                                  type="text"
                                  id="txt_searchText"
                                  className="filtro_busqueda"
                                  onChange={(e) => {
                                    //setSearchText(e.target.value);
                                    handleSearchServidores(e);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <DataTable
                            id="paginadoEstilo"
                            columns={columns}
                            data={filteredRecordsServidores}
                            noHeader
                            dense
                            responsive
                            customStyles={customStyles}
                            paginationComponentOptions={paginado}
                            progressComponent={<loader></loader>}
                            noDataComponent={
                              "No hay registros para el segmento seleccionado"
                            }
                            onRowClicked={handleRowClicked}
                            conditionalRowStyles={[
                              {
                                when: (row) => row === selectedRecord,
                                style: {
                                  backgroundColor: "#F5ECDF",
                                },
                              },
                            ]}
                            highlightOnHover
                            pagination // Habilitar paginación
                            paginationPerPage={10} // Número de elementos por página
                            paginationRowsPerPageOptions={[10, 15, 20]}
                            highlightOnSelect={true}
                            selectableRowsHighlight
                            selected={selectedRow ? [selectedRow._id] : []}
                          />
                          {/* Modal para mostrar detalles de ubicación */}
                          {selectedUbi && (
                            <Modal
                              show={isModalOpenUbi}
                              onHide={() => setIsModalOpenUbi(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>
                                  Detalles de la Ubicación
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                {selectedUbi ? (
                                  <div>
                                    <p>
                                      City:{" "}
                                      {selectedUbi.ubicacion.city || "N/A"}
                                    </p>
                                    <p>
                                      Region:{" "}
                                      {selectedUbi.ubicacion.region || "N/A"}
                                    </p>
                                    <p>
                                      Country:{" "}
                                      {selectedUbi.ubicacion.country || "N/A"}
                                    </p>
                                    <p>
                                      Location:{" "}
                                      {selectedUbi.ubicacion.loc || "N/A"}
                                    </p>
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
                          {/* Modal para mostrar características del servidor */}
                          {selectedCaract && (
                            <Modal
                              show={isModalOpenCaract}
                              onHide={() => setIsModalOpenCaract(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>
                                  Características del servidor
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                {selectedCaract ? (
                                  <div>
                                    {selectedCaract.caracteristicas &&
                                    selectedCaract.caracteristicas ? (
                                      <div>{/* Contenido del modal */}</div>
                                    ) : (
                                      <p>
                                        La información del servidor no está
                                        completa.
                                      </p>
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
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-4">
            <div className="Formulario-Navs">
              <br></br>
              <div responsive className="">
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Datos IP
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-md-6">
                            {" "}
                            <div className="mx-auto">
                              <label id="lbl_ip" htmlFor="ip">
                                Ip:
                              </label>
                              <input
                                type="text"
                                id="txt_ip"
                                className="input_form"
                                value={ip}
                                readOnly
                                onChange={(e) =>
                                  setIp(e.target.value.toUpperCase())
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_ip_publica" htmlFor="ip_publica">
                                Ip Pública:
                              </label>
                              <input
                                type="text"
                                id="txt_ip_publica"
                                className="input_form"
                                value={ip_publica}
                                onChange={(e) => {
                                  // Filtra solo números
                                  const numeros = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  // La expresión regular para el formato de IP pública
                                  const formatoIpPublicaRegex =
                                    /^(\d{1,3}\.){0,3}\d{0,3}$/;

                                  if (formatoIpPublicaRegex.test(numeros)) {
                                    setIp_publica(numeros);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_area" htmlFor="area">
                                Área:
                              </label>
                              <select
                                id="txt_area"
                                className="select_form"
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
                            <div className="">
                              <label id="lbl_solicitante" htmlFor="solicitante">
                                Solicitante:
                              </label>
                              <input
                                type="text"
                                id="txt_solicitante"
                                className="input_form"
                                value={solicitante}
                                onChange={(e) =>
                                  setSolicitante(e.target.value.toUpperCase())
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_asignada" htmlFor="asignada">
                                Asignada:
                              </label>
                              <input
                                type="text"
                                id="txt_asignada"
                                className="input_form"
                                value={asignada}
                                onChange={(e) =>
                                  setAsignada(e.target.value.toUpperCase())
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <Form.Group>
                                <Form.Label>Fecha Asignación</Form.Label>
                                <input
                                  className="input_form"
                                  value={fecha} // Usa el estado fecha directamente
                                  readOnly // Establece el campo como de solo lectura
                                  onChange={(e) => setFecha(e.target.value)}
                                />
                              </Form.Group>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <Form.Group>
                                <Form.Label>Hora Asignación</Form.Label>
                                <input
                                  className="input_form"
                                  value={hora} // Usa el estado fecha directamente
                                  readOnly // Establece el campo como de solo lectura
                                  onChange={(e) => setHora(e.target.value)}
                                />
                              </Form.Group>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_dependencia" htmlFor="dependencia">
                                Dependencia:
                              </label>
                              <select
                                id="txt_dependencia"
                                className="select_form"
                                value={dependencia}
                                onChange={(e) => setDependencia(e.target.value)}
                              >
                                <option value="">Selecciona Dependencia</option>
                                <option value="C5i-Pachuca">C5i-Pachuca</option>
                                <option value="C5i-Tulancingo">
                                  C5i-Tulancingo
                                </option>
                                <option value="C5i-Tula">C5i-Tula</option>
                                <option value="C5i-Huejutla">
                                  C5i-Huejutla
                                </option>
                                <option value="Foraneos">Foraneos</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            {/* <div className="">
                              <label id="lbl_status" htmlFor="status">
                                Estatus
                              </label>
                              <select
                                id="txt_status"
                                className="select_form"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="Ocupado">Ocupado</option>
                                <option value="Libre">Libre</option>
                              </select>
                            </div> */}
                            <div className="">
                              <label id="lbl_status" htmlFor="status">
                                Estatus:
                              </label>
                              {status ? (
                                <div style={{ marginTop: "10px" }}>
                                  <label>{status}</label>
                                </div>
                              ) : (
                                <div style={{ marginTop: "10px" }}>
                                  <span>Ocupado</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Datos equipo
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="">
                              <Form.Group controlId="setEquipos">
                                <Form.Label>Equipos</Form.Label>
                                <select
                                  id="setEquipos"
                                  className="select_form"
                                  value={equipos}
                                  onChange={(e) => setEquipos(e.target.value)}
                                >
                                  <option value="Selecciona un equipo">
                                    Selecciona un equipo
                                  </option>
                                  <option value="Servidor">Servidor</option>
                                  <option value="Grabador">Grabador</option>
                                  <option value="PC">PC</option>
                                  <option value="Impresora">Impresora</option>
                                  <option value="Móvil">Móvil</option>
                                  <option value="Laptop">Laptop</option>
                                  <option value="Otros">Otros</option>
                                </select>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_hostname" htmlFor="hostname">
                                Hostname:
                              </label>
                              <input
                                type="text"
                                id="txt_hostname"
                                className="input_form"
                                value={hostname}
                                onChange={(e) => {
                                  const inputText = e.target.value
                                    .toUpperCase()
                                    .slice(0, 25);
                                  setHostname(inputText);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_mac" htmlFor="mac">
                                MAC:
                              </label>
                              <input
                                type="text"
                                id="txt_mac"
                                className="input_form"
                                value={mac}
                                onChange={(e) => {
                                  const inputText = e.target.value
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9]/g, ""); // Eliminar caracteres no deseados
                                  const formattedText = inputText
                                    .split("")
                                    .map((char, index) =>
                                      index > 0 && index % 2 === 0
                                        ? `-${char}`
                                        : char
                                    )
                                    .join("")
                                    .slice(0, 35);
                                  setMac(formattedText);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_serie" htmlFor="serie">
                                Serie:
                              </label>
                              <input
                                type="text"
                                id="txt_serie"
                                className="input_form"
                                value={serie}
                                onChange={(e) => {
                                  // Limitar la longitud a 15 caracteres
                                  const inputText = e.target.value
                                    .toUpperCase()
                                    .slice(0, 25);
                                  setSerie(inputText);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_modelo" htmlFor="modelo">
                                Modelo:
                              </label>
                              <input
                                type="text"
                                id="txt_modelo"
                                className="input_form"
                                value={modelo}
                                onChange={(e) => {
                                  const inputText = e.target.value
                                    .toUpperCase()
                                    .slice(0, 25);
                                  setModelo(inputText);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_color" htmlFor="color">
                                Color:
                              </label>
                              <input
                                type="text"
                                id="txt_color"
                                className="input_form"
                                value={color}
                                onChange={(e) => {
                                  const inputValue = e.target.value
                                    .toUpperCase()
                                    .replace(/[^A-Z]/g, "")
                                    .substring(0, 28);
                                  setColor(inputValue);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="">
                              <label id="lbl_inventario" htmlFor="inventario">
                                Inventario:
                              </label>
                              <input
                                type="text"
                                id="txt_inventario"
                                className="input_form"
                                value={inventario}
                                onChange={(e) => {
                                  const inputValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  ); // Elimina todo excepto números
                                  const numericValue =
                                    inputValue === ""
                                      ? ""
                                      : parseInt(inputValue, 10); // Convierte la cadena a un número entero

                                  // Verifica si el valor está dentro del rango de 0 a 10 o es una cadena vacía
                                  if (
                                    inputValue === "" ||
                                    (!isNaN(numericValue) &&
                                      numericValue >= 0 &&
                                      numericValue <= 10)
                                  ) {
                                    setInventario(inputValue); // Establece el valor en el estado
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <DatosEquipo
                            equipos={equipos}
                            setEquipos={setEquipos}
                            hostname={hostname}
                            setHostname={setHostname}
                            mac={mac}
                            setMac={setMac}
                            serie={serie}
                            setSerie={setSerie}
                            modelo={modelo}
                            setModelo={setModelo}
                            color={color}
                            setColor={setColor}
                            inventario={inventario}
                            setInventario={setInventario}
                            loading={loading}
                            handleAddRecord={handleAddRecord}
                            handleCancel={handleCancel}
                            selectedRecord={selectedRecord}
                          /> */}
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Datos sistemas
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-md-6">
                            {" "}
                            <div className="mx-auto">
                              <label id="lbl_dns" htmlFor="dns">
                                DNS:
                              </label>
                              <input
                                type="text"
                                id="txt_dns"
                                className="input_form"
                                value={dns}
                                onChange={handleChange}
                                placeholder={
                                  !dns && showExample
                                    ? "https://ren.gob.mx/registros"
                                    : ""
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mx-auto">
                              <label id="lbl_puerto" htmlFor="puerto">
                                Puerto:
                              </label>
                              <input
                                type="text"
                                id="txt_puerto"
                                className="input_form"
                                value={puerto}
                                onChange={(e) => {
                                  const inputValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  ); // Elimina todo excepto números
                                  const numericValue =
                                    inputValue === ""
                                      ? ""
                                      : parseInt(inputValue, 10); // Convierte la cadena a un número entero

                                  // Verifica si el valor tiene hasta 4 cifras
                                  if (
                                    inputValue === "" ||
                                    (!isNaN(numericValue) &&
                                      numericValue >= 0 &&
                                      numericValue <= 9999)
                                  ) {
                                    setPuerto(inputValue); // Establece el valor en el estado
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mx-auto">
                              <label id="lbl_descripcion" htmlFor="descripcion">
                                Descripción:
                              </label>
                              <input
                                type="text"
                                id="txt_descripcion"
                                className="input_form"
                                value={descripcion}
                                onChange={handleInputChange}
                                rows={3} 
                              />
                            </div>
                          </div>
                          <div className="btn-guardar-sistema  col d-flex justify-content-center">
                            <button
                              className="btn mx-3 save-button"
                              type="button"
                              onClick={handleGuardarSistema}
                            >
                              GUARDAR SISTEMA
                            </button>
                          </div>
                          <div className="table table-striped">
                            {/* Tabla de Datos del Sistema */}
                            <table>
                              <thead>
                                <tr>
                                  <th>DNS</th>
                                  <th>Puerto</th>
                                  <th>Descripción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentData.map((sistema, index) => (
                                  <tr key={index}>
                                    <td>{sistema.dns}</td>
                                    <td>{sistema.puerto}</td>
                                    <td>{sistema.descripcion}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="d-flex justify-content-center">
                              <ReactPaginate
                                pageCount={Math.ceil(
                                  (datosSistema ?? []).length / itemsPerPage
                                )}
                                pageRangeDisplayed={5}
                                marginPagesDisplayed={2}
                                onPageChange={handlePageChange}
                                containerClassName={"pagination"}
                                activeClassName={"active"}
                                previousLabel={"Anterior"}
                                nextLabel={"Siguiente"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        Datos segmentos
                      </button>
                    </h2>
                    <div
                      id="collapseFour"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFour"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div>
                            {tab === "IPS" ? (
                              selectedSegment ? (
                                <ul>
                                  <p>Segmento: {selectedSegment}</p>
                                  <p>IP Inicial: {idInicial}</p>
                                  <p>IP Final: {idFinal}</p>
                                  <p>Fecha de Creación:{fecha_creacion}</p>
                                </ul>
                              ) : (
                                <p>
                                  Selecciona un segmento para ver los detalles.
                                </p>
                              )
                            ) : selectedSegmentS ? (
                              <ul>
                                <p>Segmento: {selectedSegmentS}</p>
                                <p>IP Inicial: {idInicialS}</p>
                                <p>IP Final: {idFinalS}</p>
                                <p>Fecha de Creación:{fecha_creacionS}</p>
                              </ul>
                            ) : (
                              <p>
                                Selecciona un segmento para ver los detalles.
                              </p>
                            )}
                          </div>
                        </div>
                        {/* <DatosSegmentos 
                            segmento={segmento}
                            idInicial={idInicial}
                            idFinal={idFinal}
                            loading={loading}
                            handleAddRecord={handleAddRecord}                       
                          /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Botones que aparecen solo cuando se selecciona una IP  sin miedo al exito */}
            {selectedRow && (
              <div className="custom-button-container">
                {loading && <div>Cargando...</div>}
                <button
                  className="btn  mx-3 save-button"
                  type="button"
                  onClick={handleAddRecord} //antes tenia handle handleaddrecord
                >
                  ACTUALIZAR DATOS
                </button>
                <div className="separar"></div>
                <button
                  className="btn mx-3 cancel-button"
                  type="button"
                  onClick={handleCancel}
                >
                  LIMPIAR
                </button>
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
                        className="input_form"
                        id="txt_segmento"
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
                      className="input_form"
                      value={idInicial}
                      id="txt_inicial"
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
                      className="input_form"
                      value={idFinal}
                      id="txt_final"
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
            <Button
              className="limpiar-segmentos"
              variant="secondary"
              onClick={handleClose}
            >
              Limpiar
            </Button>
            <Button
              className="agregar-segmentos"
              variant="primary"
              onClick={handleAddSegment}
            >
              Agregar Segmento
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
export default IP;
