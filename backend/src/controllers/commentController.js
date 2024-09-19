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

module.exports = { addComment, getComments }
