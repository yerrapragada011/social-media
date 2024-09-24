import { useEffect, useState } from 'react'
import Post from './Post'

function Dashboard({ user }) {
  const [posts, setPosts] = useState([])
  const [dashboardUser, setDashboardUser] = useState(null)
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userResponse = await fetch(`${apiUrl}/user`, {
          method: 'GET',
          credentials: 'include'
        })

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await userResponse.json()
        setDashboardUser(userData.user)

        const postsResponse = await fetch(`${apiUrl}/posts`, {
          method: 'GET',
          credentials: 'include'
        })

        const postsData = await postsResponse.json()
        setPosts(postsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchDashboardData()
  }, [apiUrl])

  return (
    <div>
      <h1>Dashboard</h1>
      {dashboardUser ? (
        <p>Welcome, {dashboardUser.username}!</p>
      ) : (
        <p>Loading user information...</p>
      )}
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
