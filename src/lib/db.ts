import mysql from 'mysql2/promise';

// Create a MySQL connection pool


export async function connectDB(): Promise<mysql.Connection> {
    try {
        return await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '123',
            database: process.env.DB_NAME || 'ahp',
        })
    } catch (err) {
        throw err;
    }
}

