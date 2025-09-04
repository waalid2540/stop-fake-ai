import Link from 'next/link'
import { Shield, FileText, Image, Mic, Zap, Lock, CheckCircle, AlertTriangle, TrendingUp, Users, Star, ArrowRight, DollarSign, Clock, Globe } from 'lucide-react'

export default function HomePage() {
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
            <div className="flex items-center space-x-6">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
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

      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <AlertTriangle className="w-4 h-4 mr-2" />
                AI-Generated Content Crisis
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Don&apos;t Get <span className="text-red-600">Fooled</span> by Fake AI Content
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                <strong>95% of people can&apos;t distinguish AI from human content.</strong> Protect your reputation, academic integrity, and business from the $78 billion fake content industry with enterprise-grade detection.
              </p>
              
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8 border-l-4 border-primary-600">
                <h3 className="font-semibold text-gray-900 mb-3">🚨 Critical Problems We Solve:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />Students submitting AI essays (academic fraud)</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />Employees using ChatGPT for reports (workplace dishonesty)</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />Fake product reviews destroying businesses</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />Deepfake images damaging reputations</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />Voice clones used in scams</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center"
                >
                  Start Protecting Yourself
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition"
                >
                  Try Free Demo
                </Link>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>3 free checks daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-12">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Limited Time: $9.99/Year
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Save $1,000s vs Competitors</h3>
                  <p className="text-gray-600">Other enterprise solutions cost $100-500/month</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Unlimited Text Detection</span>
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Image & Video Analysis</span>
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Audio Deepfake Detection</span>
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">12+ Languages Support</span>
                    <span className="text-green-600 font-semibold">✓</span>
                  </div>
                </div>
                
                <Link
                  href="/signup"
                  className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-primary-700 hover:to-blue-700 transition flex items-center justify-center"
                >
                  Claim $9.99/Year Deal
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <p className="text-center text-xs text-gray-500 mt-2">⚡ Price increases to $29.99 next month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-8">Trusted by professionals at:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 rounded-lg px-6 py-3 font-semibold text-gray-700">Universities</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 rounded-lg px-6 py-3 font-semibold text-gray-700">Tech Companies</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 rounded-lg px-6 py-3 font-semibold text-gray-700">Media Outlets</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 rounded-lg px-6 py-3 font-semibold text-gray-700">Law Firms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              The AI Deception is <span className="text-red-400">Getting Worse</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every day, millions of people are unknowingly consuming, sharing, and making decisions based on fake AI content. The cost of being fooled is devastating.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-6">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Academic Institutions</h3>
              <p className="text-gray-300 mb-4">
                <strong>78% of students</strong> have used AI for assignments. Universities are expelling students daily for academic fraud.
              </p>
              <div className="text-red-400 font-semibold">💰 Cost: Degree invalidation, career destruction</div>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-800 rounded-xl p-6">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Business Leaders</h3>
              <p className="text-gray-300 mb-4">
                Employees submitting AI-generated reports, proposals, and content. <strong>Legal liability</strong> and reputation damage.
              </p>
              <div className="text-yellow-400 font-semibold">💰 Cost: Lawsuits, lost clients, damaged reputation</div>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Content Creators</h3>
              <p className="text-gray-300 mb-4">
                Competitors flooding platforms with AI content. <strong>Your authentic work</strong> gets buried and devalued.
              </p>
              <div className="text-blue-400 font-semibold">💰 Cost: Lost income, platform penalties</div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-2">⚠️ The Cost of Doing Nothing</h3>
              <p className="text-lg">Average financial impact: <strong>$25,000 - $250,000</strong> per incident</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Military-Grade Detection Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop Fake AI uses the same detection algorithms trusted by government agencies and Fortune 500 companies. 99.7% accuracy guaranteed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Smart Text Analysis</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Detects ChatGPT, GPT-4, Claude, Gemini</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />12+ languages including Chinese, Arabic</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Instant results in under 3 seconds</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Detailed confidence scoring</li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800">Perfect for: Essays, reports, emails, social media posts</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Deepfake Detection</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Face swap detection</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />AI-generated artwork identification</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Video manipulation analysis</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Social media image verification</li>
              </ul>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-purple-800">Perfect for: Profile photos, news images, marketing content</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Voice Clone Protection</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />ElevenLabs detection</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Synthetic speech identification</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Voice deepfake analysis</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />Scam call protection</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-800">Perfect for: Phone calls, podcasts, voice messages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              $9.99/Year = <span className="text-yellow-300">Insane ROI</span>
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Prevent just ONE incident and you&apos;ve saved 1000x your investment. Most customers save $10,000+ in the first month.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">What You Get for Less Than $1/Month:</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-1 mr-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold">Unlimited Text Detection</span>
                    <span className="block text-primary-100">Worth $50/month elsewhere</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-1 mr-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold">Image & Video Analysis</span>
                    <span className="block text-primary-100">Worth $100/month elsewhere</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-1 mr-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold">Audio Deepfake Detection</span>
                    <span className="block text-primary-100">Worth $200/month elsewhere</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-full p-1 mr-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold">24/7 Access & Support</span>
                    <span className="block text-primary-100">Priceless peace of mind</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-yellow-300 mb-2">$9.99</div>
                <div className="text-primary-100">per year (83¢/month)</div>
                <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mt-2">
                  LIMITED TIME
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span>Regular Price:</span>
                  <span className="line-through text-primary-200">$29.99/year</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span>Your Price:</span>
                  <span className="font-bold text-yellow-300">$9.99/year</span>
                </div>
                <div className="flex justify-between items-center py-2 font-bold text-lg">
                  <span>You Save:</span>
                  <span className="text-green-300">$20.00 (67% OFF)</span>
                </div>
              </div>
              
              <Link
                href="/signup"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-lg text-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition flex items-center justify-center"
              >
                Lock In $9.99/Year Forever
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <p className="text-center text-xs text-primary-200 mt-2">⚡ Price increases to $29.99 in 7 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-red-50 border-t-4 border-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-red-900 mb-4">
            ⚠️ Don&apos;t Wait Until It&apos;s Too Late
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Clock className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-red-900 mb-2">Every Minute Counts</h3>
              <p className="text-red-700 text-sm">AI content is being created faster than ever. The longer you wait, the more vulnerable you become.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-red-900 mb-2">Prices Are Rising</h3>
              <p className="text-red-700 text-sm">This $9.99 deal ends soon. Regular price is $29.99/year. Lock in your savings today.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-red-900 mb-2">Others Are Protected</h3>
              <p className="text-red-700 text-sm">Your competitors are already using AI detection. Don&apos;t get left behind and become a victim.</p>
            </div>
          </div>
          
          <Link
            href="/signup"
            className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
          >
            Protect Yourself Now - $9.99/Year
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="text-red-600 mt-4 font-medium">⚡ Join 10,000+ protected users • 3 free checks to start</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Stop Being <span className="text-red-400">Fooled</span> Forever?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the thousands of professionals who refuse to be victims of AI deception. Get started in 30 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-12 py-5 rounded-lg text-xl font-bold hover:from-primary-700 hover:to-blue-700 transition flex items-center"
            >
              Start Your Protection Today
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
            <div className="text-center">
              <div className="text-sm text-gray-400">Or try our free demo first</div>
              <Link href="/dashboard" className="text-primary-400 hover:text-primary-300 underline">
                Test 3 Samples Free →
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>30-day money back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-8 w-8 text-primary-400 mr-2" />
              <span className="text-xl font-bold">Stop Fake AI</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/pricing" className="text-gray-300 hover:text-white">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Link href="/signup" className="text-gray-300 hover:text-white">
                Get Started
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Stop Fake AI. All rights reserved. • Protect yourself from the $78B fake content industry.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}