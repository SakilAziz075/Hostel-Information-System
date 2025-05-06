// config/db.js
import mysql from 'mysql2/promise'; //  Must be 'mysql2/promise'
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createPool({  //Use createPool or createConnection
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
