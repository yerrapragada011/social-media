import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function PostDetail() {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${apiUrl}/posts/${postId}`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()
        setPost(data)
        setLikesCount(data.likes.length)
        setLiked(data.likes.some((like) => like.userId === data.currentUserId))
        setComments(data.comments)
        setCurrentUserId(data.currentUserId)
      } catch (error) {
        console.error('Error fetching post details', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [apiUrl, postId])

  const handleLikeUnlike = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setLikesCount(likesCount + (liked ? -1 : 1))
        setLiked(!liked)
      } else {
        alert('Error liking/unliking the post')
      }
    } catch (error) {
      console.error('Failed to like/unlike the post', error)
    }
  }

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      alert('Comment cannot be empty')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment })
      })

      if (response.ok) {
        const comment = await response.json()
        setComments([...comments, comment])
        setNewComment('')
      } else {
        alert('Error adding comment')
      }
    } catch (error) {
      console.error('Failed to add comment', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch(
          `${apiUrl}/posts/${postId}/comments/${commentId}`,
          {
            method: 'DELETE',
            credentials: 'include'
          }
        )

        if (response.ok) {
          setComments(comments.filter((comment) => comment.id !== commentId))
        } else {
          alert('Error deleting comment')
        }
      } catch (error) {
        console.error('Failed to delete comment', error)
      }
    }
  }

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`${apiUrl}/posts/${postId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          alert('Post deleted successfully')
          window.location.href = `/profile/${currentUserId}`
        } else {
          alert('Error deleting post')
        }
      } catch (error) {
        console.error('Failed to delete post', error)
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (!post) return <div>Post not found</div>

  return (
    <div className='post-detail'>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        Author:{' '}
        <Link to={`/profile/${post.author.id}`}>{post.author.username}</Link>
      </p>
      <div>
        <strong>Likes: {likesCount}</strong>{' '}
        <button onClick={handleLikeUnlike}>{liked ? 'Unlike' : 'Like'}</button>
      </div>

      {post.author.id === currentUserId && (
        <button style={{ marginTop: '10px' }} onClick={handleDeletePost}>
          Delete Post
        </button>
      )}

      <div>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <strong>{comment.author.username}: </strong>
              {comment.content}
              {(comment.author.id === currentUserId ||
                post.author.id === currentUserId) && (
                <button onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}

        <div>
          <input
            type='text'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Add a comment'
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
