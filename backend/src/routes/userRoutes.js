const express = require('express')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const {
  getUser,
  updateUser,
  getAllUsersToFollow,
  getUserComments,
  getUserLikedPosts
} = require('../controllers/userController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp']
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
})

router.get('/:id/profile', ensureAuthenticated, getUser)

router.put(
  '/:id/profile',
  ensureAuthenticated,
  (req, res, next) => {
    upload.single('profilePicture')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err)
        return res.status(400).json({ error: 'Multer error: ' + err.message })
      }
      next()
    })
  },
  updateUser
)

router.get('/:id', ensureAuthenticated, getAllUsersToFollow)
router.get('/:id/user-comments', ensureAuthenticated, getUserComments)
router.get('/:id/liked-posts', ensureAuthenticated, getUserLikedPosts)

module.exports = router
