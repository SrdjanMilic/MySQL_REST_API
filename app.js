const express = require('express');
const app = express();
const router = express.Router();
const database = require('./modules/db-handler');
const cors = require('cors');
const port = process.env.PORT;
const user = require('./controllers/user-controller');
const envSettings = require('./modules/dotenv');

envSettings.envSettings;

app.use(router);

// Handle Content-Security-Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' http://localhost:3000/favicon.ico');
  return next();
});

app.use(express.static(__dirname + '/'));

app.use(cors());

app.use(user);

app.listen(port, () => {
  console.log('Server running at localhost:' + port);
});

router.get('/', (req, res) => {
  res.status(200).send('This is authentication server');
});

// Call database handler and create database and tables
database.createMySQLSchema();
database.createMySQLTable();
