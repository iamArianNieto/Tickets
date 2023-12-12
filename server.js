const express = require('express');
const session = require('express-session');
const sql = require('mssql');
const dbConfig = require('./dbConfig.js');
const cors = require('cors');
const multer = require('multer')
const path = require('path')
const { DateTime } = require('luxon');

const app = express();
app.use(cors(), express.json());

app.use(
  session({
    secret: '1234ES',
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  console.log(`Solicitud ${req.method} a ${req.url}`);
  next(); // Continúa con el manejo de la solicitud
});
// Configurar el middleware 
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads/documents')));

//recibir los datos a SQL Server 
app.get('/api/tickets', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .query(`SELECT T.*,P.Prioridad AS NombrePrioridad,S.Servicio AS NombreServicio,C.DESC_C4 AS NombreSubcentro, L.Status AS NombreEstatus 
              FROM TICKET T
              LEFT JOIN [dbo].[Prioridad]     P ON T.Prioridad = P.Id_prioridad
              LEFT JOIN [dbo].[TIPO_SERVICIO] S ON T.Servicio = S.ID_SERVICIO
              LEFT JOIN [dbo].[C4]            C ON T.Subcentro = C.ID_C4
              LEFT JOIN [dbo].[STATUS]        L ON T.Status = L.Id_status`);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los tickets:', error);
    res.status(500).json({ mensaje: 'Error al obtener los tickets. Por favor, inténtalo nuevamente.' });
  }
});

//JOIN para la lista de tickelist
app.post('/api/list', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const privilegio = req.headers['privilegio'];
    const subcentro = req.headers['subcentro'];
    const subarea = req.headers['area'];


    let consulta = "SELECT T.Folio,T.Nombre,Format(convert(date,T.Fecha,103),'yyyy-MM-dd') as Fecha,Format(convert(datetime,T.Hora,120),'HH:mm:ss') as Hora,T.Requerimiento,T.Status,T.Prioridad,T.Servicio,T.Archivo,T.Area,T.Subcentro,T.NUC,P.Prioridad AS NombrePrioridad,S.Servicio AS NombreServicio,C.DESC_C4 AS NombreSubcentro, L.Status AS NombreEstatus  ";
    consulta = consulta + " FROM TICKET T ";
    consulta = consulta + "LEFT JOIN [dbo].[Prioridad] P ON T.Prioridad = P.Id_prioridad ";
    consulta = consulta + " LEFT JOIN [dbo].[TIPO_SERVICIO] S ON T.Servicio = S.ID_SERVICIO";
    consulta = consulta + " LEFT JOIN [dbo].[C4] C ON T.Subcentro = C.ID_C4";
    consulta = consulta + " LEFT JOIN [dbo].[STATUS]        L ON T.Status = L.Id_status";
    consulta = consulta + "  WHERE T.Status IN (1, 2) ";

    switch (privilegio) {
      case '3':
        consulta = consulta + "AND T.Subcentro = '" + subcentro + "' ";

        break;
      case '4':
        consulta = consulta + "and T.Area = " + subarea + " ";
        break;
      case '5':
        consulta = consulta + "AND T.Subcentro = '" + subcentro + "' ";
        consulta = consulta + "and T.Area = " + subarea + " ";
        break;
      default:
        break;
    }
    consulta = consulta + " "



    const result = await pool
      .request().query(consulta);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los tickets:', error);
    res.status(500).json({ mensaje: 'Error al obtener los tickets. Por favor, inténtalo nuevamente.' });
  }
});

