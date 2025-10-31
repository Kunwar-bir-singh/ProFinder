'use client'

import { useState } from 'react'
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetCurrentUserQuery, 
  useLogoutMutation 
} from '@/lib/hooks/hooks'
import { getStoredToken, clearAuthData } from '@/lib/auth-utils'

export function AuthExample() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  })

  // RTK Query hooks
  const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation()
  const [register, { isLoading: registerLoading, error: registerError }] = useRegisterMutation()
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation()
  const { data: user, isLoading: userLoading, error: userError } = useGetCurrentUserQuery()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isLogin) {
        const result = await login({
          email: formData.email,
          password: formData.password
        }).unwrap()
        
        console.log('Login successful:', result)
        // Token is automatically stored by the mutation
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        }).unwrap()
        
        console.log('Registration successful:', result)
        // Token is automatically stored by the mutation
      }
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      console.log('Logout successful')
      // Auth data is automatically cleared by the mutation
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const checkTokenStatus = () => {
    const token = getStoredToken()
    console.log('Current token:', token ? 'Present' : 'Not found')
    console.log('Token value:', token)
  }

  const clearTokens = () => {
    clearAuthData()
    console.log('Auth data cleared')
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Authentication Example</h2>
      
      {/* Token Status */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Token Status</h3>
        <div className="space-x-2">
          <button 
            onClick={checkTokenStatus}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Check Token
          </button>
          <button 
            onClick={clearTokens}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Clear Tokens
          </button>
        </div>
      </div>

      {/* User Info */}
      {userLoading && <p>Loading user...</p>}
      {userError && <p className="text-red-500">Error loading user</p>}
      {user && (
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="font-semibold">Current User</h3>
          <p>Name: {user.data.name}</p>
          <p>Email: {user.data.email}</p>
          <p>Verified: {user.data.isVerified ? 'Yes' : 'No'}</p>
        </div>
      )}

      {/* Auth Form */}
      <div className="max-w-md">
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading || registerLoading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isLogin ? 'Login' : 'Register'}
            {(loginLoading || registerLoading) && '...'}
          </button>
        </form>

        {/* Error Messages */}
        {loginError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            Login Error: {JSON.stringify(loginError)}
          </div>
        )}
        {registerError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            Registration Error: {JSON.stringify(registerError)}
          </div>
        )}
      </div>

      {/* Logout Button */}
      {user && (
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Logout {logoutLoading && '...'}
        </button>
      )}
    </div>
  )
}
