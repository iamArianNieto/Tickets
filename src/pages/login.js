import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '.././CSS/login.css';
import '.././CSS/footer.css';
import logo from '../assets/logoc5.png';
import Swal from 'sweetalert2';

import envs from 'react-dotenv';
function LoginForm() {
  const [USUARIO, setUSUARIO] = useState('');
  const [PWD, setPWD] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUSUARIO(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPWD(event.target.value);
  };

  const IngresarLogin = async () => {

    if (USUARIO === '' || PWD === '') {
      Swal.fire({
        icon: 'error',
        title: envs.USER_CONTRA_VACIOS,
        html: envs.TEXT_USERCONTRA_VACIOS,
      });
      return;
    }

    if (USUARIO === PWD) {
      Swal.fire({
        icon: 'error',
        title: envs.ERROR_AUTENTICACION,
        text: envs.TEXT_AUTENTICACION,
      });
      return;
    }

    try {
      const usuario = USUARIO;
      const contrasena = PWD;
      const sigla = "TKS";

      const response = await fetch(envs.API_LOGINACCESO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario,
          contrasena,
          sigla,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del servicio:', data);

        if (data.length === 0) {
          Swal.fire({
            icon: 'error',
            title: envs.ERROR_AUTENTICACION,
            text: envs.TEXT_AUTENTICACION,
          });
          return;
        } else if (data[0].Final === "CONTRASEÑA INCORRECTA") {
          Swal.fire({
            icon: 'error',
            title: envs.PSW_INCORRECTA,
            text: envs.TEXT_INCORRECTAPSW,
          });
          return;
        } else if (data[0].Final === "USUARIO INCORRECTO") {
          Swal.fire({
            icon: 'error',
            title: envs.USER_INCORRECTA,
            text: envs.TEXT_INCORRECTAUSER,
          });
          return;
        }

        const { Nombre, Privilegio, Id_areaOmuni, Id_subcentro } = data[0];

        console.log('Usuario:', usuario);
        console.log('USUARIO:', USUARIO);

        console.log('Privilegio:', Privilegio);
        console.log('USUARIO_NOMBRE:', Nombre);
        console.log('USUARIO:', Nombre);
        console.log('USUARIO_SUBCENTRO:', Id_subcentro);

        sessionStorage.setItem('USUARIO', usuario);
        sessionStorage.setItem('PRIVILEGIO', Privilegio);
        sessionStorage.setItem('USUARIO_NOMBRE', Nombre);
        sessionStorage.setItem('USUARIO_AREA', Id_areaOmuni);
        sessionStorage.setItem('USUARIO_SUBCENTRO', Id_subcentro);

        // Redirige al usuario según su nivel de privilegio. 
        if (Privilegio === 4) { //ADMINISTRADOR POR AREA (DT) 
          navigate('/ip');
        } else if (Privilegio === 5) {//USUARIO GENERAL - NO AGREGA SERVICIO
          navigate('/tickets', { state: { privilege: Privilegio, USUARIO: usuario } });
        } else if (Privilegio === 2 || Id_areaOmuni === 6) {//ADMINISTRADOR GENERAL - AGREGA SERVICIO 
          navigate('/tickets', {
            state: {
              privilege: Privilegio,
              usuarioNombre: Nombre,
              USUARIO: usuario,
              usuarioArea: Id_areaOmuni,
              usuarioSubcentro: Id_subcentro
            },
          });
        } else {
          // Si no se redirige, puedes manejarlo aquí.
        }

        console.log('Acceso correcto');
      } else if (response.status === 401) {
        console.error('Credenciales incorrectas');
        Swal.fire({
          title: envs.CREDENCIALES_INCORRECTAS,
          text: envs.TEXT_INCOCREDENCIALES,
          icon: 'error',
        });
      } else {
        console.error('Error de inicio de sesión');
        Swal.fire({
          icon: 'error',
          title: envs.INICIOSESION_ERROR,
          text: envs.TEXT_INICIOSESION,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud de inicio de sesión',
        text: 'Hubo un error en la solicitud de inicio de sesión. Por favor, inténtelo de nuevo más tarde.',
      });
    }
  }

  return (
    <div className="fondo">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="colorddd p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Iniciar sesión</h1>
                        <p>Ingresar a la plataforma</p>
                      </div>
                      <br />
                      <div className="form-group">
                        <input
                          type="text"
                          id='txt_Usuario'
                          className="form-control form-control-user"
                          placeholder="Usuario"
                          value={USUARIO}
                          onChange={handleUsernameChange}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          id='txt_Contraseña'
                          className="form-control form-control-user"
                          placeholder="Contraseña"
                          value={PWD}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <br />
                      <button id='btn_IngresarLogin' className="btn" type="button" onClick={IngresarLogin}>
                        Ingresar
                      </button>
                      <br />
                      <div className="form-group" name="divlogo">
                        <br />
                        <center>
                          <img src={logo} alta="Logoc5" style={{ width: '40%', height: 'auto' }} alt="Logo" />
                        </center>
                        <br />
                        <center>
                          <h6>Sistema creado por el área de</h6>
                        </center>
                        <center>
                          <b>Desarrollo de Tecnologías del C5i de Hidalgo.</b>
                        </center>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
