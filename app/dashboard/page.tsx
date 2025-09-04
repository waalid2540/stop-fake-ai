import { requireAuth } from '@/lib/auth'
import DashboardTabs from '@/components/DashboardTabs'
import Link from 'next/link'
import { Shield, User, CreditCard, LogOut } from 'lucide-react'

export default async function DashboardPage() {
  const user = await requireAuth()

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
              <form action="/api/auth/logout" method="POST">
                <button 
                  type="submit"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
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
              <p className="text-blue-900 font-medium">Daily Usage</p>
              <p className="text-sm text-blue-700 mt-1">
                You have used 0 of 3 free checks today
              </p>
            </div>
            <Link
              href="/pricing"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Get Unlimited Checks
            </Link>
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