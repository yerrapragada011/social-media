import { useEffect, useState } from 'react'
import Post from './Post'

function Profile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/users/${userId}`)
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch profile')
      }
    }

    fetchProfile()
  }, [userId])

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <img
        src={user.profilePictureUrl || 'default-profile.png'}
        alt='Profile'
      />
      <h3>Posts</h3>
      {user.posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Profile
