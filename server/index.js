const util = require('util');
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()
const mysql = require('mysql')
const { restart } = require('nodemon')
const multer = require('multer')
const path = require('path');


const db = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: '',
    database: "crud",
});

db.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
      }
    }
  
    if (connection) connection.release();
  
    return;
  });
  
  // Promisify for Node.js async/await.
  db.query = util.promisify(db.query);

  app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public_html/', 'uploads'),
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
app.post('/imageupload', async (req, res) => {
    try {

        let upload = multer({ storage: storage }).single('avatar');

        upload(req, res, function (err) {

            if (!req.file) {
                return res.send('Please select an image to upload');
            }
            else if (err instanceof multer.MulterError) {
                return res.send(err);
            }
            else if (err) {
                return res.send(err);
            }

            const classifiedsadd = {
                image: req.file.filename
            };
            const sql = "INSERT INTO movie_reviews SET ?";
            db.query(sql, classifiedsadd, (err, results) => {
                if (err) throw err;
                res.json({ success: 1 })

            });

        });

    } catch (err) { console.log(err) }
})

app.get("/api/get", (req, res) => {
    const sqlSelect =
        "SELECT * FROM movie_reviews";
    db.query(sqlSelect, (err, result) => {
        res.send(result)
        console.log(result)
    })

})

app.post("/api/insert", (req, res) => {
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const sqlInsert =
        "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)";
    db.query(sqlInsert, [movieName, movieReview], (err, result) => {
        console.log(result)
    });
});

app.delete('/api/delete/:movieName', (req, res) => {
    const name = req.params.movieName;
    const sqldelete = "DELETE FROM movie_reviews WHERE movieName = ?";
    db.query(sqldelete, name, (err, result) => {
        if (err) console.log(err);
    });

});

app.put('/api/update', (req, res) => {
    const name = req.body.movieName;
    const review = req.body.movieReview;
    const sqlUpdate = "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?";
    db.query(sqlUpdate, [review, name], (err, result) => {
        if (err) console.log(err);
    });

});

app.get('/', (req, res) => {
    res.send("hello world")
});

app.listen(3001, () => {
    console.log("running on port 3001");
}
);