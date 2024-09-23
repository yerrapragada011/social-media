import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.user) {
        onLogin(data.user)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Something went wrong, please try again later')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = () => {
    window.location.replace('http://localhost:8000/github')
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <button
        onClick={handleGitHubLogin}
        style={{ marginTop: '5px' }}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login with GitHub'}
      </button>
    </div>
  )
}

export default Login
