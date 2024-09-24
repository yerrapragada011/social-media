import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function EditProfile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [bio, setBio] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/users/${userId}/profile`)
        const data = await response.json()
        setUser(data)
        setBio(data.bio || '')
        setProfilePicture(data.profilePictureUrl || '')
      } catch (error) {
        console.error('Failed to fetch user profile', error)
      }
    }

    fetchUserProfile()
  }, [userId])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('bio', bio)
    if (profilePicture) {
      formData.append('profilePicture', profilePicture)
    }

    try {
      const response = await fetch(`/users/${userId}/profile`, {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        navigate(`/profile/${userId}`)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error during profile update:', error)
    }
  }

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0])
  }

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label htmlFor='profilePictureUrl'>Profile Picture URL</label>
          <input
            type='file'
            id='profilePicture'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor='bio'>Bio</label>
          <textarea
            id='bio'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button type='submit'>Save Changes</button>
      </form>
    </div>
  )
}

export default EditProfile
