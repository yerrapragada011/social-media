const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cloudinary = require('cloudinary').v2

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        posts: {
          include: {
            author: true
          }
        },
        comments: true,
        likes: {
          include: {
            post: {
              include: { author: true }
            }
          }
        },
        following: {
          include: {
            following: true
          }
        },
        followers: {
          include: {
            follower: true
          }
        }
      }
    })

    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
}

const updateUser = async (req, res) => {
  const { bio } = req.body
  const { id } = req.params
  let profilePictureUrl = req.file ? req.file.path : null

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path)
      profilePictureUrl = result.secure_url
    } catch (error) {
      return res.status(500).json({ error: 'Failed to upload image' })
    }
  } else {
    console.log('No file received, proceeding without image upload.')
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        bio,
        ...(profilePictureUrl && { profilePictureUrl })
      }
    })
    res.json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', JSON.stringify(error, null, 2))
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

const getAllUsersToFollow = async (req, res) => {
  try {
    const userId = Number(req.params.id)

    const followedUsers = await prisma.followRequest.findMany({
      where: {
        followerId: userId,
        status: 'accepted'
      },
      select: {
        followingId: true
      }
    })

    const followedUserIds = followedUsers.map((follow) => follow.followingId)

    const usersToFollow = await prisma.user.findMany({
      where: {
        AND: [{ id: { not: userId } }, { id: { notIn: followedUserIds } }]
      },
      select: {
        id: true,
        username: true,
        profilePictureUrl: true
      }
    })

    res.json(usersToFollow)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users to follow' })
  }
}

const getUserComments = async (req, res) => {
  try {
    const userId = Number(req.params.id)
    const comments = await prisma.comment.findMany({
      where: { authorId: userId },
      include: {
        post: {
          include: { author: true }
        }
      }
    })

    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user comments' })
  }
}

const getUserLikedPosts = async (req, res) => {
  try {
    const userId = Number(req.params.id)
    const likedPosts = await prisma.like.findMany({
      where: { userId: userId },
      include: {
        post: {
          include: { author: true }
        }
      }
    })

    res.json(likedPosts.map((like) => like.post))
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch liked posts' })
  }
}

module.exports = {
  getUser,
  updateUser,
  getAllUsersToFollow,
  getUserComments,
  getUserLikedPosts
}
