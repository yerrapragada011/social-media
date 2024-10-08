import { useEffect, useState } from 'react'
import Post from './Post'

function Dashboard({ user }) {
  const [posts, setPosts] = useState([])
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/posts`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Failed to fetch posts')
      }
    }

    fetchPosts()
  }, [apiUrl])

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <h1>Posts:</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
