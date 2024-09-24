const express = require('express')
const multer = require('multer')
const path = require('path')
const {
  getUser,
  updateUser,
  getAllUsersToFollow,
  getUserComments,
  getUserLikedPosts
} = require('../controllers/userController')
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
})

router.get('/:id/profile', ensureAuthenticated, getUser)

router.put(
  '/:id/profile',
  ensureAuthenticated,
  upload.single('profilePicture'),
  updateUser
)

router.get('/:id', ensureAuthenticated, getAllUsersToFollow)
router.get('/:id/user-comments', ensureAuthenticated, getUserComments)
router.get('/:id/liked-posts', ensureAuthenticated, getUserLikedPosts)

module.exports = router
