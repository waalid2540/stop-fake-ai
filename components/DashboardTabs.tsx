'use client'

import { useState } from 'react'
import { FileText, Image, Mic } from 'lucide-react'
import TextDetection from './TextDetection'
import ImageDetection from './ImageDetection'
import AudioDetection from './AudioDetection'

type TabType = 'text' | 'image' | 'audio'

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('text')

  const tabs = [
    { id: 'text' as TabType, name: 'Text Detection', icon: FileText },
    { id: 'image' as TabType, name: 'Image/Video Detection', icon: Image },
    { id: 'audio' as TabType, name: 'Audio Detection', icon: Mic },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'text' && <TextDetection />}
        {activeTab === 'image' && <ImageDetection />}
        {activeTab === 'audio' && <AudioDetection />}
      </div>
    </div>
  )
}