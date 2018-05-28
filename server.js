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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT * FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  let SQL = `SELECT * FROM books WHERE book_id =$1`;
  let value = [req.params.id];
  console.log('NOTICE ME ', req.params);
  client.query(SQL, value)
    .then(results => {
      console.log(results.rows);
      res.send(results.rows);
    })
    .catch(console.error);
});

// double check this add later
app.post('/api/v1/books', (req, res) => {
  let SQL = `INSERT INTO books(author, title, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`;

  let values = [req.body.author, req.body.title, req.body.isbn, req.body.image_url, req.body.description];
  client.query(SQL, values)
    .then(() => res.send('insertion complete'))
    .catch(console.error);
});

app.put('/api/v1/books/:id', (req, res) => {
  let { title, author, isbn, image_url, description } = req.body;
  client.query(`
    UPDATE books
    SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5
    WHERE book_id=$6`,
  [title, author, isbn, image_url, description, req.params.id]
  )
    .then(() => res.send('updated'))
    .catch(console.error);
});


app.delete('/api/v1/books/:id', (request, response) => {
  let SQL = `DELETE FROM books WHERE book_id=$1;`;
  let values = [request.params.id];
  client.query(SQL, values)
    .then(() => response.send('Delete complete'))

  let values = [req.body.author, req.body.title, req.body.isbn,req.body.image_url, req.body.description];
  client.query( SQL, values)
    .then(() => res.sendStatus(204))
    .catch(console.error);
});

app.delete('/api/v1/books/:id', (req, res) => {
  let SQL = `DELETE FROM books WHERE book_id=$1;`;
  let values = [req.params.id];
  client.query( SQL, values )
    .then(() => res.sendStatus(204))

    .catch(console.error);
});

app.put('/api/v1/books/:id', (req, res) => {
  let SQL = 'UPDATE books SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5 WHERE book_id=$6;';
  let values = [req.body.author, req.body.title, req.body.isbn,req.body.image_url, req.body.description, req.params.id];

  client.query(SQL, values)
    .then(() => res.sendStatus(204))
    .catch(console.error);

});

app.get('*', (req, res) => res.status(403).send('This route does not exist'));



app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));