const express = require('express');
const app = express();
const router = express.Router();

// Import database handler module
const database = require('./modules/db-handler');

// Port must be declared as variable as otherwise nodemon will crash
const port = process.env.PORT;

// Handle CORS (Cross-Origin Resource Sharing)
const cors = require('cors');

const user = require('./controllers/user-controller');

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
