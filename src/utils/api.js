import axios from './axiosConfig';

export const fetchRecords = async () => {
    try {
      const response = await axios.get(`${MONGO_URI}/gestorips`);
      const data = response.data;
      setRecords(data);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
    }
  };

  export const agregarRegistro = async (nuevoRegistro) => {
    try {
      const response = await axios.post(
        `${MONGO_URI}/gestorips`,
        nuevoRegistro
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error al agregar el registro:", error);
    }
  };

  export const actualizarRegistro = async (registroActualizado) => {
    try {
      console.log(loading); // Antes de setLoading(true)
      setLoading(true); // Inicia el indicador de carga
      console.log(loading); // Después de setLoading(true)
      const response = await axios.put(
        `${MONGO_URI}/gestorips/${registroActualizado._id}`,
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

  export const handleDelete = (row) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      axios
        .delete(`${MONGO_URI}/gestorips/${row._id}`)
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