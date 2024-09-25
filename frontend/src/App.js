import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link, useNavigate
} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import FollowRequests from './components/FollowRequests'
import CreatePost from './components/CreatePost'
import PostDetail from './components/PostDetail'
import EditProfile from './components/EditProfile'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_BACKEND_API_URL

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${apiUrl}/user`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('Error checking authentication', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to='/' />
    }
    return children
  }

  return (
    <Router>
      <div>
        <header>
          <nav>
            {user ? (
              <>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <button onClick={handleLogout}>Logout</button>
                  <Link to='/dashboard'>Dashboard</Link>
                  <Link to={`/profile/${user.id}`}>Profile</Link>
                  <Link to={`/${user.id}/follow-requests`}>
                    Follow Requests
                  </Link>
                  <Link to='/create-post'>Create Post</Link>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <Link to='/'>Login</Link>
                  <Link to='/register'>Register</Link>
                </div>
              </>
            )}
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path='/'
              element={
                user ? (
                  <Navigate to='/dashboard' />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path='/register'
              element={<Register onLogin={handleLogin} />}
            />
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/:userId'
              element={
                <ProtectedRoute>
                  <Profile currentUser={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path='/:userId/follow-requests'
              element={
                <ProtectedRoute>
                  <FollowRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path='/create-post'
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path='/posts/:postId'
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/:userId/edit'
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
