import React from 'react';
import Form from "../components/Formulario/Form.js";
import "../CSS/styles.css";
import Footer from '../components/Footer/footer.js'

const Tickets = () => {

  return (
    <div className='tickets'>
      <div className="navbarTitle">
        <h3>Sistema de Soporte Técnico</h3>
      </div>
         <Form />
        <Footer esLoggin={'No'}></Footer>
     </div>
  );
};

export default Tickets;