"use client"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  accentColor: string
  primaryColor: string
}

export function MessageBubble({ role, content, accentColor, primaryColor }: MessageBubbleProps) {
  const isUser = role === "user"

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
          borderBottomLeftRadius: isUser ? "20px" : "6px", // Smaller radius for bot messages
          borderBottomRightRadius: isUser ? "6px" : "20px", // Smaller radius for user messages
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
        {content}
      </div>
    </div>
  )
}
