import React from 'react';
import IP from './IP';
import '../CSS/Ips.css';
import Footer from '../components/Footer/footer.js'

const Ipinicial = () => {
  return (
    <div >
      <div className='tickets'>
      <div className="navbarTitle">
        <h3>Sistema de Soporte Técnico</h3>
      </div>
         <IP></IP>
        <Footer esLoggin={'No'}></Footer>
     </div>
    </div>
  );
};
export default Ipinicial;

