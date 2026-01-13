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
      {/* iPhone-style frame */}
      <div style={styles.iphoneFrame}>
        {/* iOS Messages header */}
        <div style={styles.iosHeader}>
          <div style={styles.headerTop}>
            <span style={styles.backArrow}>‹</span>
            <div style={styles.contactInfo}>
              <img src="/logo.png" alt="100 Tips" style={styles.avatar} />
              <span style={styles.contactName}>100 Anxiety Tips</span>
            </div>
            <div style={styles.headerSpacer}></div>
          </div>
        </div>

        {/* Messages area */}
        <div style={styles.messagesArea}>
          {messages.length === 0 && (
            <div style={styles.welcome}>
              <p style={styles.welcomeText}>
                Hey :) I'm your anxiety support buddy with 100+ tips ready to help. What's got you anxious right now?
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.messageRow,
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  ...(msg.role === 'user' ? styles.userBubble : styles.assistantBubble),
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
              <div style={{ ...styles.bubble, ...styles.assistantBubble, ...styles.typingBubble }}>
                <div style={styles.typingDots}>
                  <span style={{ ...styles.dot, animationDelay: '0ms' }}>•</span>
                  <span style={{ ...styles.dot, animationDelay: '150ms' }}>•</span>
                  <span style={{ ...styles.dot, animationDelay: '300ms' }}>•</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* iOS-style input bar */}
        <form onSubmit={sendMessage} style={styles.inputBar}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="iMessage"
            style={styles.textInput}
            disabled={isLoading}
          />
          <button
            type="submit"
            style={{
              ...styles.sendButton,
              opacity: input.trim() ? 1 : 0.4,
            }}
            disabled={isLoading || !input.trim()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#007AFF"/>
              <path d="M12 6L12 18M12 6L7 11M12 6L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>

      {/* Branding below phone */}
      <p style={styles.branding}>Powered by 100 Anxiety Tips</p>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  iphoneFrame: {
    width: '100%',
    maxWidth: '400px',
    height: 'calc(100vh - 100px)',
    maxHeight: '750px',
    backgroundColor: '#ffffff',
    borderRadius: '40px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  iosHeader: {
    background: 'linear-gradient(180deg, #f8f8f8 0%, #f2f2f7 100%)',
    padding: '12px 16px 12px 16px',
    borderBottom: '1px solid #c6c6c8',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: '32px',
    color: '#007AFF',
    fontWeight: '300',
    width: '30px',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  avatar: {
    width: '70px',
    height: 'auto',
    objectFit: 'contain',
  },
  contactName: {
    fontSize: '11px',
    color: '#000',
    fontWeight: '500',
  },
  headerSpacer: {
    width: '30px',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  welcome: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  welcomeText: {
    color: '#8e8e93',
    fontSize: '15px',
    lineHeight: 1.5,
    margin: 0,
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  bubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '18px',
    fontSize: '16px',
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },
  assistantBubble: {
    backgroundColor: '#e9e9eb',
    color: '#000000',
    borderBottomLeftRadius: '4px',
  },
  typingBubble: {
    paddingTop: '14px',
    paddingBottom: '14px',
  },
  typingDots: {
    display: 'flex',
    gap: '4px',
  },
  dot: {
    fontSize: '20px',
    color: '#8e8e93',
    animation: 'pulse 1s infinite',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px 24px 12px',
    backgroundColor: '#f8f8f8',
    borderTop: '1px solid #c6c6c8',
  },
  textInput: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '16px',
    border: '1px solid #c6c6c8',
    borderRadius: '20px',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  sendButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  branding: {
    marginTop: '16px',
    fontSize: '13px',
    color: '#5a4a5c',
  },
}