/*OBTIENE LOS NOMBRES DE LOS ID PARA CERRADOS*/
app.post('/api/listclose', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const privilegio = req.headers['privilegio'];
    const subcentro = req.headers['subcentro'];
    const subarea = req.headers['area'];


    let consulta = "SELECT T.Folio,T.Nombre,Format(convert(date,T.Fecha,103),'yyyy-MM-dd') as Fecha,Format(convert(datetime,T.Hora,120),'HH:mm:ss') as Hora,T.Requerimiento,T.Status,T.Prioridad,T.Servicio,T.Archivo,T.Area,T.Subcentro,T.NUC,P.Prioridad AS NombrePrioridad,S.Servicio AS NombreServicio,C.DESC_C4 AS NombreSubcentro, L.Status AS NombreEstatus  ";
    consulta = consulta + " FROM TICKET T ";
    consulta = consulta + "LEFT JOIN [dbo].[Prioridad] P ON T.Prioridad = P.Id_prioridad ";
    consulta = consulta + " LEFT JOIN [dbo].[TIPO_SERVICIO] S ON T.Servicio = S.ID_SERVICIO";
    consulta = consulta + " LEFT JOIN [dbo].[C4] C ON T.Subcentro = C.ID_C4";
    consulta = consulta + " LEFT JOIN [dbo].[STATUS]        L ON T.Status = L.Id_status";
    consulta = consulta + "  WHERE T.Status = 3 ";

    switch (privilegio) {
      case '3':
        consulta = consulta + "AND T.Subcentro = '" + subcentro + "' ";

        break;
      case '4':
        consulta = consulta + "and T.Area = " + subarea + " ";
        break;
      case '5':
        consulta = consulta + "AND T.Subcentro = '" + subcentro + "' ";
        consulta = consulta + "and T.Area = " + subarea + " ";
        break;
      default:
        break;
    }
    consulta = consulta + " "

    const result = await pool
      .request().query(consulta);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al cerrar el ticket:', error);
    res.status(500).json({ mensaje: 'Error al ocerrar el ticket. Por favor, inténtalo nuevamente.' });
  }
});

//Guarda la imagen en cierta carpeta
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determina el directorio de destino 
    let uploadPath;
    if (file.originalname.match(/\.(pdf|docx)$/)) {// Verifica la extensión es PDF o DOCX
      uploadPath = path.join(__dirname, 'uploads', 'documents');
    } else if (file.originalname.match(/\.(png|jpg|jpeg)$/)) {// Verifica la extensión es PNG, JPG o JPEG
      uploadPath = path.join(__dirname, 'uploads', 'images');
    } else {
      uploadPath = path.join(__dirname, 'uploads');// En caso contrario, guárdalo en una carpeta general
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Obtiene los dos últimos dígitos del año
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    cb(null, formattedDate + '-' + file.originalname);
  },
});

const upload = multer({ storage });

/*INSERTA LOS TICKETS*/
app.post('/api/tickets', upload.single('file'), async (req, res) => {
  try {
    const StatusValorPredeterminado = 1;

    const Subcentro = req.body.Subcentro;
    const usuarioArea = req.body.Area;

    //Nombre del usuario 
    const usuarioNombre = req.body.Nombre;

    const pool = await sql.connect(dbConfig);

    // Obtener el folio 
    const sql_Folio = "EXEC GetFolio '" + Subcentro + "'";
    const result1 = await pool.request().query(sql_Folio);
    const Folio = result1.recordset[0].Folio_Nuevo;

    const nextTicketID = Folio;
    console.log('Siguiente número de ticket:', nextTicketID);

    const { Requerimiento } = req.body;
    const Archivo = req.file ? req.file.filename : '';

    const Servicio = parseInt(req.body.Servicio, 10);
    const Prioridad = parseInt(req.body.Prioridad, 10);

    const FechaCreacion = DateTime.now().setZone('America/Mexico_City');

    // Convierte la fecha y hora al huso horario de Pachuca, Hidalgo
    const FechaHoraPachuca = FechaCreacion.setZone('America/Mexico_City', { keepLocalTime: true });
    const Fecha = FechaHoraPachuca.toISODate();
    const Hora = FechaHoraPachuca.toISOTime({ includeOffset: false });

    console.log('Fecha:', Fecha);
    console.log('Hora:', Hora);

    const result = await pool
      .request()
      .input('Folio', sql.NVarChar, nextTicketID)
      .input('Nombre', sql.NVarChar, usuarioNombre)
      .input('Subcentro', sql.NVarChar, Subcentro)
      .input('Servicio', sql.Int, Servicio)
      .input('Prioridad', sql.Int, Prioridad)
      .input('Requerimiento', sql.NVarChar(sql.MAX), Requerimiento)
      .input('Status', sql.Int, StatusValorPredeterminado)
      .input('Archivo', sql.NVarChar, Archivo)
      .input('Area', sql.NVarChar, usuarioArea)
      .input('Fecha', sql.Date, Fecha)
      .input('Hora', sql.VarChar, Hora)
      .query('INSERT INTO TICKET (Folio,Nombre,Subcentro, Servicio, Prioridad, Requerimiento,Status, Archivo, Area,Fecha,Hora) VALUES (@Folio,@Nombre,@Subcentro,@Servicio,@Prioridad,@Requerimiento,@Status,@Archivo,@Area,@Fecha,@Hora)');
    res.json({ mensaje: 'Ticket creado exitosamente', folio: nextTicketID });

  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).json({ mensaje: 'Error al crear el ticket. Por favor, inténtalo nuevamente.' });
  }
});

