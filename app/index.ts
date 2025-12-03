import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import Query from 'classes/sql_query'

const port = 3000
const sql = new Query()
const app = new Elysia()

await sql.init()

app.use(cors())
app.get('/', async () => { })
app.get('/ping', () => 'Backend API RUNNING')
app.get('/materials', async () => {
    try {
        const result = sql.executeQuery('SELECT * FROM material')
    } catch (error: any) {
        return {
            error: true,
            message: 'INVALID QUERY'
        }
    }
})

app.get('/view-stock', async ({ query }) => {
    try {
        const { id, order } = query
        const sortOrder =
            order?.toUpperCase() === 'DESC'
                ? 'DESC'
                : 'ASC'

        let sqlQuerry = `
        SELECT 
            m.material_code,
            m.material_name,
            s.quantity
        FROM storage s
        JOIN material m ON m.material_code = s.material_code
    `

        if (id) {
            sqlQuerry += ` WHERE s.material_code = ${id}`
        }

        sqlQuerry += ` ORDER BY s.quantity ${sortOrder}`
        return await sql.executeQuery(sqlQuerry)
    } catch (error: any) {
        return {
            error: true,
            message: 'INVALID QUERY',
        }
    }
})


app.listen(port)

console.log(`Server API running at http://localhost:${port}`)