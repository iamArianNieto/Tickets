import React, { useEffect } from 'react';
import '../../CSS/footer.css';
import '../../CSS/login.css';

const Footer = ({esLoggin}) => {
  const footerStyle = {
    position: esLoggin === 'Si' ? 'fixed' : 'fixed',
    height: esLoggin === 'Si' ? '20%' : '14%',
    zIndex: esLoggin === 'Si' ? '999' : '999',
    bottom: esLoggin === 'Si' ? '0' : '0',
  };

  return (
    <footer style={footerStyle}>      
    <img className="escudoI" src="https://c5.hidalgo.gob.mx/CDN/IMAGEN/Footer/escudoHidBlancoI.svg" alt="Escudo Izquierdo" />
      <p>© 2023 Gobierno del Estado de Hidalgo. Derechos Reservados<br />Secretaría de Seguridad Pública<br />Centro de Control, Comando, Comunicaciones, Cómputo, Coordinación e Inteligencia<br />Dirección de Desarrollo de Tecnologías  V 1.0</p>
      <img className="escudoD" src="https://c5.hidalgo.gob.mx/CDN/IMAGEN/Footer/escudoHidBlancoD.svg" alt="Escudo Derecho" />
    </footer>
  );
};

export default Footer;
