const express = require('express')
const {
  likeAndUnlike,
  getUserLikedPosts
} = require('../controllers/likeController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/:id/like', ensureAuthenticated, likeAndUnlike)

module.exports = router
