import { Elysia, t } from 'elysia'
import cors from 'elysia'

const port = 3000
const app = new Elysia()

app.get('/', () => "Halo, ini Elysia")

app.get('/user/:name', ({ params }) => {
    console.log(params)
    return `Nama kamu: ${params.name}`
})

app.post('/login', ({ body }: any) => {
    return {
        message: `Login sebagai ${body.username}`
    }
})

app.post('/register', ({ body }: any) => {
    return {
        status: "success",
        username: body.username
    }
})

app.post('/math/add', ({ body }: any) => {
    return {
        hasil: body.x + body.y
    }
})

app.listen(port)
app.use(new cors())

console.log(`🟢 Server running at http://localhost:${port}`)