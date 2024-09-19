import { useEffect, useState } from 'react'

function FollowRequests() {
  const [followRequests, setFollowRequests] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const response = await fetch('/users/follow-requests')
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
  }, [])

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
            <button>Send Follow Request</button>
          </div>
        ))
      ) : (
        <p>No users to follow</p>
      )}
    </div>
  )
}

export default FollowRequests
