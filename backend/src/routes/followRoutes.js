const express = require('express')
const {
  sendFollowRequest,
  acceptFollowRequest,
  deleteFollowRequest
} = require('../controllers/followController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/:id/follow', ensureAuthenticated, sendFollowRequest)

router.post('/:id/accept-follow', ensureAuthenticated, acceptFollowRequest)

router.delete('/:id/decline-follow', ensureAuthenticated, deleteFollowRequest)

module.exports = router
