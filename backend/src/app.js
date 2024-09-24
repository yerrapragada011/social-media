require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const cookieParser = require('cookie-parser')
const passport = require('./passport')
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const likeRoutes = require('./routes/likeRoutes')
const followRoutes = require('./routes/followRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(
  cors({
    origin: 'https://social-media-six-kappa.vercel.app',
    credentials: true
  })
)

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      httpOnly: true,
      sameSite: 'none'
    },
    proxy: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/', authRoutes)
app.use('/posts', postRoutes)
app.use('/posts', commentRoutes)
app.use('/posts', likeRoutes)
app.use('/users', followRoutes)
app.use('/users', userRoutes)

const PORT = process.env.PORT || 8000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
