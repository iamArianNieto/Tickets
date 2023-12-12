import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import "../CSS/Ips.css";

function DatosSegmentos({
  segmento,
  idInicial,
  idFinal,
  loading,
  handleAddRecord,
  handleCancel,
  selectedRecord,
}) {
  return (
    <>
      <br />
      <div responsive className="">
        <h3 className="container-title">Datos Segmentos</h3>
        {selectedRecord ? (
          <div className="row">
            <div className="custom-button-container">
              {loading && <div>Cargando...</div>}
              <p>Segmento: {segmento}</p>
              <p>IP Inicial: {idInicial}</p>
              <p>IP Final: {idFinal}</p>
              {/* Agrega más campos según tus necesidades */}
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
        ) : null}
      </div>
    </>
  );
}

export default DatosSegmentos;
