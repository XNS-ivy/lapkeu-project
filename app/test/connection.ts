import mysql from "mysql2/promise"

const db = await mysql.createConnection({
  host: "localhost",
  user: "bunapp",
  password: "123456",
  database: "ecommerce_bahan_berbahaya",
})

export default db