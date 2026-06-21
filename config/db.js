import mysql from 'mysql2/promise'; // Sesuaikan dengan library yang Anda pakai
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from './env.js';

const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    // Tambahkan baris ini untuk koneksi ke TiDB Cloud
    ssl: {
        rejectUnauthorized: false
    }
});

export default db;