//------ AFPA  ---------------------------------------------------------------
// Cavarec JB.
//------ AFPA ---------------------------------------------------------------
// chargement des modules 
const express = require('express'); // ==> consulter le site EXPRESS !!!! c'est riche d'informations
const fs = require("fs-extra");
const jsonfile = require('jsonfile');
const mysql = require('mysql2');
const app = express(); 

const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database : 'cinema3'
});


const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/', function(req, res) { 
    let donnees= jsonfile.readFileSync('ghibli.json');
    res.json({ ok : donnees });
})


app.get('/actors', function(req, res) { 
    connection.execute('SELECT * FROM actor', function(err, result) {
        if (err) {console.log(err);}
        console.log(result)
        res.json(result);
    });
})

app.post('/addactor', (req, res) => {
    
  
    // Requête SQL pour insérer l'acteur dans la base de données
    connection.execute('INSERT INTO actor (first_name, last_name) VALUES (?, ?)',
    [req.body.first_name,req.body.last_name],
    function (err) {
        if(err) {console.log(err);}
        res.json({ok : true});
    })
  });


app.get('/movies', function(req, res) { 
        connection.execute('SELECT * FROM movie', function(err, result) {
        if (err) {console.log(err);}
        res.json(result);
    })});


    app.get('/movie/:id', (req, res) => {
        const id = req.params.id;
      
        const query = `
          SELECT *
          FROM movie
          INNER JOIN director ON movie.director = director.id
          INNER JOIN genre ON movie.genre = genre.id
          INNER JOIN movie_actor ON movie.id = movie_actor.id_movie
          INNER JOIN actor ON movie_actor.id_actor = actor.id
          WHERE movie.id = ?
        `;
      
        connection.query(query, [id], (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send('Erreur lors de la récupération des données du film');
          } else {
            res.json(results);
          }
        });
      });






app.get('/ghibli', function(req, res) {
    fs.readFile("ghibli.json", function(err,films){
    var ret = JSON.parse(films)
        res.json({ films: ret });
    })
});

// pour récupéré un parametre du request. 
app.get('/ghibli/:id', function(req, res) {
    fs.readFile("ghibli.json", function(err,films) {
    var ret = JSON.parse(films) 
    res.json({ id:req.params.id, films:ret }) 
 })
})

// faire un formulaire dans vue qui fait un axios.post. 
app.post('/ghibli/create', function(req, res) {
    console.log(req.body)
    res.json(req.body)
})

app.listen(8082,() => console.log('le serveur écoute sur le port:8082'));