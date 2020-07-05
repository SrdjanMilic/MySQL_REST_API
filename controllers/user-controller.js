const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const bodyParser = require('body-parser');
const database = require('../modules/db-handler');
const jwtSecret = process.env.JWT_SECRET;
const envSettings = require('../modules/dotenv');

envSettings.envSettings;

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
router.use(bodyParser.json());


// Create users in database
const createUser = (user, callback) => {
  return database.connection.query('INSERT INTO mysql_rest_api.users (name, email, password) VALUES (?,?,?)', user, (err) => {
    callback(err);
  });
};

// Check if user already exist
const findUserByEmail = (email, callback) => {
  return database.connection.query('SELECT * FROM mysql_rest_api.users WHERE email = ?', email, (err, row) => {
    callback(err, row);
  });
};

router.post('/api/v1/register', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = bcrypt.hashSync(await req.body.password, saltRounds);

  createUser([name, email, password], (err) => {
    if (err) return res.status(500).send('Server error: User already exist!');
    findUserByEmail(email, (err, user) => {
      if (err) console.log(err);
      
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt.sign({
        id: user.id,
        name: user.name
      }, jwtSecret, {
        expiresIn: expiresIn
      });
      res.status(200).send({
        'user': user,
        'access_token': accessToken,
        'expires_in': expiresIn
      });
    });
  });
});

router.post('/api/v1/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  findUserByEmail(email, (err, user) => {
    if (err) return res.status(500).send('Server error!');
    if (!user[0]) return res.status(404).send('User not found!');

    const checkPassword = bcrypt.compareSync(password, user[0].password);
    if (!checkPassword) return res.status(401).send('Password not valid!');

    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt.sign({
      id: user.id,
      name: user.name
    }, jwtSecret, {
      expiresIn: expiresIn
    });
    res.status(200).send({
      'user': user,
      'access_token': accessToken,
      'expires_in': expiresIn
    });
  });
});

router.get('/api/v1/users', (req, res) => {
  // List all users
  const listAllUsers = (data, callback) => {
    return database.connection.query('SELECT * FROM mysql_rest_api.users', data, (err, rows) => {
      callback(err, rows);
    });
  };

  listAllUsers(req.body.object, (err, users) => {
    if (err) return res.status(500).send('Server error');
    res.status(200).send({
      'users': users
    });
  });
});

module.exports = router;
