const express = require('express')
const {
  newPost,
  getAllPosts,
  getSinglePost
} = require('../controllers/postController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/', ensureAuthenticated, newPost)

router.get('/', ensureAuthenticated, getAllPosts)

router.get('/:id', ensureAuthenticated, getSinglePost)

module.exports = router
