const express = require('express')
const {
  register,
  login,
  logout,
  githubLogin
} = require('../controllers/authController')
const passport = require('../passport')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.get('/github', passport.authenticate('github'))

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  githubLogin
)

module.exports = router
