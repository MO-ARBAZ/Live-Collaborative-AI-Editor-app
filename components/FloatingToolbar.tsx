'use client'

import { useState } from 'react'
import { Wand2, Eye, Check, X, Zap, Type, List, Sparkles } from 'lucide-react'

interface FloatingToolbarProps {
  position: { x: number; y: number }
  selectedText: string
  onAIEdit: (text: string, action: string) => Promise<string>
  onReplace: (newText: string) => void
}

export default function FloatingToolbar({ position, selectedText, onAIEdit, onReplace }: FloatingToolbarProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState('')

  const handleAIAction = async (action: string, label: string) => {
    setLoading(true)
    setCurrentAction(label)
    const suggestion = await onAIEdit(selectedText, action)
    setAiSuggestion(suggestion)
    setShowPreview(true)
    setLoading(false)
  }

  const actions = [
    { 
      label: 'Shorten', 
      action: 'Make this text shorter and more concise', 
      icon: <Zap size={12} />,
      color: 'from-orange-500 to-red-500'
    },
    { 
      label: 'Expand', 
      action: 'Expand this text with more details', 
      icon: <Type size={12} />,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Fix Grammar', 
      action: 'Fix grammar and spelling errors in this text', 
      icon: <Check size={12} />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'To Table', 
      action: 'Convert this text into a table format', 
      icon: <List size={12} />,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <>
      <div 
        className="floating-toolbar"
        style={{ left: position.x, top: position.y }}
      >
        {actions.map((item) => (
          <button
            key={item.label}
            onClick={() => handleAIAction(item.action, item.label)}
            disabled={loading}
            className={`px-3 py-2 text-xs font-medium text-white rounded-lg bg-gradient-to-r ${item.color} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <button
          onClick={() => handleAIAction('Improve this text', 'AI Edit')}
          disabled={loading}
          className="px-3 py-2 text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
        >
          <Sparkles size={12} />
          AI Edit
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <Eye size={24} />
                Preview Changes - {currentAction}
              </h3>
              <p className="text-indigo-100 mt-1 text-sm">Review the AI suggestion before applying</p>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">Original Text</h4>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedText}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">AI Suggestion</h4>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">{aiSuggestion}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={() => {
                  onReplace(aiSuggestion)
                  setShowPreview(false)
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <Check size={16} />
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}