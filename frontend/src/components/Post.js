import React from 'react'
import { Link } from 'react-router-dom'

function Post({ post }) {
  return (
    <div style={{ border: '1px solid gray' }}>
      <h2>{post.title}</h2>
      <p>Author: {post.author.username}</p>
      <Link to={`/posts/${post.id}`}>View Details</Link>
    </div>
  )
}

export default Post
