const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const newPost = async (req, res) => {
  const { title, content } = req.body
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id
      }
    })
    res.json(newPost)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' })
  }
}

const getAllPosts = async (req, res) => {
  const userId = req.user.id

  try {
    const followers = await prisma.followRequest.findMany({
      where: {
        followerId: userId,
        status: 'accepted'
      },
      select: {
        followingId: true
      }
    })

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: userId },
          {
            authorId: {
              in: followers.map((f) => f.followingId)
            }
          }
        ]
      },
      include: {
        author: true,
        likes: true,
        comments: { include: { author: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

const getSinglePost = async (req, res) => {
  try {
    const postId = Number(req.params.id)
    const userId = req.user.id

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        likes: true,
        comments: {
          include: { author: true }
        }
      }
    })

    if (!post) return res.status(404).json({ message: 'Post not found' })

    const hasLiked = post.likes.some((like) => like.userId === userId)

    res.json({
      ...post,
      currentUserId: userId,
      hasLiked
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
}

const deletePost = async (req, res) => {
  const postId = Number(req.params.id)
  const userId = req.user.id

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this post' })
    }

    await prisma.post.delete({
      where: { id: postId }
    })

    res.status(204).send()
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ error: 'Failed to delete post' })
  }
}

module.exports = { newPost, getAllPosts, getSinglePost, deletePost }
