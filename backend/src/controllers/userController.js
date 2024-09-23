const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
            post: true
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
  const { profilePictureUrl } = req.body
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { profilePictureUrl }
    })
    res.json(updatedUser)
  } catch (error) {
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

module.exports = { getUser, updateUser, getAllUsersToFollow }
