import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function PostDetail() {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/posts/${postId}`)
        const data = await response.json()
        setPost(data)
        setLikesCount(data.likes.length)
        // Check if the current user has already liked the post
        setLiked(data.likes.some((like) => like.userId === data.currentUserId)) // Assuming the API returns currentUserId
      } catch (error) {
        console.error('Error fetching post details', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  const handleLikeUnlike = async () => {
    try {
      const response = await fetch(`/posts/${postId}/like`, { method: 'POST' })

      if (response.ok) {
        if (liked) {
          setLikesCount(likesCount - 1)
        } else {
          setLikesCount(likesCount + 1)
        }
        setLiked(!liked)
      } else {
        alert('Error liking/unliking the post')
      }
    } catch (error) {
      console.error('Failed to like/unlike the post', error)
    }
  }

  if (loading) return <div>Loading...</div>

  if (!post) return <div>Post not found</div>

  return (
    <div className='post-detail'>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Author: {post.author.username}</p>
      <div>
        <strong>Likes: {likesCount}</strong>{' '}
        <button onClick={handleLikeUnlike}>{liked ? 'Unlike' : 'Like'}</button>
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
