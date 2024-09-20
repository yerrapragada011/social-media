import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      alert('Post content cannot be empty!')
      return
    }

    try {
      const response = await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })

      if (response.ok) {
        alert('Post created successfully')
        setTitle('')
        setContent('')
        navigate('/dashboard')
      } else {
        alert('Failed to create post')
      }
    } catch (error) {
      console.error('Failed to create post', error)
    }
  }

  return (
    <div>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            required
            rows='4'
          ></textarea>
        </div>
        <button type='submit'>Post</button>
      </form>
    </div>
  )
}

export default CreatePost
