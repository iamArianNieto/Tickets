import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import "../CSS/Ips.css";

function DatosSistema({
  dns,
  setDns,
  puerto,
  setPuerto,
  descripcion,
  setDescripcion,
  loading,
  handleAddRecord,
  handleCancel,
  selectedRecord,
}) {
  const [tableData, setTableData] = useState([]);

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

  return (
    <>
      <br></br>
      <div responsive className="">
        <h3 className="container-title">Datos Sistema</h3>
        {selectedRecord ? (
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
                <label id="lbl_descripcion" htmlFor="descripcion">
                  Descripcion:
                </label>
                <input
                  type="text"
                  id="txt_descripcion"
                  className="input_form"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>
            <div className="custom-button-container">
              {loading && <div>Cargando...</div>}
              <button
                className="btn btn-primary mx-3 save-button"
                type="button"
                onClick={() =>
                  handleAddRecord({
                    dns,
                    puerto,
                    descripcion,
                  })
                }
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
        ) : null}

        {/* Tabla que muestra los datos */}
        {tableData.length > 0 && (
          <div>
            <h3>Datos en la Tabla</h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">DNS</th>
                  <th scope="col">PUERTO</th>
                  <th scope="col">DESCRIPCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.dns}</td>
                    <td>{data.puerto}</td>
                    <td>{data.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default DatosSistema;