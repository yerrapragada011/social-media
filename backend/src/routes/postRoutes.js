const express = require('express')
const {
  newPost,
  getAllPosts,
  getSinglePost,
  deletePost
} = require('../controllers/postController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/', ensureAuthenticated, newPost)

router.get('/', ensureAuthenticated, getAllPosts)

router.get('/:id', ensureAuthenticated, getSinglePost)

router.delete('/:id', deletePost)

module.exports = router
