const bcrypt = require('bcrypt')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')

const prisma = new PrismaClient()

const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const gravatarHash = crypto
      .createHash('md5')
      .update(email.trim().toLowerCase())
      .digest('hex')
    const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon`

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profilePictureUrl: gravatarUrl
      }
    })

    req.logIn(newUser, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Login after registration failed' })
      res.json({ message: 'Registration and login successful', user: newUser })
    })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
}

const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials', info })
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed', error: err })
      }
      return res.json({ message: 'Login successful', user })
    })
  })(req, res, next)
}

const logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' })
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' })
      }
      res.clearCookie('connect.sid')
      res.json({ message: 'Logged out successfully' })
    })
  })
}

const githubLogin = async (req, res) => {
  req.logIn(req.user, (err) => {
    if (err) {
      return res.status(500).json({ message: 'GitHub login failed' })
    }
    res.redirect('/dashboard')
  })
}

const returnUser = async (req, res) => {
  if (req.user) {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        profilePictureUrl: req.user.profilePictureUrl
      }
    })
  } else {
    res.status(401).json({ error: 'No user is authenticated' })
  }
}

const redirect = async (req, res) => {
  res.redirect('https://social-media-six-kappa.vercel.app/dashboard')
}

module.exports = { register, login, logout, githubLogin, returnUser, redirect }
