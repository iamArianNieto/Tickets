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

export default Estadisticaimport React from 'react';

const Estadisticas = () => {
  const titleStyle = {
    marginLeft: '150px',
    fontSize: '20px', // Cambia el tamaño del texto
    // Puedes agregar más estilos aquí según tus necesidades
  };
  return (
    <div className='estadisticas'>
      <h1 style={titleStyle}>Estadísticas</h1>
    </div>
  );
};

export default Estadistica