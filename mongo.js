/* const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/stc5i")
.then(()=>{
    console.log("mongodb conectado");
})
.catch(()=>{
    console.log('Falló la conexión');
})


const newSchema=new mongoose.Schema({
    centro:{
        type:String,
        required:true
    },
    servicio:{
        type:String,
        required:true
    },
    prioridad:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true
    }
})

const collection = mongoose.model("collection",newSchema)

module.exports=collection */