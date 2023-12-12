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
  const showSidebarRoutes = ['/tickets', '/abiertos', '/cerrados', '/ayuda', '/estadisticas', '/ip'];
  const shouldShowSidebar = showSidebarRoutes.includes(location.pathname);
  const { state: routeState } = location;

  const usuarioNombre = sessionStorage.getItem('USUARIO_NOMBRE');
  const usuarioArea = sessionStorage.getItem('USUARIO_AREA');
  const usuarioAreaDes = sessionStorage.getItem('USUARIO_AREADES');


  return (
    <div>
      {shouldShowSidebar && <Sidebar usuarioNombre={usuarioNombre}  />}
      <Routes>
        {/* Ruta de inicio de sesión */}
        <Route path='/' element={<Inicio/>} />
        {/* Otras rutas */}
         <Route
          path="/tickets"
          element={<Tickets usuarioNombre={routeState?.usuarioNombre} usuarioArea={routeState?.usuarioArea} usuarioAreaDes={routeState?.usuarioAreaDes} />}
        />
        <Route path='/abiertos' element={<Abiertos usuarioArea={routeState?.usuarioArea} usuarioAreaDes={routeState?.usuarioAreaDes} />} />
        <Route path='/cerrados' element={<Cerrados usuarioArea={routeState?.usuarioArea} usuarioAreaDes={routeState?.usuarioAreaDes} />} />
        <Route path='/ayuda' element={<Ayuda />} />
        <Route path='/estadisticas' element={<Estadisticas />} />
        <Route path='/ip' element={<IP />} />
      </Routes>
    </div>
  );
}

export default App;
