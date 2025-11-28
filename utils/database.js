import mysql from "mysql2";

let pool;

export async function connect() {
    let cString = 
        "mysql://" +
        process.env.MYSQL_USER +
        ":" +
        process.env.MYSQL_PASSWORD + 
        "@" +
        process.env.MYSQL_HOST + 
        ":" +
        process.env.MYSQL_PORT +
        "/" +
        process.env.MYSQL_DATABASE;
        
    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        connectTimeout: 10000,
        ssl: {
            ca: fs.readFileSync('./ca-certificate.crt'),
            rejectUnauthorized: true
        }
        }).promise();
    }
    
    export async function getAllProjects() {
        const [rows] = await pool.query("SELECT * FROM projects WHERE active = 1");
        return rows;
    }