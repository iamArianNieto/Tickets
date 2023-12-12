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
import { Await } from "react-router-dom";
/* import envs from "react-dotenv"; */
import Loader from "./loader";
import { AiOutlineClear } from "react-icons/ai";

import {
  faEdit,
  faTrash,
  faSearch,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

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
  const [puerto, setPuerto] = useState("");
  const [descripcion, setDescripcion] = useState("");
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

  const [segmentos, setSegmentos] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const segmentosFiltrados = segmentos.filter(
    (segmento) => segmento.segmento !== null
  );

  const [isReloading, setIsReloading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [selectedRow, setSelectedRow] = useState(-1);

  const columns = [
    {
      name: "EQUIPO",
      selector: (row) => row.equipos,
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
      name: "HOSTNAME",
      selector: "hostname",
      sortable: true,
      cell: (row) => <StyledCell>{row.hostname}</StyledCell>,
    },
    {
      name: "IP PÚBLICA",
      selector: "ip_publica",
      sortable: true,
      cell: (row) => <StyledCell>{row.ip_publica}</StyledCell>,
    },
    {
      name: "ÁREA",
      selector: "area",
      sortable: true,
      cell: (row) => <StyledCell>{row.area}</StyledCell>,
    },
    {
      name: "ASIGNADA",
      selector: "asignada",
      sortable: true,
      cell: (row) => <StyledCell>{row.asignada}</StyledCell>,
    },
    {
      name: "FECHA ASIGNACIÓN",
      selector: "fecha",
      sortable: true,
      cell: (row) => <StyledCell>{row.fecha}</StyledCell>,
    },
    {
      name: "DEPENDENCIA",
      selector: "dependencia",
      sortable: true,
      cell: (row) => <StyledCell>{row.dependencia}</StyledCell>,
    },
    {
      name: "ESTATUS",
      selector: "status",
      sortable: true,
      cell: (row) => <StyledCell>{row.status}</StyledCell>,
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

  // Carga los registros iniciales cuando se monta el componente
  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddSegment = async () => {
    if (segmento && idInicial && idFinal) {
      const formattedSegment = `${segmento} (${idInicial} - ${idFinal})`;
      console.log("formattedSegment:", formattedSegment);
      const newSegmento = {
        segmento: formattedSegment,
        ip_inicial: idInicial,
        ip_final: idFinal,
      };

      try {
        // Obtener los segmentos existentes desde la base de datos
        const existingSegmentsResponse = await axios.get(
          "http://10.18.11.31:5000/segmentosbd"
        );
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
        console.log("isDuplicate:", isDuplicate);
        if (isDuplicate) {
          // Muestra un mensaje de error si es un segmento duplicado
          window.alert(
            "El segmento ingresado ya existe. Por favor, ingrese un segmento único."
          );
          return; // Sal del manejador de eventos si es un duplicado
        } else {
          // Enviar ambas solicitudes en paralelo utilizando Promise.all
          const [response1, response2] = await Promise.all([
            axios.post("http://10.18.11.31:5000/gestorips", newSegmento),
            axios.post("http://10.18.11.31:5000/segmentosbd", newSegmento),
          ]);

          if (response1.data && response2.data) {
            console.log(response1.data);
            console.log(response2.data);
          } else {
            console.error("Error al agregar el segmento o registros.");
            return;
          }

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
              area: area,
              solicitante: solicitante,
              fecha: fecha,
              dependencia: dependencia,
              status: status,
            });
          }

          // Agregar lógica para guardar el nuevo segmento en la base de datos
          segmentoData.forEach(async (data) => {
            try {
              const response = await axios.post(MONGO_URI, data);
              console.log(response.data.message);
            } catch (error) {
              console.error("Error al agregar el registro:", error);
            }
          });

          // Después de agregar el segmento con éxito
          const updatedSegmentos = [newSegmento, ...segmentos];
          setSegmentos(updatedSegmentos);

          // Seleccionar automáticamente el nuevo segmento en el select
          setSelectedSegment(newSegmento.segmento);

          // Llamar a la función handleSegmentChange después de seleccionar automáticamente el nuevo segmento
          handleSegmentChange({
            target: {
              value: newSegmento.segmento,
            },
          });

          // Filtrar los registros para obtener solo aquellos que pertenecen al nuevo segmento
          const filteredRecords = records.filter((record) => {
            if (record.ip) {
              const ipSegments = record.ip.split(".");
              const segmentoBase = `${ipSegments[0]}.${ipSegments[1]}.${ipSegments[2]}`;
              return (
                segmentoBase === newSegmento.segmento.replace(/\s\(.*\)/, "")
              ); // Asegúrate de ajustar según tu estructura de datos
            }
            return false;
          });
          // Actualizar el estado con los registros filtrados
          setFilteredRecords(filteredRecords);

          // Limpia los campos después de agregar el segmento
          setSegmento("");
          setIdInicial("");
          setIdFinal("");
          setIsModalOpen(false);

          // Actualiza los registros después de agregar el segmento
          fetchRecords();

          // Recarga los segmentos
          axios
            .get("http://10.18.11.31:5000/segmentosbd")
            .then((response) => {
              setSegmentos(response.data);
              console.log("Segmentos recargados:", response.data);
            })
            .catch((error) => {
              console.error("Error al obtener los segmentos:", error);
            });
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
    }
  };

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
        // Antes de filtrar las IPs relacionadas
        console.log("ipsInRelatedData:", ipsInRelatedData);
        console.log("selectedSegment:", selectedSegment);

        // Divide el segmento para obtener la parte antes del espacio
        const selectedSegmentParts = selectedSegment.split(" ");
        const formattedSelectedSegment = selectedSegmentParts[0];

        // Filtra las IPs relacionadas que no son nulas
        const filteredIPs = ipsInRelatedData.filter(
          (ip) => ip !== null && ip.startsWith(formattedSelectedSegment)
        );
        console.log("IPs filtradas:", filteredIPs);

        // Filtra los registros de la primera colección que coinciden con las IPs filtradas
        const filteredRecords = records.filter((record) => {
          return filteredIPs.includes(record.ip);
        });
        console.log("Registros filtrados:", filteredRecords);

        // Actualiza el estado con los registros filtrados
        setFilteredRecords(filteredRecords);
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
  const handleAddRecord = (equipoData, sistemaData) => {
    const newRecord = {
      equipos: equipos,
      ip: ip,
      hostname: hostname,
      area: area,
      solicitante: solicitante,
      asignada: asignada,
      fecha: fecha,
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
    };
    console.log("Datos de equipo:", equipoData, sistemaData);

    if (selectedRecord) {
      actualizarRegistro({ ...newRecord, _id: selectedRecord._id });
    } else {
      agregarRegistro(newRecord);
    }
    // Limpia los campos después de agregar o actualizar desde MODIFCAR DATOS
    setEquipos("");
    setIp("");
    setIp_publica("");
    setHostname("");
    setArea("");
    setSolicitante("");
    setAsignada("");
    setFecha("");
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
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}T${today.getHours().toString().padStart(2, "0")}:${today.getMinutes().toString().padStart(2, "0")}`;

    // Establecer la fecha actual en el estado al seleccionar un registro para editar
    setFecha(formattedDate);

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
          area: row.area,
          solicitante: row.solicitante,
          fecha: row.fecha,
          dependencia: row.dependencia,
          status: "Ocupado", // Establecer el estado en "Ocupado"
          mac: row.mac,
          serie: row.serie,
          color: row.color,
          inventario: row.inventario,
        };
      }
      return record;
    });
    setRecords(updatedRecords);

    // Luego realiza la solicitud al servidor
    updateRecord(row); // Supongo que tienes una función para actualizar el registro en el servidor
  };

  //Boton Cancelar dentro de MODIFICAR DATOS
  const handleCancel = () => {
    setSelectedRecord(null);
    setEquipos("");
    setIp("");
    setHostname("");
    setArea("");
    setSolicitante("");
    setAsignada("");
    setFecha("");
    setDependencia("Selecciona Dependencia");
    setStatus("libre");
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

  //Boton liberar ip
  const handleLimpiarIp = (row) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas limpiar los datos de este registro?"
      )
    ) {
      const updatedRecords = records.map((record) =>
        record._id === row._id
          ? {
              ...record,
              // Deja la IP, pero restablece otros campos
              dependencia: "Selecciona Dependencia",
              status: "Libre",
              equipos: "Selecciona un equipo",
              area: "Selecciona un área",
            }
          : record
      );

      axios
        .put(`http://10.18.11.31:5000/gestorips/${row._id}`, {
          // Incluye la IP en la solicitud PUT
          ip: row.ip,
          dependencia: "Selecciona dependencia",
          status: "Libre",
          equipos: "Selecciona un equipo",
          area: "Selecciona un área",
        })
        .then(() => {
          console.log("Datos limpiados exitosamente");
          setRecords(updatedRecords);
          setSelectedRecord(null);
        })
        .catch((error) => {
          console.error("Error al limpiar los datos del registro:", error);
        });
    }
  };

  //Busca los datos en la tabla desde los filtros
  const handleSearch = async () => {
    try {
      const response = await axios.get(MONGO_URI, {
        params: {
          searchText: filterText,
          filterStatus: filterStatus,
        },
      });
      const data = response.data;
      setRecords(data);
      setSearchError(data.length === 0 && filterText !== "");
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
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

  return (
    <>
      <StyleSheetManager shouldForwardProp={(prop) => prop !== "$sortActive"}>
        <div className="ips">
          {isReloading ? <p>Recargando la página...</p> : null}
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-8">
              <div className="formulario_tickets">
                <div className="centro">
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
                        <option value="" disabled>
                          Selecciona un segmento
                        </option>
                        {segmentosFiltrados.map((segmento, index) => (
                          <option key={index} value={segmento.segmento}>
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
                  <div className="container">
                    <Tabs
                      defaultActiveKey="ips"
                      id="custom-tabs"
                      className="custom-tabs-container"
                    >
                      <Tab eventKey="ips" title="IPS" className="tab-ips">
                        <br></br>
                        <div className="row">
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
                                }}
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
                          <div className="col-md-2">
                            <div className="col-md-12">
                              <label id="lbl_status" htmlFor="status">
                                Filtrar por estatus:
                              </label>
                              <select
                                id="txt_status"
                                className="filtros_select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="Ocupado">Ocupado</option>
                                <option value="Libre">Libre</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="col-md-12"></div>
                          </div>
                          <div className="col-md-5">
                            <div className="input-group col-md-12">
                              <input
                                type="text"
                                id="txt_searchText"
                                className="filtro_busqueda"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                              />
                              {/*  <div className="input-group-append">
                                            <button
                                            className="btn-primary"
                                      onClick={handleSearch}
                                    >
                                      <FontAwesomeIcon icon={faSearch} /> Buscar
                                    </button> 
                                  </div>*/}
                            </div>
                          </div>
                        </div>
                        <div className="tabla-ips">
                          <DataTable
                            id="paginadoEstilo"
                            columns={columns}
                            data={filteredRecords}
                            noHeader
                            dense
                            responsive
                            customStyles={customStyles}
                            paginationComponentOptions={paginado}
                            progressComponent={<loader></loader>}
                            noDataComponent="Sin registro de IPS"
                            onRowClicked={(row, index) =>
                              handleEdit(row, index)
                            }
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
                            <DataTable
                              columns={columns}
                              data={
                                filteredRecords.length > 0
                                  ? filteredRecords
                                  : records
                              }
                              noHeader
                              dense
                              responsive
                              customStyles={customStyles}
                              paginationComponentOptions={paginado}
                              progressComponent={<loader></loader>}
                              noDataComponent="Sin registro de IPS"
                              conditionalRowStyles={estiloSeleccion}
                              highlightOnHover
                              pagination // Habilitar paginación
                              paginationPerPage={5} // Número de elementos por página
                              paginationRowsPerPageOptions={[5, 10, 15]} // Opciones de cantidad de elementos por página
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
              <div class="Formulario-Navs">
                <br></br>
                <div responsive className="">
                  <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingOne">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          DATOS IP
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        class="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
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
                                  onChange={(e) => setIp(e.target.value)}
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
                                  onChange={(e) =>
                                    setIp_publica(e.target.value)
                                  }
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
                                <label
                                  id="lbl_solicitante"
                                  htmlFor="solicitante"
                                >
                                  Solicitante:
                                </label>
                                <input
                                  type="text"
                                  id="txt_solicitante"
                                  className="input_form"
                                  value={solicitante}
                                  onChange={(e) =>
                                    setSolicitante(e.target.value)
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
                                  onChange={(e) => setAsignada(e.target.value)}
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
                                <label
                                  id="lbl_dependencia"
                                  htmlFor="dependencia"
                                >
                                  Dependencia:
                                </label>
                                <select
                                  id="txt_dependencia"
                                  className="select_form"
                                  value={dependencia}
                                  onChange={(e) =>
                                    setDependencia(e.target.value)
                                  }
                                >
                                  <option value="">
                                    Selecciona Dependencia
                                  </option>
                                  <option value="C5i-Pachuca">
                                    C5i-Pachuca
                                  </option>
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
                              <div className="">
                                <label id="lbl_status" htmlFor="status"></label>
                                <select
                                  id="txt_status"
                                  className="select_form"
                                  value={status}
                                  onChange={(e) => setStatus(e.target.value)}
                                >
                                  <option value="Ocupado">Ocupado</option>
                                  <option value="Libre">Libre</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingTwo">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                        >
                          DATOS EQUIPO
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
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
                                    <option value="">
                                      Selecciona un equipo
                                    </option>
                                    <option value="server">Server</option>
                                    <option value="grabadores">
                                      Grabadores{" "}
                                    </option>
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
                                  onChange={(e) => setHostname(e.target.value)}
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
                                  onChange={(e) => setMac(e.target.value)}
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
                                  onChange={(e) => setSerie(e.target.value)}
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
                                  onChange={(e) => setModelo(e.target.value)}
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
                                  onChange={(e) => setColor(e.target.value)}
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
                                  onChange={(e) =>
                                    setInventario(e.target.value)
                                  }
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
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingThree">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                        >
                          DATOS SISTEMA
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
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
                                  onChange={(e) => setDns(e.target.value)}
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
                                  onChange={(e) => setPuerto(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mx-auto">
                                <label
                                  id="lbl_descripcion"
                                  htmlFor="descripcion"
                                >
                                  Descripcion:
                                </label>
                                <input
                                  type="text"
                                  id="txt_descripcion"
                                  className="input_form"
                                  value={descripcion}
                                  onChange={(e) =>
                                    setDescripcion(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          {/* <DatosSistema
                            dns={dns}
                            setDns={setDns}
                            puerto={puerto}
                            setPuerto={setPuerto}
                            descripcion={descripcion}
                            setDescripcion={setDescripcion}
                            loading={loading}
                            handleAddRecord={handleAddRecord}
                            handleCancel={handleCancel}
                            selectedRecord={selectedRecord}
                          /> */}
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingFour">
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                          aria-expanded="false"
                          aria-controls="collapseFour"
                        >
                          DATOS SEGMENTOS
                        </button>
                      </h2>
                      <div
                        id="collapseFour"
                        class="accordion-collapse collapse"
                        aria-labelledby="headingFour"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <div className="row">
                            <div className="">
                              {loading && <div>Cargando...</div>}
                              <p>Segmento: {segmento}</p>
                              <p>IP Inicial: {idInicial}</p>
                              <p>IP Final: {idFinal}</p>
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
              {/* Botones que aparecen solo cuando se selecciona una IP */}
              {selectedRow && (
                <div className="custom-button-container">
                  {loading && <div>Cargando...</div>}
                  <button
                    className="btn  mx-3 save-button"
                    type="button"
                    onClick={handleAddRecord}
                  >
                    Guardar Cambios
                  </button>
                  <div className="separar"></div>
                  <button
                    className="btn mx-3 cancel-button"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancelar
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
      </StyleSheetManager>
    </>
  );
}
export default IP;
