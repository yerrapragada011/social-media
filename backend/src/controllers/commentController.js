const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const addComment = async (req, res) => {
  const { content } = req.body
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: Number(req.params.id),
        authorId: req.user.id
      },
      include: {
        author: true
      }
    })
    res.json(comment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' })
  }
}

const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(req.params.id) },
      include: { author: true },
      orderBy: { createdAt: 'asc' }
    })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
}

const deleteComment = async (req, res) => {
  const { id } = req.params
  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: Number(id) },
      include: { post: true }
    })

    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    if (
      existingComment.authorId !== req.user.id &&
      existingComment.post.authorId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await prisma.comment.delete({
      where: { id: Number(id) }
    })

    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' })
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

module.exports = { addComment, getComments, deleteComment, getUserComments }
