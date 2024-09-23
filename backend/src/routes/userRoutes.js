const express = require('express')
const {
  getUser,
  updateUser,
  getAllUsersToFollow
} = require('../controllers/userController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.get('/:id/profile', ensureAuthenticated, getUser)

router.put('/:id/profile', ensureAuthenticated, updateUser)

router.get('/:id', ensureAuthenticated, getAllUsersToFollow)

module.exports = router
