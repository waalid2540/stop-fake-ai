'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardTabs from '@/components/DashboardTabs'
import Link from 'next/link'
import { Shield, User, CreditCard, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free')

  const fetchUserStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const response = await fetch('/api/user/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSubscriptionStatus(data.subscription_tier || 'free')
        // Update local storage with latest user data
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          user.subscriptionTier = data.subscription_tier
          localStorage.setItem('user', JSON.stringify(user))
        }
      }
    } catch (error) {
      console.error('Failed to fetch user status:', error)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setSubscriptionStatus(parsedUser.subscriptionTier || 'free')
      
      // Check for payment success
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('success') === 'true') {
        // Fetch latest subscription status
        fetchUserStatus()
      }
    } catch (error) {
      router.push('/login')
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Shield className="h-8 w-8 text-primary-600 mr-2" />
                <span className="text-xl font-bold">Stop Fake AI</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pricing" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <CreditCard className="h-4 w-4" />
                Upgrade
              </Link>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Content Detection Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Analyze text, images, videos, and audio to detect AI-generated content
          </p>
        </div>

        {/* Usage Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-900 font-medium">
                {subscriptionStatus === 'free' ? 'Daily Usage' : 'Subscription Status'}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {subscriptionStatus === 'free' 
                  ? 'You have used 0 of 3 free checks today'
                  : `✨ ${subscriptionStatus === 'yearly' ? 'Yearly' : 'Pro'} Plan - Unlimited Checks`}
              </p>
            </div>
            {subscriptionStatus === 'free' ? (
              <Link
                href="/pricing"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Get Unlimited Checks
              </Link>
            ) : (
              <button
                onClick={fetchUserStatus}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
              >
                Refresh Status
              </button>
            )}
          </div>
        </div>

        {/* Detection Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <DashboardTabs />
        </div>
      </div>
    </div>
  )
}