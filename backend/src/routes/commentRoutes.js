const express = require('express')
const { addComment, getComments } = require('../controllers/commentController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/:id/comments', ensureAuthenticated, addComment)

router.get('/:id/comments', ensureAuthenticated, getComments)

module.exports = router
