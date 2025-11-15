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
    
    // Combined regex for both bold text and URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const boldRegex = /\*\*(.+?)\*\*/g
    
    // Split by URLs first
    const urlParts = text.split(urlRegex)
    
    urlParts.forEach((part, index) => {
      // Check if this part is a URL
      if (urlRegex.test(part)) {
        urlRegex.lastIndex = 0 // Reset regex
        parts.push(
          <a
            key={`link-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isUser ? "#FFFFFF" : accentColor,
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            {part}
          </a>
        )
      } else {
        // Parse for bold text within this part
        let lastIndex = 0
        let match
        const boldParts: (string | JSX.Element)[] = []
        
        while ((match = boldRegex.exec(part)) !== null) {
          if (match.index > lastIndex) {
            boldParts.push(part.substring(lastIndex, match.index))
          }
          boldParts.push(
            <strong key={`bold-${index}-${match.index}`} style={{ fontWeight: "bold" }}>
              {match[1]}
            </strong>
          )
          lastIndex = boldRegex.lastIndex
        }
        
        if (lastIndex < part.length) {
          boldParts.push(part.substring(lastIndex))
        }
        
        parts.push(...boldParts)
      }
    })

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
          color: isUser ? "#FFFFFF" : "#1F2937",
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
