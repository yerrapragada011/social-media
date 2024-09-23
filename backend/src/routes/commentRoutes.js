const express = require('express')
const {
  addComment,
  getComments,
  deleteComment
} = require('../controllers/commentController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/:id/comments', ensureAuthenticated, addComment)

router.get('/:id/comments', ensureAuthenticated, getComments)

router.delete('/:id/comments/:id', ensureAuthenticated, deleteComment)

module.exports = router
