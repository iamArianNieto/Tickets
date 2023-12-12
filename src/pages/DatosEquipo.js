import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Navbar, Nav } from "react-bootstrap";
import "../CSS/Ips.css";

function DatosEquipo({
  equipos,
  setEquipos,
  hostname,
  setHostname,
  mac,
  setMac,
  serie,
  setSerie,
  modelo,
  setModelo,
  color,
  setColor,
  inventario,
  setInventario,
  loading,
  handleAddRecord,
  handleCancel,
  selectedRecord,
}) {
  return (
    <>
      <br></br>
      <div responsive className="">
        <h3 className="container-title">Datos Equipo</h3>
        {selectedRecord ? (
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
                  onChange={(e) => setInventario(e.target.value)}
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
                    equipos,
                    hostname,
                    mac,
                    serie,
                    modelo,
                    color,
                    inventario,
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
      </div>
    </>
  );
}
export default DatosEquipo;
