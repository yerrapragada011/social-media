import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Post from './Post'

function Profile() {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [activeTab, setActiveTab] = useState('posts')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/users/${userId}/profile`)
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch profile')
      }
    }

    fetchProfile()
  }, [userId])

  useEffect(() => {
    if (activeTab === 'followers') {
      const fetchFollowers = async () => {
        try {
          const response = await fetch(`/users/${userId}/followers`)
          const data = await response.json()
          setFollowers(data)
        } catch (error) {
          console.error('Failed to fetch followers')
        }
      }

      fetchFollowers()
    } else if (activeTab === 'followings') {
      const fetchFollowing = async () => {
        try {
          const response = await fetch(`/users/${userId}/following`)
          const data = await response.json()
          setFollowing(data)
        } catch (error) {
          console.error('Failed to fetch following')
        }
      }

      fetchFollowing()
    } else if (activeTab === 'comments') {
      const fetchUserComments = async () => {
        try {
          const response = await fetch(`/posts/${userId}/user-comments`)
          const data = await response.json()
          setUser((prevUser) => ({ ...prevUser, comments: data }))
        } catch (error) {
          console.error('Failed to fetch user comments')
        }
      }

      fetchUserComments()
    } else if (activeTab === 'likes') {
      const fetchUserLikedPosts = async () => {
        try {
          const response = await fetch(`/posts/${userId}/liked-posts`)
          const data = await response.json()
          setUser((prevUser) => ({ ...prevUser, likes: data }))
        } catch (error) {
          console.error('Failed to fetch liked posts')
        }
      }

      fetchUserLikedPosts()
    }
  }, [activeTab, userId])

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <img
        src={user.profilePictureUrl || 'default-profile.png'}
        alt='Profile'
      />

      <nav style={{ display: 'flex', gap: '20px', margin: '20px 0px' }}>
        <button onClick={() => setActiveTab('posts')}>Posts</button>
        <button onClick={() => setActiveTab('followings')}>Following</button>
        <button onClick={() => setActiveTab('followers')}>Followers</button>
        <button onClick={() => setActiveTab('comments')}>Comments</button>
        <button onClick={() => setActiveTab('likes')}>Likes</button>
      </nav>

      {activeTab === 'posts' && (
        <>
          <h3>Posts</h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {user.posts && user.posts.length > 0 ? (
              user.posts.map((post) => <Post key={post.id} post={post} />)
            ) : (
              <p>No posts to display</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'followings' && (
        <>
          <h3>Following</h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {following.length > 0 ? (
              following.map((follow) => (
                <div key={follow.id}>
                  <p>{follow.following.username}</p>
                </div>
              ))
            ) : (
              <p>Not following anyone</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'followers' && (
        <>
          <h3>Followers</h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {followers.length > 0 ? (
              followers.map((follower) => (
                <div key={follower.id}>
                  <p>{follower.follower.username}</p>
                </div>
              ))
            ) : (
              <p>No followers to display</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'comments' && (
        <>
          <h3>Comments</h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {user.comments && user.comments.length > 0 ? (
              user.comments.map((comment) => (
                <div key={comment.id}>
                  <p>'{comment.content}' on post:</p>
                  {comment.post ? (
                    <Post post={comment.post} />
                  ) : (
                    <em>(Post no longer exists)</em>
                  )}
                </div>
              ))
            ) : (
              <p>No comments to display</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'likes' && (
        <>
          <h3>Liked Posts</h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {user.likes && user.likes.length > 0 ? (
              user.likes.map((post) => <Post key={post.id} post={post} />)
            ) : (
              <p>No liked posts to display</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
