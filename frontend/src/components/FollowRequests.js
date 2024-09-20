import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function FollowRequests() {
  const [followRequests, setFollowRequests] = useState([])
  const [users, setUsers] = useState([])
  const { userId } = useParams()

  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const response = await fetch(`/users/${userId}/follow-requests`)
        const data = await response.json()
        setFollowRequests(data)
      } catch (error) {
        console.error('Failed to fetch follow requests')
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('/users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users')
      }
    }

    fetchFollowRequests()
    fetchUsers()
  }, [userId])

  const handleAccept = async (id) => {
    try {
      await fetch(`/users/${id}/accept-follow`, { method: 'POST' })
      setFollowRequests(
        followRequests.filter((request) => request.follower.id !== id)
      )
    } catch (error) {
      console.error('Failed to accept follow request')
    }
  }

  const handleDecline = async (id) => {
    try {
      await fetch(`/users/${id}/decline-follow`, { method: 'DELETE' })
      setFollowRequests(
        followRequests.filter((request) => request.follower.id !== id)
      )
    } catch (error) {
      console.error('Failed to decline follow request')
    }
  }

  const handleSendFollowRequest = async (id) => {
    try {
      const response = await fetch(`/users/${id}/follow`, { method: 'POST' })
      if (response.ok) {
        alert('Follow request sent!')
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, requestStatus: 'pending' } : user
          )
        )
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to send follow request')
      }
    } catch (error) {
      console.error('Failed to send follow request', error)
    }
  }

  return (
    <div>
      <h1>Follow Requests</h1>
      {followRequests.length > 0 ? (
        followRequests.map((request) => (
          <div key={request.follower.id}>
            <span>{request.follower.username}</span>
            <button onClick={() => handleAccept(request.follower.id)}>
              Accept
            </button>
            <button onClick={() => handleDecline(request.follower.id)}>
              Decline
            </button>
          </div>
        ))
      ) : (
        <p>No follow requests</p>
      )}

      <h1>Users to Follow</h1>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id}>
            <span>{user.username}</span>
            {user.requestStatus === 'pending' ? (
              <span>Request Pending</span>
            ) : (
              <button onClick={() => handleSendFollowRequest(user.id)}>
                Send Follow Request
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No users to follow</p>
      )}
    </div>
  )
}

export default FollowRequests
