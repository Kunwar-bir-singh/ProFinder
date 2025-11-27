'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { LogOut, Settings, User, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/lib/api/services'
import { toast } from 'sonner'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  const { isAuthenticated, user } = useSelector((state: any) => state.auth)
  const [logout, { isLoading }] = useLogoutMutation() 

  // Set mounted after first client render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) return null

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      toast.success("Successfully logged out!");
      router.push("/");

    } catch (error) {
      console.error('Logout failed:', error)
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
            PS
          </div>
          <span className="font-semibold text-lg">ProfessionSearch</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="#" className="text-gray-600 hover:text-black transition-colors">
            How it Works
          </Link>
          <Link href="#" className="text-gray-600 hover:text-black transition-colors">
            For Providers
          </Link>
          <Link href="#" className="text-gray-600 hover:text-black transition-colors">
            About
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Join as Provider</Button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar button */}
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold focus:outline-none"
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <div className="flex flex-col text-sm">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>

                    <Link
                      href="/bookmarks"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <Bookmark className="h-4 w-4" />
                      Bookmarks
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 text-left w-full hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoading ? 'Logging out…' : 'Log out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
