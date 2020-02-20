const express = require("express");
const nunjucks = require("nunjucks");
const config = require("./config");

const server = express();

server.use(express.static('public'));
server.use(express.urlencoded({extended: true}));


const Pool = require('pg').Pool;
const db = new Pool({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    database: config.database
});

nunjucks.configure("./", {
    express: server,
    noCache: true
});

server.get("/", function (request, response){

    db.query("SELECT * FROM donors", (err, result) => {
        if(err) return response.send("Erro no banco de dados.");

        const donors = result.rows;
        return response.render("index.html", { donors })
    });

});

server.post("/", function (request , response) {
    const name =  request.body.name;
    const email =  request.body.email;
    const blood =  request.body.blood;

    if(name === "" || email === "" || blood === ""){
        return response.send("Todos os campos são obrigatórios.")
    }

    const query =
        `INSERT INTO donors ("name","email","blood") 
         VALUES ($1, $2, $3)`;

    const values = [name, email, blood];

    db.query(query, values, (err) => {
        if(err) return response.send("erro no banco de dados");

        return response.redirect("/");
    });



});
server.listen(3000, () => console.log("server start"));