//Agregar un nuevo servicio a la BD de TIPO_SERVICIO pero con banderas y siglas
app.post('/api/servicios', async (req, res) => {
  try {
    const { NombreServicio, Bandera, Sigla } = req.body;

    const pool = await sql.connect(dbConfig);
    const siglaString = Sigla.join(',');

    // Inserta en la tabla TIPO_SERVICIO
    const result = await pool
      .request()
      .input('SERVICIO', sql.NVarChar, NombreServicio)
      .input('BANDERA', sql.NVarChar, Bandera)
      .input('SIGLA', sql.NVarChar, siglaString)
      .query('INSERT INTO TIPO_SERVICIO (SERVICIO, BANDERA, SIGLA) VALUES (@SERVICIO, @BANDERA, @SIGLA)');

    res.json({ mensaje: 'Servicio creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ mensaje: 'Error al crear el servicio. Por favor, inténtalo nuevamente.' });
  }
});

//API PARA MANDAR COMO PARAMETRO ID_SERVICIO 
app.post('/api/obtenerTipoServicio', async (req, res) => {
  console.log('Llegó a la ruta /api/obtenerTipoServicio');

  try {
    const { ID_SERVICIO } = req.body;

    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input('ID_SERVICIO', sql.Int, ID_SERVICIO)
      .query('SELECT * FROM TIPO_SERVICIO WHERE ID_SERVICIO = @ID_SERVICIO');

    const tipoServicio = result.recordset[0];
    res.json(tipoServicio);
  } catch (error) {
    console.error('Error al obtener el tipo de servicio:', error);
    res.status(500).json({ mensaje: 'Error al obtener el tipo de servicio. Por favor, inténtalo nuevamente.' });
  }
});

//recibir los datos a SQL Server DE SERVICIOS ESPECIFICOS
app.get("/api/servicios", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const serviciosResult = await pool
      .request()
      .query("SELECT ID_SERVICIO,SERVICIO FROM TIPO_SERVICIO ORDER BY ID_SERVICIO ASC");
    const servicios = serviciosResult.recordset.map((row) => ({
      id: row.ID_SERVICIO,
      nombre: row.SERVICIO,
    }));

    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de servicios.");
  }
});

app.get("/api/verificar-servicio/:nombreServicio", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const nombreServicio = req.params.nombreServicio.toUpperCase();

    const result = await pool
      .request()
      .input("nombreServicio", sql.NVarChar, nombreServicio)
      .query("SELECT TOP 1 1 AS existe FROM TIPO_SERVICIO WHERE UPPER(SERVICIO) = @nombreServicio");

    const existe = result.recordset.length > 0;
    res.json({ existe });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al verificar el servicio.");
  }
});

//recibir los datos a SQL Server DE SUBCENTRO
app.get("/api/subcentro", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const subcentroResult = await pool
      .request()
      .query("SELECT ID_C4,DESC_C4 FROM C4 ORDER BY ID_C4 ASC");

    const subcentros = subcentroResult.recordset.map((row) => ({
      id: row.ID_C4,
      nombre: row.DESC_C4,
    }));


    res.json(subcentros);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de SubCentro.");
  }
});

//recibir los datos a SQL Server DE SERVICIOS GENERALES 
app.get("/api/serviciosGenerales", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const serviciosGeneralesResult = await pool
      .request()
      .query("SELECT Sigla,Funcion FROM CAT_SERVICIOGENERAL");
    const servicios = serviciosGeneralesResult.recordset.map((row) => ({
      id: row.Sigla,
      nombre: row.Funcion,
    }));

    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de servicios.");
  }
});

//recibir los datos a SQL Server DE PRIORIDADES 
app.get("/api/prioridades", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const prioridadesResult = await pool
      .request()
      .query("SELECT Id_prioridad,Prioridad FROM Prioridad ORDER BY Id_prioridad ASC");
    const prioridades = prioridadesResult.recordset.map((row) => ({
      id: row.Id_prioridad,
      nombre: row.Prioridad,
    }));

    res.json(prioridades);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de servicios.");
  }
});

