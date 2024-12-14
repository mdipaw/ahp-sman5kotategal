import mysql, {Connection} from 'mysql2/promise';

let connection: Connection | undefined;
export const connectDB = async (): Promise<mysql.Connection> => {
    if (!connection) {
        connection =  await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '123',
            database: process.env.DB_NAME || 'employees',
        });
    }
    return connection;
}

export const countData = async (
    connection: Connection,
    type: string,

): Promise<{ total:number }> => {
    const [result] = await connection.query(`SELECT COUNT(*) as total FROM ${type}`);
    return result as unknown as { total:number };
}

export const getData = async<T> (
    connection: Connection,
    table: string,
    limit?: number,
    offset?: number,
):Promise<T[]> => {
    let sql = `SELECT * FROM ${table}`;
    if (limit) {
        sql += ` LIMIT ${limit}`;
    }
    if (offset) {
        sql += ` OFFSET ${offset}`;
    }
    const [result] = await connection.query(sql);
    return result as T[];
}