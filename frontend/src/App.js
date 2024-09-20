import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import FollowRequests from './components/FollowRequests'
import CreatePost from './components/CreatePost'
import PostDetail from './components/PostDetail'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/user')
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
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
      await fetch('/logout', { method: 'POST' })
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
                  <Link to='/follow-requests'>Follow Requests</Link>
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
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/:userId'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/follow-requests'
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
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
