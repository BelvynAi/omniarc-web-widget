"use client"

import { useEffect, useMemo, useState } from "react"
import { LauncherButton } from "./launcher-button"
import { ChatPanel } from "./chat-panel"
import { useChat } from "@/hooks/use-chat"

type ChatWidgetProps = {
  /** Optional: pass from page.tsx. If omitted, we also read ?mode=bare from the URL. */
  isBare?: boolean
}

export function ChatWidget({ isBare }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tenantId, setTenantId] = useState("")
  const [widgetId, setWidgetId] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#0F1B3A")
  const [accentColor, setAccentColor] = useState("#2EC5FF")
  const [bareFromQuery, setBareFromQuery] = useState(false)

  // Read query params (tenant, colors, and mode)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tid = params.get("tenantId") || ""
    const wid = params.get("widgetId") || tid
    const primary = params.get("tenantPrimaryColor") || "#0F1B3A"
    const accent = params.get("tenantAccentColor") || "#2EC5FF"
    const mode = (params.get("mode") || "").toLowerCase()

    setTenantId(tid)
    setWidgetId(wid)
    setPrimaryColor(primary)
    setAccentColor(accent)
    setBareFromQuery(mode === "bare")
  }, [])

  // Effective bare flag (prop wins if provided, else URL param)
  const effectiveIsBare = useMemo(() => {
    return typeof isBare === "boolean" ? isBare : bareFromQuery
  }, [isBare, bareFromQuery])

  // Set CSS variables (bg becomes transparent in bare mode)
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primaryColor)
    document.documentElement.style.setProperty("--accent", accentColor)
    document.documentElement.style.setProperty("--bg", effectiveIsBare ? "transparent" : "#FFFFFF")
  }, [primaryColor, accentColor, effectiveIsBare])

  // Notify parent iframe of size changes
  useEffect(() => {
    const notifySize = () => {
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            source: "omniarc-widget",
            type: "size",
            width: isOpen ? Math.min(window.innerWidth * 0.92, 380) : 56,
            height: isOpen
              ? (window.innerWidth < 768 ? window.innerHeight * 0.85 : window.innerHeight * 0.7)
              : 56,
          },
          "*",
        )
      }
    }

    notifySize()
    window.addEventListener("resize", notifySize)
    return () => window.removeEventListener("resize", notifySize)
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const chat = useChat(tenantId, widgetId)

  if (!tenantId) {
    return (
      <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
        <p>Error: tenantId is required. Please add ?tenantId=YOUR_TENANT_ID to the URL.</p>
      </div>
    )
  }

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2147483000 }}>
      {isOpen ? (
        // Card wrapper: removes white bg, radius, and shadow in bare mode
        <div
          style={{
            background: effectiveIsBare ? "transparent" : "#FFFFFF",
            boxShadow: effectiveIsBare ? "none" : "0 12px 40px rgba(0,0,0,.24)",
            borderRadius: effectiveIsBare ? 0 : 16,
            overflow: "hidden",
            width: Math.min(window.innerWidth * 0.92, 380),
            height: window.innerWidth < 768 ? window.innerHeight * 0.85 : window.innerHeight * 0.7,
          }}
        >
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
        </div>
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
