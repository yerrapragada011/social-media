const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return done(null, false, { message: 'User not found' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return done(null, false, { message: 'Incorrect password' })

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await prisma.user.findUnique({
        where: { githubId: profile.id }
      })
      if (!user) {
        user = await prisma.user.create({
          data: {
            githubId: profile.id,
            username: profile.username,
            email: profile.emails[0].value,
            profilePictureUrl: profile.photos[0].value
          }
        })
      }
      return done(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } })
  done(null, user)
})

module.exports = passport
