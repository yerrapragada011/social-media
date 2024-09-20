import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function PostDetail() {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/posts/${postId}`)
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Error fetching post details', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) return <div>Loading...</div>

  if (!post) return <div>Post not found</div>

  return (
    <div className='post-detail'>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Author: {post.author.username}</p>
      <div>
        <strong>Likes: {post.likes.length}</strong>{' '}
      </div>
      <div>
        <h3>Comments</h3>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment.id}>
              <strong>{comment.author.username}: </strong>
              {comment.content}
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>
    </div>
  )
}

export default PostDetail
