//////////
// Express App Setup
//////////
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
//////////

//////////
// Postgres Client Setup
//////////
const { Client } = require('pg');
const pgClient = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});
setTimeout(() => pgClient.connect(), 2500);

(async () => {
  try {
    await pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)');
  } catch (e) {
    console.log(e);
  }
})();
//////////

//////////
// Redis Client Setup
//////////
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
const redisPublisher = redisClient.duplicate();
//////////

app.get('/api', (req, res) => {
  res.send('hi');
});

app.get('/api/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/api/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/api/values', async (req, res) => {
  const value = req.body.value;
  if (parseInt(value) > 40) {
    return res.status(422).send('Value too high');
  }
  redisClient.hset('values', value, 'nothing yet!');
  redisPublisher.publish('insert', value);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [value]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('Listening!');
});
