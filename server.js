'use strict';

export PORT=3000
Mac:     export DATABASE_URL=postgres://localhost:5432/books_app
Windows: export DATABASE_URL=postgres://postgres:postgresGB@localhost:5432/books_app

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
  client.query(`SELECT * from books_app;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('*', (req, res) => res.status(403).send('This route does not exist'));



app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));