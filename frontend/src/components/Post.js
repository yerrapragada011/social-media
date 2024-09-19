import React from 'react'

function Post({ post }) {
  return (
    <div className='post'>
      <h2>{post.author.username}</h2>
      <p>{post.content}</p>
      <div>
        <span>Likes: {post.likes}</span>
      </div>
      <div>
        <h3>Comments</h3>
        {post.comments.map((comment) => (
          <div key={comment.id}>
            <strong>{comment.author.username}: </strong>
            {comment.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Post
