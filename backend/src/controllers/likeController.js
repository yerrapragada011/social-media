const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const likeAndUnlike = async (req, res) => {
  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: Number(req.params.id),
        userId: req.user.id
      }
    })

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } })
      return res.json({ message: 'Post unliked' })
    }

    const like = await prisma.like.create({
      data: {
        postId: Number(req.params.id),
        userId: req.user.id
      }
    })
    res.json(like)
  } catch (error) {
    res.status(500).json({ error: 'Failed to like/unlike post' })
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

module.exports = { likeAndUnlike, getUserLikedPosts }
