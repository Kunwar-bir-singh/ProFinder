'use client'

import { useState } from 'react'
import { useLoginMutation, useGetCurrentUserQuery } from '@/lib/hooks/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

export function LoginIntegrationExample() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  // RTK Query hooks
  const [login, { isLoading, error }] = useLoginMutation()
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await login(credentials).unwrap()
      console.log('Login successful:', result)
      // Token is automatically stored and user is authenticated
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleLogout = async () => {
    // You would use useLogoutMutation here
    console.log('Logout clicked')
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RTK Query Login Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Status */}
          {userLoading && (
            <p className="text-sm text-gray-600">Loading user...</p>
          )}
          
          {user && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Welcome back, {user.data.name}! You are authenticated.
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          {!user && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error && 'data' in error 
                      ? (error.data as any)?.message || 'Login failed. Please check your credentials.'
                      : 'Login failed. Please try again.'
                    }
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  disabled={isLoading}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* Logout Button */}
          {user && (
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Logout
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <p><strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
            {user && (
              <div>
                <p><strong>User Data:</strong></p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(user.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
