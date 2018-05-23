'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;


const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/books', (req, res) => {
  client.query(`SELECT * FROM books_app;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  let SQL = `SELECT * FROM books_app WHERE book_id =$1`;
  let value = [req.params.id];
  console.log('NOTICE ME ', req.params);
  client.query(SQL, value)
    .then(results => {
      console.log(results.rows);
      res.send(results.rows);
    })
    .catch(console.error);
});

app.get('*', (req, res) => res.status(403).send('This route does not exist'));



app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));