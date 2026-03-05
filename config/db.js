import mysql from "mysql2";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from "./env.js";

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Gagal konek ke database:", err.message);
  } else {
    console.log("Database MySQL berhasil terhubung!");
  }
});

export default db;