//ENVIAR LAS NOTAS DE RESPUESTA A LOS TICKETS
app.post('/api/send-note', async (req, res) => {
  try {
    const { folio, notes } = req.body;
    console.log('Cuerpo de la solicitud:', req.body);

    //Nombre del usuario 
    const usuarioNombre = req.headers['usuario-nombre'];
    const nombreArray = usuarioNombre.split(' ');
    const nombre = nombreArray[0];
    const primerApellido = nombreArray.slice(1).join(' ');
    const Nombre = `${nombre} ${primerApellido}`.substring(0, 15);


    // Obtén la fecha y hora actuales
    const FechaCreacion = DateTime.now().setZone('America/Mexico_City');

    // Convierte la fecha y hora al huso horario de Pachuca, Hidalgo
    const FechaHoraPachuca = FechaCreacion.setZone('America/Mexico_City', { keepLocalTime: true });
    const Fecha = FechaHoraPachuca.toISODate();
    const Hora = FechaHoraPachuca.toISOTime({ includeOffset: false });

    console.log('Fecha:', Fecha);
    console.log('Hora:', Hora);

    const statusPendiente = 2;

    // Guarda la nota en la tabla CONTESTACION
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input('FOLIO', sql.VarChar, folio)
      .input('FECHA', sql.Date, Fecha)
      .input('HORA', sql.VarChar, Hora)
      .input('CONTESTACION', sql.Text, notes)
      .input('P_SISTEMAS', sql.Text, Nombre)
      .input('STATUS', sql.Int, statusPendiente)
      .query('INSERT INTO CONTESTACION (FOLIO, FECHA, HORA, CONTESTACION,P_SISTEMAS, STATUS) OUTPUT INSERTED.ID_CONTESTACION VALUES (@FOLIO, @FECHA, @HORA, @CONTESTACION,@P_SISTEMAS, @STATUS)');
    // Obtener el ID de la fila insertada
    const insertedID = result.recordset[0].ID_CONTESTACION;
    console.log('ID de la fila insertada:', insertedID);
    // Actualiza el estatus del ticket a 'Pendiente'
    await pool
      .request()
      .input('FOLIO', sql.VarChar, folio)
      .input('STATUS', sql.Int, statusPendiente)
      .query('UPDATE TICKET SET Status = @STATUS WHERE Folio = @FOLIO');

    console.log('Nota guardada correctamente en la base de datos.');

    res.json({ mensaje: 'Nota enviada exitosamente y estatus actualizado a Pendiente.' });
  } catch (error) {
    console.error('Error al enviar la nota:', error);
    res.status(500).json({ mensaje: 'Error al enviar la nota. Por favor, inténtalo nuevamente.' });
  }
});

/*ACTUALIZAR LAS TABLAS TIKCET Y CONTESTACION CUANDO SE CIERRA EL TICKET*/
app.put('/api/updateTicketStatus/:folio', async (req, res) => {
  try {
    const folio = req.params.folio;
    const usuarioNombre = req.headers['usuario-nombre'];
    const nombreArray = usuarioNombre.split(' ');
    const nombre = nombreArray[0];
    const primerApellido = nombreArray.slice(1).join(' ');
    const Nombre = `${nombre} ${primerApellido}`.substring(0, 15);

    const contestationText = `Ticket cerrado por ${req.headers['usuario-nombre']}`;

    // Obtén la fecha y hora actuales
    const FechaCreacion = DateTime.now().setZone('America/Mexico_City');

    // Convierte la fecha y hora al huso horario de Pachuca, Hidalgo
    const FechaHoraPachuca = FechaCreacion.setZone('America/Mexico_City', { keepLocalTime: true });
    const Fecha = FechaHoraPachuca.toISODate();
    const Hora = FechaHoraPachuca.toISOTime({ includeOffset: false });

    console.log('Fecha:', Fecha);
    console.log('Hora:', Hora);

    const newStatusId = 3;

    const pool = await sql.connect(dbConfig);

    const ticketUpdateResult = await pool
      .request()
      .input('Folio', sql.VarChar, folio)
      .input('Status', sql.Int, newStatusId)
      .query('UPDATE TICKET SET Status = @Status WHERE Folio = @Folio');

    const result = await pool
      .request()
      .input('FOLIO', sql.VarChar, folio)
      .input('FECHA', sql.Date, Fecha)
      .input('HORA', sql.VarChar, Hora)
      .input('CONTESTACION', sql.Text, contestationText)
      .input('P_SISTEMAS', sql.Text, Nombre)
      .input('STATUS', sql.Int, newStatusId)
      .query('INSERT INTO CONTESTACION (FOLIO, FECHA, HORA, CONTESTACION,P_SISTEMAS, STATUS) OUTPUT INSERTED.ID_CONTESTACION VALUES (@FOLIO, @FECHA, @HORA, @CONTESTACION,@P_SISTEMAS, @STATUS)');


    res.status(200).json({ message: 'Ticket cerrado y contestación agregada exitosamente.' });
  } catch (error) {
    console.error('Error al cerrar el ticket y agregar contestación:', error);
    res.status(500).json({ error: 'Error al cerrar el ticket y agregar contestación.' });
  } finally {
    // Asegurarse de cerrar la conexión a la base de datos
    await sql.close();
  }
});

