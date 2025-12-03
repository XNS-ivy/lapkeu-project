import mysql from 'mysql2/promise'
import type { QueryResult, Connection } from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

export default class DatabaseQuerry {
    connection: Connection | null
    constructor() {
        this.connection = null
    }
    async init() {
        await this.getConnection()
    }
    async getConnection() {
        this.connection = await mysql.createConnection({
            host: `${process.env.DB_HOST}`,
            user: `${process.env.DB_USER}`,
            password: `${process.env.DB_PASSWORD}`,
            database: `${process.env.DB_NAME}`,
        })
        if (this.connection) console.log('Database Connected')
    }
    async executeQuery(res: string): Promise<QueryResult | void> {
        if (!this.connection) throw new Error("No connection")
        if (this.connection == null) await this.init()
        const [rows] = await this.connection.query(res)
        return rows
    }
}