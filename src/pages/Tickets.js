import React from 'react';
import Form from "../components/Formulario/Form.js";
import "../CSS/styles.css";
import Footer from '../components/Footer/footer.js'

const Tickets = (location) => {
  const { state: routeState } = location;

  const usuarioNombre = routeState?.usuarioNombre || sessionStorage.getItem('USUARIO_NOMBRE');
  const Nombre = routeState?.Nombre || sessionStorage.getItem('USUARIO');
  const usuarioArea = routeState?.usuarioArea || sessionStorage.getItem('USUARIO_AREA');
  const usuarioAreaDes = routeState?.usuarioAreaDes || sessionStorage.getItem('USUARIO_AREADES');



  return (
    <div className='tickets'>
      <div className="navbarTitle">
        <h3>Nuevo Ticket</h3>
      </div>
      <Form usuarioNombre={usuarioNombre} usuarioArea={usuarioArea} usuarioAreaDes={usuarioAreaDes} Nombre={Nombre}/>
      <Footer esLoggin={'Si'}></Footer>
    </div>
  );
};

export default Tickets;
