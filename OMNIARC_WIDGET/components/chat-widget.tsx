"use client"

import { useEffect, useState } from "react"
import { LauncherButton } from "./launcher-button"
import { ChatPanel } from "./chat-panel"
import { useChat } from "@/hooks/use-chat"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [tenantId, setTenantId] = useState("")
  const [widgetId, setWidgetId] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#0F1B3A")
  const [accentColor, setAccentColor] = useState("#2EC5FF")

  useEffect(() => {
    // Parse query params
    const params = new URLSearchParams(window.location.search)
    const tid = params.get("tenantId") || ""
    const wid = params.get("widgetId") || tid
    const primary = params.get("tenantPrimaryColor") || "#0F1B3A"
    const accent = params.get("tenantAccentColor") || "#2EC5FF"

    setTenantId(tid)
    setWidgetId(wid)
    setPrimaryColor(primary)
    setAccentColor(accent)

    // Set CSS variables
    document.documentElement.style.setProperty("--primary", primary)
    document.documentElement.style.setProperty("--accent", accent)
    document.documentElement.style.setProperty("--bg", "#FFFFFF")
  }, [])

  useEffect(() => {
    // Notify parent iframe of size changes
    const notifySize = () => {
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            source: "omniarc-widget",
            type: "size",
            width: isOpen ? Math.min(window.innerWidth * 0.92, 380) : 56,
            height: isOpen ? (window.innerWidth < 768 ? window.innerHeight * 0.85 : window.innerHeight * 0.7) : 56,
          },
          "*",
        )
      }
    }

    notifySize()
    window.addEventListener("resize", notifySize)
    return () => window.removeEventListener("resize", notifySize)
  }, [isOpen])

  useEffect(() => {
    // Handle ESC key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const chat = useChat(tenantId, widgetId)

  if (!tenantId) {
    return (
      <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <p>Error: tenantId is required. Please add ?tenantId=YOUR_TENANT_ID to the URL.</p>
      </div>
    )
  }

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 2147483000 }}>
      {isOpen ? (
        <ChatPanel
          messages={chat.messages}
          isTyping={chat.isTyping}
          isSending={chat.isSending}
          onSend={chat.sendMessage}
          onClose={() => setIsOpen(false)}
          onClear={chat.clearMessages}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      ) : (
        <LauncherButton
          onClick={() => setIsOpen(true)}
          hasUnread={false}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      )}
    </div>
  )
}
