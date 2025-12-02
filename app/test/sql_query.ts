import db from './connection'
const [result] = await db.query("SELECT * FROM material")
console.log(result)
