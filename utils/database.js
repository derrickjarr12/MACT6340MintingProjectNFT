import mysql from "mysql2";

let pool;

export async function connect() {
    console.log('Connecting to MySQL with:', {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT
    });
    
    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT
    }).promise();
    
    console.log('MySQL pool created successfully');
}
    
export async function getAllProjects() {
    const [rows] = await pool.query("SELECT project_name FROM projects ORDER BY id");
    // Return array of project names to match the original array format
    return rows.map(row => row.project_name);
}