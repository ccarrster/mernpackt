import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
import path from 'path'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()


devBundle.compile(app)


app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
        res.status(401).json({"error": err.name + ": " + err.message})
    }
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(
    helmet.contentSecurityPolicy({
        contentSecurityPolicy: false
    })
  )
app.use(cors())

app.use('/', authRoutes)
app.use('/', userRoutes)

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.get('/', (req, res) => {
    res.set("Content-Security-Policy", "default-src 'self'");
    res.status(200).send(Template())
})

export default app