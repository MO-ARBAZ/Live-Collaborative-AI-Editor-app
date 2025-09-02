import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, type } = await request.json()

    // Mock AI response for demo (replace with actual AI API)
    let response = ''
    
    if (type === 'edit') {
      // Handle text editing requests
      if (message.includes('shorter') || message.includes('Shorten')) {
        response = message.replace(/^.*?: "/, '').replace(/"$/, '').substring(0, 50) + '...'
      } else if (message.includes('longer') || message.includes('Expand')) {
        response = message.replace(/^.*?: "/, '').replace(/"$/, '') + ' This text has been expanded with additional context and details to provide more comprehensive information.'
      } else if (message.includes('grammar') || message.includes('Fix')) {
        response = message.replace(/^.*?: "/, '').replace(/"$/, '').replace(/\b\w/g, l => l.toUpperCase())
      } else if (message.includes('table') || message.includes('Table')) {
        const text = message.replace(/^.*?: "/, '').replace(/"$/, '')
        response = `| Item | Description |\n|------|-------------|\n| ${text} | Details about ${text} |`
      } else {
        response = message.replace(/^.*?: "/, '').replace(/"$/, '') + ' [AI Enhanced]'
      }
    } else {
      // Handle chat requests
      if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        response = 'Hello! I\'m your AI assistant. I can help you edit text, answer questions, and assist with your writing. Try selecting some text in the editor to see my editing capabilities!'
      } else if (message.toLowerCase().includes('help')) {
        response = 'I can help you with:\n• Text editing (select text to see options)\n• Grammar and spelling fixes\n• Making text shorter or longer\n• Converting text to tables\n• General writing assistance\n\nJust ask me anything or select text in the editor!'
      } else {
        response = `I understand you said: "${message}". I'm a demo AI assistant. In a real implementation, I would process your request using OpenAI, Claude, or another AI service. For now, I can help with text editing when you select text in the editor!`
      }
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}