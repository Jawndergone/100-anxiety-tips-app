'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages }),
      })

      const data = await response.json()

      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>100 Anxiety Tips</h1>
        <p style={styles.subtitle}>Tell me what you're feeling, and I'll help you through it</p>
      </header>

      <main style={styles.chatContainer}>
        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={styles.welcome}>
              <p>👋 Hi there! I'm here to help you with anxiety.</p>
              <p>Tell me what's on your mind or how you're feeling right now, and I'll share some tips that might help.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage),
              }}
            >
              {msg.content}
            </div>
          ))}

          {isLoading && (
            <div style={{ ...styles.message, ...styles.assistantMessage }}>
              <span style={styles.typing}>Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How are you feeling right now?"
            style={styles.input}
            disabled={isLoading}
          />
          <button type="submit" style={styles.button} disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    color: '#2d3748',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: 0,
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  welcome: {
    backgroundColor: '#e6f3ff',
    padding: '20px',
    borderRadius: '12px',
    color: '#2d3748',
    lineHeight: 1.6,
  },
  message: {
    padding: '12px 16px',
    borderRadius: '16px',
    maxWidth: '85%',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  userMessage: {
    backgroundColor: '#4a9eff',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
  },
  assistantMessage: {
    backgroundColor: '#f0f4f8',
    color: '#2d3748',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
  },
  typing: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  inputForm: {
    display: 'flex',
    gap: '10px',
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '24px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#4a9eff',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
}
