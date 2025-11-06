"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageBubble } from "./message-bubble"
import { TypingDots } from "./typing-dots"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface ChatPanelProps {
  messages: Message[]
  isTyping: boolean
  isSending: boolean
  onSend: (message: string) => void
  onClose: () => void
  onClear: () => void
  primaryColor: string
  accentColor: string
}

export function ChatPanel({
  messages,
  isTyping,
  isSending,
  onSend,
  onClose,
  onClear,
  primaryColor,
  accentColor,
}: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [isInputFocused, setIsInputFocused] = useState(false) // Added state to track input focus for shadow effect
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  useEffect(() => {
    // Focus input when panel opens
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // Focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusableElements = panelRef.current?.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])')
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [])

  const handleSubmit = () => {
    if (!input.trim() || isSending) return
    onSend(input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Chat widget"
      style={{
        width: typeof window !== "undefined" ? `${Math.min(window.innerWidth * 0.92, 380)}px` : "380px",
        height: isMobile ? "90vh" : "75vh", // increased height to accommodate footer
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "slideIn 150ms ease",
      }}
    >
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          backgroundColor: primaryColor,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/images/design-mode/f9934892f_Omniarclogo.png"
            alt="Omniarc logo"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
          <div>
            <div style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "600", fontFamily: "system-ui, sans-serif" }}>
              Arc
            </div>
            <div style={{ color: "#FFFFFF", fontSize: "12px", opacity: 0.9, fontFamily: "system-ui, sans-serif" }}>
              Always available • Instant replies
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={onClear}
            aria-label="Clear chat"
            title="Clear chat"
            style={{
              background: "none",
              border: "none",
              color: "#FFFFFF",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px",
              lineHeight: 1,
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onFocus={(e) => {
              e.currentTarget.style.opacity = "0.8"
            }}
            onBlur={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              background: "none",
              border: "none",
              color: "#FFFFFF",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px",
              lineHeight: 1,
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.opacity = "0.8"
            }}
            onBlur={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          backgroundColor: "#F9FAFB",
        }}
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
            accentColor={accentColor}
            primaryColor={primaryColor}
          />
        ))}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <TypingDots />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #E9EDF3",
          backgroundColor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isSending}
            aria-label="Message input"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #E9EDF3",
              fontSize: "14px",
              fontFamily: "system-ui, sans-serif",
              height: "40px",
              outline: "none",
              opacity: isSending ? 0.6 : 1,
              boxShadow: isInputFocused ? "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)" : "none",
              transition: "box-shadow 150ms ease, border-color 150ms ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accentColor
              setIsInputFocused(true)
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E9EDF3"
              setIsInputFocused(false)
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isSending}
            aria-label="Send message"
            style={{
              backgroundColor: "transparent",
              color: input.trim() && !isSending ? accentColor : "#9CA3AF",
              border: "none",
              borderRadius: "10px",
              padding: "8px",
              cursor: input.trim() && !isSending ? "pointer" : "not-allowed",
              transition: "opacity 150ms ease",
              fontFamily: "system-ui, sans-serif",
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              width: "40px",
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isSending) {
                e.currentTarget.style.opacity = "0.7"
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "11px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <a
            href="https://omniarc.co/privacypolicy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#9CA3AF",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#6B7280"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9CA3AF"
            }}
          >
            Privacy Policy
          </a>

          <div style={{ display: "flex", gap: "4px" }}>
            <span style={{ color: "#9CA3AF" }}>Powered by</span>
            <a
              href="https://omniarc.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: primaryColor,
                textDecoration: "none",
                fontWeight: "600",
                transition: "opacity 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1"
              }}
            >
              Omniarc
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
