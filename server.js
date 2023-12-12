process.env.TZ = 'America/Mexico_City';
const express = require('express');
const sql = require('mssql');
const dbConfig = require('./dbConfig.js');
const cors = require('cors');
const multer = require('multer')
const path = require('path')


const app = express();
app.use(cors(), express.json());

//recibir los datos a SQL Server DE PRUEBA
app.get('/api/tickets', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query('SELECT * FROM prueba');

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los tickets:', error);
    res.status(500).json({ mensaje: 'Error al obtener los tickets. Por favor, inténtalo nuevamente.' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determina el directorio de destino 
    let uploadPath;
    if (file.originalname.match(/\.(pdf|docx)$/)) {
      // Verifica la extensión es PDF o DOCX
      uploadPath = path.join(__dirname, 'uploads', 'documents');
    } else if (file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // Verifica la extensión es PNG, JPG o JPEG
      uploadPath = path.join(__dirname, 'uploads', 'images');
    } else {
      // En caso contrario, guárdalo en una carpeta general
      uploadPath = path.join(__dirname, 'uploads');
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); //sufijo aleatorio
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.post('/api/tickets', upload.single('file'), async (req, res) => {
  try {
    const { centro, servicio, prioridad, descripcion } = req.body;
    const imagen = req.file ? req.file.filename : ''; // Obtiene el nombre del archivo subido
    const FechaCreacion = new Date();

    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input('centro', sql.NVarChar, centro)
      .input('servicio', sql.NVarChar, servicio)
      .input('prioridad', sql.NVarChar, prioridad)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('imagen', sql.NVarChar, imagen)
      .input('FechaCreacion', sql.DateTime, FechaCreacion)
      .query('INSERT INTO prueba (centro, servicio, prioridad, descripcion, imagen,FechaCreacion) VALUES (@centro, @servicio, @prioridad, @descripcion, @imagen, @FechaCreacion)');

    res.json({ mensaje: 'Ticket creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).json({ mensaje: 'Error al crear el ticket. Por favor, inténtalo nuevamente.' });
  }
});

//recibir los datos a SQL Server DE SUBCENTRO
app.get("/api/subcentro", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const subcentroResult = await pool.request().query("SELECT NombreSubcentro FROM SubCentro ORDER BY IDSubcentro ASC");
    const subcentros = subcentroResult.recordset.map((row) => row.NombreSubcentro);

    res.json({ subcentros });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de SubCentro.");
  }
});

//recibir los datos a SQL Server DE SERVICIOS
app.get("/api/servicios", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const serviciosResult = await pool.request().query("SELECT NombreServicio FROM Servicio");
    const servicios = serviciosResult.recordset.map((row) => row.NombreServicio);

    res.json({ servicios });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de servicios.");
  }
});

//recibir los datos a SQL Server DE PRIORIDADES 
app.get("/api/prioridades", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const prioridadesResult = await pool.request().query("SELECT NombrePrioridad FROM Prioridad ORDER BY IDPrioridad ASC");
    const prioridades = prioridadesResult.recordset.map((row) => row.NombrePrioridad);

    res.json({ prioridades });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los datos de servicios.");
  }
});



//Puerto que debe de estar escuchando SQL
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

module.exports = app;