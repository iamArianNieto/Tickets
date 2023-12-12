import React from 'react';
import '../../CSS/prueba.css';

import envs from 'react-dotenv';

function Modal({ handleShowModal, showModal }) {
  
  const handleSaveService = () => {
    const nuevoServicio = document.getElementById('txt_Modaladdserver').value;

    if (!nuevoServicio.trim()) {
      alert('El campo de servicio es obligatorio. Por favor, llénelo.');
    } else {
      fetch(`${envs.API_SERVICIOS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ NombreServicio: nuevoServicio }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.mensaje); 
          handleShowModal(false);
        })
        .catch((error) => {
          console.error('¡uy!, Ocurrió un error al guardar el servicio:', error);
        });
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal-background">
          <div className="custom-modal-content">
            <h2 className='titleModal'>Agregar un nuevo servicio</h2>
            <form>
              <div className='addServicio-contenedor'>
                <br></br>
                <label>Servicio: </label>
                <input
                  id='txt_Modaladdserver'
                  className='addserver'
                  type="text"
                  placeholder="Servicio nuevo"
                  autoFocus
                />
              </div>
            </form>
            <br></br>
            <div className="modal-buttons">
              <button
                id='btn_save_Modaladd'
                className="buttonModalSave"
                type="submit"
                onClick={() => {
                  handleSaveService();
                }}>
                Guardar
              </button>
              <button
                id='btn_close_Modaladd'
                className="buttonModalClose"
                type="submit"
                onClick={() => handleShowModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Modal;