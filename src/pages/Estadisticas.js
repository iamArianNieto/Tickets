import React from 'react';
import DashPrincipal from '../components/Dashboard/DashPrincipal.js'
import Footer from '../components/Footer/footer.js'


const Estadisticas = () => {
  return (
    <div className="estaditicas">
      <div className="navbarTitle">
        <h3>Dashboard</h3>
      </div>
      <DashPrincipal/>
      <Footer esLoggin={'No'}></Footer>
    </div>
  );
};

export default Estadisticas;