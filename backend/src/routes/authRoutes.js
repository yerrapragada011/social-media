const express = require('express')
const {
  register,
  login,
  logout,
  githubLogin,
  returnUser,
  dashboard
} = require('../controllers/authController')
const passport = require('../passport')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.get('/github', (req, res, next) => {
  passport.authenticate('github')(req, res, next)
})

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  githubLogin
)

router.get('/user', ensureAuthenticated, returnUser)

router.get('/dashboard', ensureAuthenticated, dashboard)

module.exports = router
