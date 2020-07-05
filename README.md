# RESTFUL API - Node.js express, JWT and MySQL

This is a RESTFUL API with node.js express server, JWT authentication and MySQL database

## Usage

```bash
npm i
npm start
```

## Requirements

You will need to have Node.js/npm and MySQL server installed.  
When server starts, database SCHEMA and tables are automatically created.  

You also need to add `.env` file to directory structure:

```text
PORT=number
DB_HOST=host
DB_USER=user
DB_PASS=password
JWT_SECRET='string'
```

To generate JWT_SECRET, I recommend using Node’s crypto library, like so:  

```bash
node
> require('crypto').randomBytes(64).toString('hex')
```
