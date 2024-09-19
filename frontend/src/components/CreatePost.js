import { useState } from 'react'

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('')

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
        body: JSON.stringify({ content })
      })
      const data = await response.json()
      setContent('')
      if (onPostCreated) {
        onPostCreated(data)
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
