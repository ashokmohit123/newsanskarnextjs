import mysql from "mysql2/promise";

let pool;

if (!pool) {
  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "appsansk_tbhakti",
    port: 3306,
    connectionLimit: 10,
  });
}

export default pool;
