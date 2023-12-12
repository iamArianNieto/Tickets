import React, { useState } from 'react';
import "../../CSS/manual.css";
import ReactPlayer from 'react-player';

// Componente principal del sistema de tickets
const Manual = () => {
  const [activeModule, setActiveModule] = useState('acercade');

  const handleTabSelect = (module) => {
    setActiveModule(module);
  };

  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'levantarTickets' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('levantarTickets')}
          >
            Levantar Tickets
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'ticketsAbiertos' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('ticketsAbiertos')}
          >
            Tickets Abiertos
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'ticketsCerrados' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('ticketsCerrados')}
          >
            Tickets Cerrados
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'dashboard' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('dashboard')}
          >
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'preguntas' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('preguntas')}
          >
            Preguntas Frecuentes (FAQ)
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'consejos' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('consejos')}
          >
            Consejos y Trucos
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'soporte' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('soporte')}
          >
            Soporte Adicional
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeModule === 'acercade' ? 'active' : ''}`}
            href="#"
            onClick={() => handleTabSelect('acercade')}
          >
            Acerca de
          </a>
        </li>
      </ul>

      {/* Renderizar el contenido del módulo activo */}
      {activeModule === 'levantarTickets' && <LevantarTickets />}
      {activeModule === 'ticketsAbiertos' && <TicketsAbiertos />}
      {activeModule === 'ticketsCerrados' && <TicketsCerrados />}
      {activeModule === 'dashboard' && <Dashboard />}
      {activeModule === 'preguntas' && <Preguntas />}
      {activeModule === 'consejos' && <Consejos />}
      {activeModule === 'soporte' && <Soporte />}
      {activeModule === 'acercade' && <Acercade />}
    </div>
  );
};

// Componente para el módulo Levantar Tickets
const LevantarTickets = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Levantar Tickets</h2>
      <p>Accede al módulo de "Levantar Tickets".</p>
      <p>Completa todos los campos obligatorios en el formulario.</p>

      <div style={{ position: 'relative', width: '749px', height: '422px' }}>
        {/* Agrega el iframe con la URL de tu video de Loom */}
        <iframe
          title="Video de Levantar Tickets"
          width="100%"
          height="100%"
          src="https://www.loom.com/embed/2d98826818fb449e9b482f46a87ac0a9?sid=1ed53716-2b6b-4692-8574-f1852af9559e"
          frameBorder="0"
          allowFullScreen
          style={{ position: 'absolute', top: '0', left: '0' }}
        ></iframe>
      </div>
    </div>
  );
};

// Componente para el módulo Tickets Abiertos
const TicketsAbiertos = () => {
  return (
    <div>
      <h2>Tickets Abiertos</h2>
      <p>Ve al módulo "Tickets Abiertos" para visualizar los tickets en curso.</p>
      <p>Haz clic en un ticket para ver detalles.</p>
      <p>Puedes añadir notas adicionales para actualizar el estado.</p>
    </div>
  );
};

// Componente para el módulo Tickets Cerrados
const TicketsCerrados = () => {
  return (
    <div>
      <h2>Tickets Cerrados</h2>
      <p>Accede al módulo "Tickets Cerrados" para revisar los tickets que han sido cerrados.</p>
      <p>Visualiza detalles y notas asociadas a cada ticket cerrado.</p>
    </div>
  );
};

// Componente para el módulo Dashboard
const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>En el "Dashboard", obtén una vista general de:</p>
      <ul>
        <li>Tickets diarios, mensuales, anuales y totales.</li>
        <li>Estadísticas clave para evaluar el rendimiento del soporte técnico.</li>
      </ul>
    </div>
  );
};

// Componente para el módulo Preguntas
const Preguntas = () => {
  return (
    <div>
      <h2>Preguntas Frecuentes (FAQ)</h2>
      <p>¿Cómo puedo agregar notas a un ticket abierto?</p>
      <p>En el módulo "Tickets Abiertos", haz clic en el ticket deseado y utiliza la opción "Agregar Nota" para incluir información adicional.</p>
      <p>¿Cómo accedo al Dashboard?</p>
      <p>Desde el menú principal, selecciona la opción "Dashboard" para acceder a las estadísticas y visualizaciones relacionadas con los tickets de soporte.</p>
      <p>¿Puedo reabrir un ticket cerrado?</p>
      <p>No, una vez que un ticket ha sido cerrado, no se puede reabrir. Sin embargo, puedes crear un nuevo ticket relacionado si es necesario.</p>

    </div>
  );
};

// Componente para el módulo Consejos
const Consejos = () => {
  return (
    <div>
      <h2>Consejos y Trucos</h2>
      <p>Utiliza filtros en los módulos de "Tickets Abiertos" y "Tickets Cerrados" para encontrar rápidamente la información que necesitas.</p>
      <p>Programa revisiones periódicas del Dashboard para evaluar la eficacia del equipo de soporte.</p>
    </div>
  );
};

// Componente para el módulo Acerca de
const Acercade = () => {
  return (
    <div className='section compress-width'>
      <h2><font style={{ verticalAlign: 'inherit' }}><span className="bold-title">Acerca de nosotros</span></font></h2>
      <p >
        <span style={{ verticalAlign: 'inherit' }}>Bienvenido al Centro de Control, Comando, Comunicaciones, Cómputo, Calidad e Inteligencia (C5i), donde la excelencia en el servicio es nuestra prioridad. Nos enorgullece ofrecer un avanzado sistema de gestión de tickets diseñado para brindar asistencia técnica de manera eficiente.</span>
      </p>
      <p >
        <span style={{ verticalAlign: 'inherit' }}>Nuestro sistema permite a nuestro personal emitir tickets de asistencia técnica de manera rápida y sencilla. Una de las características destacadas es la notificación instantánea a través de WhatsApp, garantizando que el personal esté informado en tiempo real sobre el estado de cada ticket. Esta innovadora funcionalidad no solo mejora la productividad, sino que también proporciona flexibilidad y atención oportuna a las necesidades de nuestro personal.</span>
      </p>
      <p >
        <span style={{ verticalAlign: 'inherit' }}>Enfocados en ofrecer un servicio integral, prestamos atención especial a los cuatro subcentros que conforman el Centro de Control de C5i en Hidalgo. Nos esforzamos por brindar soluciones eficaces y mejorar constantemente nuestra capacidad para satisfacer las demandas cambiantes del entorno tecnológico.</span>
      </p>
      <p >
        <span style={{ verticalAlign: 'inherit' }}>En C5i, nos comprometemos a proporcionar un servicio de alta calidad que garantice la seguridad, eficiencia y satisfacción de nuestro personal.  <span className="bold-title">¡El área de desarrollo de tecnologías está para optimizar su experiencia en asistencia técnica y elevar la calidad de sus operaciones!</span></span>
      </p>
    </div>
  );
};

// Componente para el módulo Soporte
const Soporte = () => {
  return (
    <div>
      <h2>Soporte Adicional</h2>
      <p>Si encuentras algún problema o necesitas asistencia adicional, por favor, contacta a nuestro equipo de Desarrollo de Tecnologías</p>

    </div>
  );
};

export default Manual;
