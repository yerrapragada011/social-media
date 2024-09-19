require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const passport = require('./passport')
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')

const app = express()

app.use(cors())

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.enable('trust proxy')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: 'session'
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      sameSite: 'lax'
    }
  })
)

app.use(express.static(path.join(__dirname, '../../frontend/build')))

app.use('/', authRoutes)
app.use('/posts', postRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'))
})

app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 8000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
