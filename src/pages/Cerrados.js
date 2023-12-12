import React from 'react';

export const Cerrados = () => {
  const titleStyle = {
    marginLeft: '150px',
    fontSize: '20px', // Cambia el tamaño del texto
    // Puedes agregar más estilos aquí según tus necesidades
  };
  return (
    <div className='cerrados'>
      <h1 style={titleStyle}>Tickets cerrados</h1>
    </div>
  );
};

export default Cerrados;