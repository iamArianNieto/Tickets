import React from 'react';
import Footer from '../components/Footer/footer.js';
import Manual from '../components/Ayuda/manual.js'

const Ayuda = () => {

  return (
    <div className='ayuda'>
      <div className="navbarTitle">
        <h3>Módulo de Tickets de Soporte Técnico
        </h3>
      </div>
      <Manual />
      <Footer esLoggin={'No'}></Footer>
    </div>


  );
};

export default Ayuda;