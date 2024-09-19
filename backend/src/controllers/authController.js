const bcrypt = require('bcrypt')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    })

    req.login(newUser, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Login after registration failed' })
      res.json({ message: 'Registration and login successful', user: newUser })
    })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
  }
}

const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login failed' })
      res.json({ message: 'Login successful', user })
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
  req.login(req.user, (err) => {
    if (err) {
      return res.status(500).json({ message: 'GitHub login failed' })
    }
    res.redirect('/profile')
  })
}

module.exports = { register, login, logout, githubLogin }