/*MOSTRAR LOS TICKET CERRADOS*/
app.get('/api/closedTickets', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .query(`
      SELECT *
      FROM TICKET
      WHERE Status = 3;
    `);

    res.json({ success: true, closedTickets: result.recordset });
  } catch (error) {
    console.error('Error al obtener los tickets cerrados:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // Cerrar la conexión a la base de datos
    await sql.close();
  }
});

/*MUESTRA LAS NOTAS DE CADA FOLIO*/
app.get('/api/load-notes/:folio', async (req, res) => {
  try {
    const { folio } = req.params;
    const pool = await sql.connect(dbConfig);

    const sql_query = "SELECT ID_CONTESTACION,FOLIO,Format(convert(date,FECHA,103),'yyyy-MM-dd') as FECHA,Format(convert(datetime,HORA,120),'HH:mm:ss') as HORA,CONTESTACION,P_SISTEMAS,STATUS,IMAGEN FROM CONTESTACION WHERE FOLIO = '" + folio + "' ORDER BY FECHA DESC, HORA DESC "

    const result = await pool
      .request()
      .input('folio', sql.VarChar, folio)
      .query(sql_query);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las notas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las notas. Por favor, inténtalo nuevamente.' });
  }
});

/*CONTAR EL NUMERO DE TICKET DIARIOS*/
app.get('/api/numero-registros', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query`SELECT CAST(Fecha AS DATE) AS Fecha, SELECT COUNT(*) AS NumeroDeRegistros FROM TICKET GROUP BY CAST(Fecha AS DATE) HAVING CAST(Fecha AS DATE) = @Fecha `;
    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener el número de registros:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await sql.close();
  }
});

/*STORE PROCEDURE PARA OBTENER LOS TICKETS DIARIOS*/
app.post('/api/tickets/daily', async (req, res) => {
  let pool;

  try {
    pool = await sql.connect(dbConfig);

    const privilegio = req.headers['privilegio'];
    const subcentro = req.headers['subcentro'];
    const subarea = req.headers['area'];

    const sql_Diario = "EXEC GetDailyTicketData '" + privilegio + "','" + subcentro + "','" + subarea + "' "
    console.log("privilegio diario: " + privilegio + subcentro + subarea);
    const result = await pool
      .request()
      .query(sql_Diario);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener datos diarios:', error);

    // Capturar errores específicos de SQL
    if (error.code === 'ESOCKET') {
      console.error('Error de conexión a la base de datos:', error.message);
      res.status(500).send('Error de conexión a la base de datos');
    } else {
      res.status(500).send('Error interno del servidor');
    }
  } finally {
    // Cierra la conexión solo si se estableció con éxito
    if (pool && pool.connected) {
      sql.close();
    }
  }
});

/*STORE PROCEDURE PARA OBTENER LOS TICKETS MENSUALES*/
app.post('/api/tickets/monthly', async (req, res) => {
  let pool;

  try {
    pool = await sql.connect(dbConfig);

    const privilegio = req.headers['privilegio'];
    const subcentro = req.headers['subcentro'];
    const subarea = req.headers['area'];

    const sql_Mes = "EXEC GetMonthlyTicketData '" + privilegio + "','" + subcentro + "','" + subarea + "' "
    console.log("privilegio mensual: " + privilegio + subcentro + subarea);

    const result = await pool
      .request()
      .query(sql_Mes);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener datos mensuales:', error);

    // Capturar errores específicos de SQL
    if (error.code === 'ESOCKET') {
      console.error('Error de conexión a la base de datos:', error.message);
      res.status(500).send('Error de conexión a la base de datos');
    } else {
      res.status(500).send('Error interno del servidor');
    }
  } finally {
    // Cierra la conexión solo si se estableció con éxito
    if (pool && pool.connected) {
      sql.close();
    }
  }
});

