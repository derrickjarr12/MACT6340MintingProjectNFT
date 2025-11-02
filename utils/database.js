import mysql from "mysql2";

let pool;

export async function connect() {
    // Check if we should use Digital Ocean database
    const useDigitalOcean = process.env.USE_DO_DB === 'true' || process.env.NODE_ENV === 'production';
    
    const config = useDigitalOcean ? {
        host: process.env.DO_MYSQL_HOST,
        user: process.env.DO_MYSQL_USER,
        password: process.env.DO_MYSQL_PASSWORD,
        database: process.env.DO_MYSQL_DATABASE,
        port: process.env.DO_MYSQL_PORT,
        ssl: { rejectUnauthorized: false }
    } : {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT
    };

    console.log('Connecting to MySQL with:', {
        host: config.host,
        user: config.user,
        database: config.database,
        port: config.port,
        environment: useDigitalOcean ? 'Digital Ocean' : 'Local'
    });

    pool = mysql.createPool(config).promise();
    
    console.log('MySQL pool created successfully');
}

export async function getAllProjects() {
    const [rows] = await pool.query("SELECT project_name FROM projects WHERE active = 1 ORDER BY id");
    // Return array of project names to match the original array format
    return rows.map(row => row.project_name);
}