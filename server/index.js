const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app =  express()
const mysql = require('mysql')
const { restart } = require('nodemon')


const db = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: '',
    database: "crud",
});

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/api/get/res",(req, res)=>{
    const sqlSelect = 
    "SELECT *  FROM movie_reviews";
    db.query(sqlSelect, (err, result)=>{
        res.send(result)
       console.log(result)
    })

})

app.post("/api/insert", (req, res)=>{
     const movieName = req.body.movieName;
     const movieReview = req.body.movieReview;

     const sqlInsert = 
     "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)";
     db.query(sqlInsert, [movieName, movieReview], (err, result)=>{
        console.log(result)
     });
});

app.delete('/api/delete/:movieReview', (req, res)=>{
    const name = req.params.movieReview;
    const sqldelete = "DELETE FROM movie_reviews WHERE movieReview = ?";
    db.query(sqldelete, name, (err, result)=>{
        if (err) console.log(err);
     });

});

app.put('/api/update', (req, res)=>{
    const name = req.body.movieName;
    const review = req.body.movieReview;
    const sqlUpdate = "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?";
    db.query(sqlUpdate, [review, name], (err, result)=>{
        if (err) console.log(err);
     });

});

app.get('/', (req, res) => {
    res.send("hello world")
});

app.listen(3001,()=>{
    console.log("running on port 3001");
}
);