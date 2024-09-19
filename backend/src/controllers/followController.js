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

module.exports = {
  sendFollowRequest,
  acceptFollowRequest,
  deleteFollowRequest,
  getFollowRequests
}
