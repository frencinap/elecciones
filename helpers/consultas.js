const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    database: 'elecciones',
    host: 'localhost',
    password: '', //completar con password
    port: 5432
})

const guardarCandidato = async(candidato) => {
    const values = Object.values(candidato);
    const consulta = {
        text: "INSERT INTO candidatos (nombre, foto, color, votos) VALUES ($1, $2, $3, 0)",
        values
    };
    const resp = await pool.query(consulta);
    return resp;
}

const lista = async() => {
    const sql = "SELECT * FROM candidatos";
    const resp = await pool.query(sql);
    return resp.rows;
}

const editCandidato = async( candidato ) => {
    const values = Object.values(candidato);
    const consulta = {
        text: "UPDATE candidatos SET nombre = $1, foto= $2 WHERE id= $3 RETURNING *",
        values    
    }
    const resp = await pool.query(consulta);
    return resp.rows;
}

const eliminarCandidato = async(id)=> {
    const { rows } = await pool.query(`DELETE FROM candidatos WHERE id = ${id}`);
    return rows;
}

/////////////CONSULTAS DE VOTOS ///////////////////////

const registrarVotos = async(voto) => {
    const values = Object.values(voto);
    const consultaVotos = {
        text: "INSERT INTO historial (estado,votos, ganador) VALUES ($1, $2, $3)",
        values
    }
    const consultaRegistro = {
        text: "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2",
        values: [Number(values[1]), values[2]]
    }
    //transaccion
    try {
        await pool.query("BEGIN");
        await pool.query(consultaVotos);
        await pool.query(consultaRegistro);
        await pool.query("COMMIT");
        //para que el servidor reconozca la trasaccion como exitosa
        return true
    } catch (error) {
        await pool.query("ROLLBACK");
        throw error
    }
}

const getHistorial = async() => {
    const consulta = {
        text: "SELECT * FROM historial",
        rowMode: "array"
    }

    const resultado = await pool.query(consulta);
    return resultado.rows
}

module.exports = { guardarCandidato, lista, editCandidato, eliminarCandidato, registrarVotos, getHistorial } 