const express = require('express');
const app = express();
const PORT = 3000;
const { guardarCandidato, lista, editCandidato, eliminarCandidato, registrarVotos, getHistorial } = require('./helpers/consultas')

app.use(express.json());

app.listen(PORT, console.log(`Servidor disponible en http://localhost:${PORT}`));

app.get('/', (req,res)=>{
    res.sendFile(`${__dirname}/index.html`)
});

app.post('/candidato', async(req,res) => {
    try {
        const candidato = req.body;
        const resultado = await guardarCandidato(candidato);
        res.json(resultado)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/candidatos', async(req,res) => {
    try {
        const resp = await lista();
    res.json(resp)    
    } catch (error) {
        res.status(500).send(error)
    }    
})

app.put('/candidato', async (req,res)=> {
    try {
        const candidato = req.body
        const resultado = await editCandidato(candidato);
        res.status(201).json(resultado)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete('/candidato', async (req,res)=> {
    try {
        const { id } = req.query;
        await eliminarCandidato(id);
        res.send("Candidato eliminado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/votos', async(req,res)=> {
    try {
        const voto = req.body;
        const resultado = await registrarVotos(voto);
        res.status(201).json(resultado)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/historial', async(req,res)=> {
    try {
        const historial = await getHistorial();
        res.json(historial)
    } catch (error) {
        res.status(500).send(error)
    }
})