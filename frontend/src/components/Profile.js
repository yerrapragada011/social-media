import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Post from './Post'

function Profile({ currentUser }) {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/${userId}/profile`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch profile')
      }
    }

    fetchProfile()
  }, [apiUrl, userId])

  useEffect(() => {
    setActiveTab('posts')
  }, [userId])

  useEffect(() => {
    if (activeTab === 'followers') {
      const fetchFollowers = async () => {
        try {
          const response = await fetch(`${apiUrl}/users/${userId}/followers`, {
            method: 'GET',
            credentials: 'include'
          })
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
          const response = await fetch(`${apiUrl}/users/${userId}/following`, {
            method: 'GET',
            credentials: 'include'
          })
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
          const response = await fetch(`${apiUrl}/users/${userId}/user-comments`, {
            method: 'GET',
            credentials: 'include'
          })
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
          const response = await fetch(`${apiUrl}/users/${userId}/liked-posts`, {
            method: 'GET',
            credentials: 'include'
          })
          const data = await response.json()
          setUser((prevUser) => ({ ...prevUser, likes: data }))
        } catch (error) {
          console.error('Failed to fetch liked posts')
        }
      }

      fetchUserLikedPosts()
    }
  }, [apiUrl, activeTab, userId])

  const handleUnfollow = async (followingId) => {
    try {
      const response = await fetch(`${apiUrl}/users/${followingId}/unfollow`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        setFollowing(
          following.filter((follow) => follow.following.id !== followingId)
        )
        alert('Unfollowed successfully')
      } else {
        alert('Failed to unfollow')
      }
    } catch (error) {
      console.error('Failed to unfollow', error)
    }
  }

  const handleRemoveFollower = async (followerId) => {
    try {
      const response = await fetch(`${apiUrl}/users/${followerId}/remove-follower`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (response.ok) {
        setFollowers(
          followers.filter((follower) => follower.follower.id !== followerId)
        )
        alert('Follower removed successfully')
      } else {
        alert('Failed to remove follower')
      }
    } catch (error) {
      console.error('Failed to remove follower', error)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>{user.username}'s Profile</h1>

      <img
        src={user.profilePictureUrl || 'default-profile.png'}
        alt='Profile'
      />

      <p>{user.bio || 'No bio provided'}</p>

      {user.id === currentUser.id && (
        <Link to={`/profile/${userId}/edit`}>
          <button>Edit Profile</button>
        </Link>
      )}

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
                <div key={follow.following.id}>
                  <Link to={`/profile/${follow.following.id}`}>
                    {follow.following.username}
                  </Link>
                  {parseInt(userId) === currentUser.id && (
                    <button onClick={() => handleUnfollow(follow.following.id)}>
                      Unfollow
                    </button>
                  )}
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
                <div key={follower.follower.id}>
                  <Link to={`/profile/${follower.follower.id}`}>
                    {follower.follower.username}
                  </Link>
                  {parseInt(userId) === currentUser.id && (
                    <button
                      onClick={() => handleRemoveFollower(follower.follower.id)}
                    >
                      Remove Follower
                    </button>
                  )}
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
