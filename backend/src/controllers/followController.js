const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sendFollowRequest = async (req, res) => {
  const followingId = Number(req.params.id)
  try {
    const existingRequest = await prisma.followRequest.findFirst({
      where: {
        followerId: req.user.id,
        followingId
      }
    })

    if (existingRequest) {
      return res.status(400).json({ message: 'Follow request already exists' })
    }

    const followRequest = await prisma.followRequest.create({
      data: {
        followerId: req.user.id,
        followingId,
        status: 'pending'
      }
    })
    res.json(followRequest)
  } catch (error) {
    res.status(500).json({ error: 'Failed to send follow request' })
  }
}

const acceptFollowRequest = async (req, res) => {
  const followerId = Number(req.params.id)
  try {
    const followRequest = await prisma.followRequest.findFirst({
      where: {
        followerId,
        followingId: req.user.id,
        status: 'pending'
      }
    })

    if (!followRequest) {
      return res
        .status(400)
        .json({ message: 'No pending follow request found' })
    }

    const acceptedRequest = await prisma.followRequest.update({
      where: { id: followRequest.id },
      data: { status: 'accepted' }
    })

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        followers: {
          connect: { id: followerId }
        }
      }
    })

    res.json(acceptedRequest)
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept follow request' })
  }
}

const deleteFollowRequest = async (req, res) => {
  const followerId = Number(req.params.id)

  try {
    const followRequest = await prisma.followRequest.findFirst({
      where: {
        followerId,
        followingId: req.user.id,
        status: 'pending'
      }
    })

    if (!followRequest) {
      return res
        .status(400)
        .json({ message: 'No pending follow request found' })
    }

    await prisma.followRequest.delete({
      where: { id: followRequest.id }
    })

    res.json({ message: 'Follow request declined' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to decline follow request' })
  }
}

const getFollowRequests = async (req, res) => {
  const userId = Number(req.params.id)

  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Unauthorized' })
  }

  try {
    const followRequests = await prisma.followRequest.findMany({
      where: {
        followingId: userId,
        status: 'pending'
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true
          }
        }
      }
    })

    res.json(followRequests)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch follow requests' })
  }
}

const getFollowers = async (req, res) => {
  const userId = Number(req.params.id)

  try {
    const followers = await prisma.followRequest.findMany({
      where: {
        followingId: userId,
        status: 'accepted'
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true
          }
        }
      }
    })

    res.json(followers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers' })
  }
}

const getFollowing = async (req, res) => {
  const userId = Number(req.params.id)

  try {
    const following = await prisma.followRequest.findMany({
      where: {
        followerId: userId,
        status: 'accepted'
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            profilePictureUrl: true
          }
        }
      }
    })

    res.json(following)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following' })
  }
}

const removeFollower = async (req, res) => {
  const followerId = Number(req.params.id)

  try {
    const existingFollower = await prisma.followRequest.findFirst({
      where: {
        followerId,
        followingId: req.user.id,
        status: 'accepted'
      }
    })

    if (!existingFollower) {
      return res.status(404).json({ message: 'Follower not found' })
    }

    await prisma.followRequest.delete({
      where: { id: existingFollower.id }
    })

    res.json({ message: 'Follower removed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove follower' })
  }
}

const unfollow = async (req, res) => {
  const followingId = Number(req.params.id)

  try {
    const existingFollowing = await prisma.followRequest.findFirst({
      where: {
        followerId: req.user.id,
        followingId,
        status: 'accepted'
      }
    })

    if (!existingFollowing) {
      return res
        .status(404)
        .json({ message: 'You are not following this user' })
    }

    await prisma.followRequest.delete({
      where: { id: existingFollowing.id }
    })

    res.json({ message: 'Unfollowed successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow' })
  }
}

module.exports = {
  sendFollowRequest,
  acceptFollowRequest,
  deleteFollowRequest,
  getFollowRequests,
  getFollowers,
  getFollowing,
  removeFollower,
  unfollow
}
