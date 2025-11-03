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
        ssl: { rejectUnauthorized: false },
        connectTimeout: 30000,
        acquireTimeout: 30000,
        timeout: 30000
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

    try {
        pool = mysql.createPool(config).promise();
        
        // Test the connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        
        console.log('MySQL pool created and connection tested successfully');
    } catch (error) {
        console.error('Failed to connect to MySQL:', error.message);
        throw error;
    }
}

export async function getAllProjects() {
    const [rows] = await pool.query("SELECT id, project_name, img_url, project_description, quantity, price_eth FROM projects WHERE active = 1 ORDER BY id");
    // Return array of project objects with all data
    return rows.map(row => ({
        id: row.id,
        project_name: row.project_name,
        img_url: row.img_url,
        project_description: row.project_description,
        quantity: row.quantity,
        price_eth: row.price_eth
    }));
}