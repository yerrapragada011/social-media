const express = require('express')
const {
  sendFollowRequest,
  acceptFollowRequest,
  deleteFollowRequest,
  getFollowRequests
} = require('../controllers/followController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/:id/follow', ensureAuthenticated, sendFollowRequest)

router.post('/:id/accept-follow', ensureAuthenticated, acceptFollowRequest)

router.delete('/:id/decline-follow', ensureAuthenticated, deleteFollowRequest)

router.get('/:id/follow-requests', ensureAuthenticated, getFollowRequests)

module.exports = router
