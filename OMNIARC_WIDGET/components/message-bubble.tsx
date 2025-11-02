"use client"

import type { ReactNode, JSX } from "react"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  accentColor: string
  primaryColor: string
}

export function MessageBubble({ role, content, accentColor, primaryColor }: MessageBubbleProps) {
  const isUser = role === "user"

  const parseContent = (text: string): ReactNode => {
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    const boldRegex = /\*\*(.+?)\*\*/g
    let match

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      // Add bold text
      parts.push(
        <strong key={`bold-${match.index}`} style={{ fontWeight: "bold" }}>
          {match[1]}
        </strong>,
      )
      lastIndex = boldRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: isUser ? accentColor : "#FFFFFF",
          color: isUser ? "#FFFFFF" : primaryColor,
          border: isUser ? "none" : "1px solid #E9EDF3",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          borderBottomLeftRadius: isUser ? "20px" : "6px",
          borderBottomRightRadius: isUser ? "6px" : "20px",
          padding: "12px 16px",
          maxWidth: "70%",
          fontSize: "14px",
          lineHeight: "1.5",
          fontFamily: "system-ui, sans-serif",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        }}
      >
        {parseContent(content)}
      </div>
    </div>
  )
}
