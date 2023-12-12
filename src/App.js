import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/Menu/Sidebar';
import Tickets from './pages/Tickets';
import { Cerrados } from './pages/Cerrados';
import Abiertos from './pages/Abiertos';
import { Administracion } from './pages/Admin';
import Estadisticas from './pages/Estadisticas';
import Inicio from './pages/Inicio';
import IP from './pages/Ipinicial';

function App() {
  const location = useLocation();
  const showSidebarRoutes = ['/tickets', '/abiertos', '/cerrados', '/admin', '/estadisticas', '/ip'];
  const shouldShowSidebar = showSidebarRoutes.includes(location.pathname);
  const usuarioNombre = sessionStorage.getItem('USUARIO_NOMBRE');



  return (
    <div>
      {shouldShowSidebar && <Sidebar usuarioNombre={usuarioNombre} />}
      <Routes>
        {/* Ruta de inicio de sesión */}
        <Route path='/' element={<Inicio/>} />
        {/* Otras rutas */}
        <Route path="/tickets" element={<Tickets />} />
        <Route path='/abiertos' element={<Abiertos />} />
        <Route path='/cerrados' element={<Cerrados />} />
        <Route path='/admin' element={<Administracion />} />
        <Route path='/estadisticas' element={<Estadisticas />} />
        <Route path='/ip' element={<IP />} />
      </Routes>
    </div>
  );
}

export default App;