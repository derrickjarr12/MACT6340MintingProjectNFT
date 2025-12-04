import mysql from "mysql2";

let pool;

export async function connect() {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    connectTimeout: 10000
  }).promise();
}

export async function getAllProjects() {
  const [rows] = await pool.query("SELECT * FROM projects WHERE active = 1");
  return rows;
}