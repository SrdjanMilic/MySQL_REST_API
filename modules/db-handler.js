const mysql = require('mysql');

require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting: ' + error.stack);
    return;
  } else {
    console.log('Connected to MySQL server as id ' + connection.threadId);
  }
});

// Dotenv directives
const dotenv = require('dotenv');
const result = dotenv.config();

// Handle dotenv errors if any
if (result.error) {
  throw result.error;
}

// Create "mysql_rest_api" schema
function createMySQLSchema() {
  connection.query(
    `SELECT SCHEMA_NAME 
    FROM INFORMATION_SCHEMA.SCHEMATA
    WHERE SCHEMA_NAME = "mysql_rest_api";`,
    // Create schema if not exist
    function (error, result) {
      if (error) {
        throw error;
      } else if (result.length === 0) {
        connection.query('CREATE SCHEMA IF NOT EXISTS mysql_rest_api',
          function (error) {
            if (error) {
              throw error;
            } else {
              console.log('Schema "mysql_rest_api" is created!');
            }
          });
      } else {
        console.log('Schema "mysql_rest_api" already exist!');
      }
    }
  );
}

// Create "users" table
function createMySQLTable() {
  connection.query(
    `SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = "mysql_rest_api"
    AND TABLE_NAME = "users";`,
    // Create table if not exist
    function (error, result) {
      if (error) {
        throw error;
      } else if (result.length === 0) {
        connection.query(`CREATE TABLE IF NOT EXISTS mysql_rest_api.users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password CHAR(60) NOT NULL,
          register_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, function (error) {
          if (error) {
            throw error;
          } else {
            console.log('Table "users" is created!');
          }
        });
      } else {
        console.log('Table "users" already exist!');
      }
    }
  );
}

module.exports = {
  connection: connection,
  createMySQLSchema: createMySQLSchema,
  createMySQLTable: createMySQLTable
};
