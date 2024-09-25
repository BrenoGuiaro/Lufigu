import Express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import route from './routes/Users.routes.js'
import connect from './config/db.js'


const app = Express()

const PORT = process.env.PORT || 3000;

app.use(Express.json())
dotenv.config()
app.use(cors())
connect()


app.use('/', route)




app.listen(PORT, console.log('Server Runing', PORT))