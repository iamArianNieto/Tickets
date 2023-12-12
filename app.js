/* const express = require("express")
const collection = require("./mongo")
const cors = require("cors")

//Inicialiacion
const app = express()

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors())



app.get("/",cors(),(req,res)=>{

})


app.post("/",async(req,res)=>{
    const{centro,servicio,prioridad,descripcion}=req.body //datos de validacion
    res.json("notexist")

})

app.post("/tickets",async(req,res)=>{
    const{centro,servicio,prioridad,descripcion}=req.body

    const data={
        centro:centro,
        servicio:servicio,
        prioridad:prioridad,
        descripcion:descripcion
    }
    try {
        await collection.insertMany([data]);
        res.json("success"); 
        console.log("datos en mongodb")
    } catch (e) {
        console.error('Error al insertar datos en MongoDB:', e);
        res.json("fail");
    }
    console.log('Contenido de req.body:', req.body);

})

app.listen(8000,()=>{
    console.log("Puerto conectado");
})

 */