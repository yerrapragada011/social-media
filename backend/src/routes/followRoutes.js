const express = require('express')
const {
  sendFollowRequest,
  acceptFollowRequest,
  deleteFollowRequest,
  getFollowRequests,
  getFollowers,
  getFollowing,
  removeFollower,
  unfollow
} = require('../controllers/followController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

router.post('/:id/follow', ensureAuthenticated, sendFollowRequest)

router.post('/:id/accept-follow', ensureAuthenticated, acceptFollowRequest)

router.delete('/:id/decline-follow', ensureAuthenticated, deleteFollowRequest)

router.get('/:id/follow-requests', ensureAuthenticated, getFollowRequests)

router.get('/:id/followers', ensureAuthenticated, getFollowers)

router.get('/:id/following', ensureAuthenticated, getFollowing)

router.delete('/:id/remove-follower', ensureAuthenticated, removeFollower)

router.delete('/:id/unfollow', ensureAuthenticated, unfollow)

module.exports = router
