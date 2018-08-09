const keys = require('./keys');
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
// Postgres Client Setup
//////////
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

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
  retry_strategy: () => 1000,
  host: keys.redisHost,
  port: keys.redisPort
});
const redisPublisher = redisClient.duplicate();
//////////

app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
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