/*STORE PROCEDURE PARA OBTENER LOS TICKETS ANUALES*/
app.post('/api/tickets/yearly', async (req, res) => {
  let pool;

  try {
    pool = await sql.connect(dbConfig);

    const privilegio = req.headers['privilegio'];
    const subcentro = req.headers['subcentro'];
    const subarea = req.headers['area'];

    const sql_Anio = "EXEC GetYearlyTicketData '" + privilegio + "','" + subcentro + "','" + subarea + "' "
    console.log("privilegio anual: " + privilegio + subcentro + subarea);
    const result = await pool
      .request()
      .query(sql_Anio);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener datos anuales:', error);


    // Capturar errores específicos de SQL
    if (error.code === 'ESOCKET') {
      console.error('Error de conexión a la base de datos:', error.message);
      res.status(500).send('Error de conexión a la base de datos');
    } else {
      res.status(500).send('Error interno del servidor');
    }
  } finally {
    // Cierra la conexión solo si se estableció con éxito
    if (pool && pool.connected) {
      sql.close();
    }
  }
});

/*STORE PROCEDURE PARA OBTENER LOS TICKETS TOTALES*/
app.post('/api/tickets/total', async (req, res) => {
  let pool;

  try {
    pool = await sql.connect(dbConfig);

    const privilegio = req.headers['privilegio'];
    const subcentro = req.headers['subcentro'];
    const subarea = req.headers['area'];

    const sql_Total = "EXEC GetTotalTicketData '" + privilegio + "','" + subcentro + "','" + subarea + "' "
    console.log("privilegio total: " + privilegio + subcentro + subarea);
    const result = await pool
      .request()
      .query(sql_Total);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener el total de datos:', error);

    // Capturar errores específicos de SQL
    if (error.code === 'ESOCKET') {
      console.error('Error de conexión a la base de datos:', error.message);
      res.status(500).send('Error de conexión a la base de datos');
    } else {
      res.status(500).send('Error interno del servidor');
    }
  } finally {
    // Cierra la conexión solo si se estableció con éxito
    if (pool && pool.connected) {
      sql.close();
    }
  }
});

/*GUARDAR LOS DATOS DE LOS USUARIOS CON BANDERA 3 (ESPECIAL)*/
app.post('/api/guardarUsuarios', async (req, res) => {
  try {
    const { usuarios } = req.body;
    const pool = await sql.connect(dbConfig);


    for (const usuario of usuarios) {
      console.log('Usuario a insertar:', usuario);

      await pool.request()
        .input('Nombre', sql.NVarChar, usuario.Nombre)
        .input('Ape_paterno', sql.NVarChar, usuario.Ape_paterno)
        .input('Ape_materno', sql.NVarChar, usuario.Ape_materno)
        .input('Id_subcentro', sql.NVarChar, usuario.Id_subcentro)
        .input('Celular', sql.NVarChar, usuario.Celular)
        .input('Bandera', sql.Int, usuario.Bandera)
        .input('Id_servicio', sql.NVarChar, usuario.Id_servicio)
        .query(`
          INSERT INTO CAT_USUARIOESPECIAL
          (Celular, Nombre, Ape_paterno, Ape_materno, Id_subcentro,Bandera,Id_servicio)
          VALUES
          (@Celular, @Nombre, @Ape_paterno, @Ape_materno, @Id_subcentro,@Bandera, (SELECT TOP 1 ID_SERVICIO FROM TIPO_SERVICIO WHERE SERVICIO =@Id_servicio))
        `);
      console.log('Usuario a insertar:', usuario);
    }

    // Cerrar la conexión a la base de datos
    await pool.close();

    res.status(200).json({ message: 'Usuarios guardados exitosamente.' });
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.get('/api/guardarUsuarios', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .query(`
      SELECT *
      FROM CAT_USUARIOESPECIAL;
    `);

    res.json({ success: true, closedTickets: result.recordset });
  } catch (error) {
    console.error('Error al obtener los tickets cerrados:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // Cerrar la conexión a la base de datos
    await sql.close();
  }
});

//Puerto que debe de estar escuchando SQL
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

module.exports = app;