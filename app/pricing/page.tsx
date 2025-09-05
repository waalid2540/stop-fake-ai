'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Check, X } from 'lucide-react'
import { createCheckoutSession } from '@/lib/stripe-client'
import { PLANS } from '@/lib/stripe'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: 'yearly' | 'pro') => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please sign in to subscribe')
      window.location.href = '/login'
      return
    }

    setLoading(plan)
    try {
      const priceId = plan === 'yearly' ? PLANS.yearly.stripePriceId : PLANS.pro.stripePriceId
      await createCheckoutSession(priceId)
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start subscription. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-xl font-bold">Stop Fake AI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-gray-600 mb-4">Perfect for trying out</p>
                <div className="text-4xl font-bold">
                  $0
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>3 detections per day</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>All detection types</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Basic accuracy</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Priority support</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">API access</span>
                </li>
              </ul>
              
              <Link
                href="/signup"
                className="block w-full text-center py-3 px-4 rounded-lg border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition"
              >
                Start Free
              </Link>
            </div>

            {/* Yearly Plan */}
            <div className="bg-primary-600 rounded-2xl shadow-xl p-8 text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Yearly</h3>
                <p className="text-primary-100 mb-4">Best value for regular users</p>
                <div className="text-4xl font-bold">
                  $9.99
                  <span className="text-lg font-normal text-primary-100">/year</span>
                </div>
                <p className="text-sm text-primary-200 mt-1">Less than $1/month!</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>Unlimited detections</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>All detection types</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>Enhanced accuracy</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>Email support</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-primary-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-200">API access</span>
                </li>
              </ul>
              
              <button
                onClick={() => handleSubscribe('yearly')}
                disabled={loading === 'yearly'}
                className="block w-full text-center py-3 px-4 rounded-lg bg-white text-primary-600 font-semibold hover:bg-gray-100 transition disabled:opacity-50"
              >
                {loading === 'yearly' ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-600 mb-4">For power users & businesses</p>
                <div className="text-4xl font-bold">
                  $99
                  <span className="text-lg font-normal text-gray-600">/year</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Unlimited detections</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>All detection types</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Maximum accuracy</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Full API access</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Bulk detection tools</span>
                </li>
              </ul>
              
              <button
                onClick={() => handleSubscribe('pro')}
                disabled={loading === 'pro'}
                className="block w-full text-center py-3 px-4 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading === 'pro' ? 'Processing...' : 'Go Pro'}
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-2">How accurate is the AI detection?</h3>
                <p className="text-gray-600">
                  Our advanced detection algorithms achieve 99.8% accuracy across all content types, powered by cutting-edge machine learning models and proprietary detection techniques.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">
                  Yes! You can cancel or change your subscription at any time from your account settings. No questions asked.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-2">Is my content kept private?</h3>
                <p className="text-gray-600">
                  Absolutely. We never store your content after analysis. All detections are processed in real-time and immediately discarded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}