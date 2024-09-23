const express = require('express')
const {
  getUser,
  updateUser,
  getAllUsersToFollow,
  getUserComments,
  getUserLikedPosts
} = require('../controllers/userController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.get('/:id/profile', ensureAuthenticated, getUser)

router.put('/:id/profile', ensureAuthenticated, updateUser)

router.get('/:id', ensureAuthenticated, getAllUsersToFollow)

router.get('/:id/user-comments', ensureAuthenticated, getUserComments)

router.get('/:id/liked-posts', ensureAuthenticated, getUserLikedPosts)

module.exports = router
