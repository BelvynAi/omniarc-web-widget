"use client"

import { useEffect, useMemo, useState } from "react"
import { LauncherButton } from "./launcher-button"
import { ChatPanel } from "./chat-panel"
import { useChat } from "@/hooks/use-chat"

type ChatWidgetProps = {
  /** Optional: you can ignore this. URL ?mode=bare also works. */
  isBare?: boolean
}

export function ChatWidget({ isBare }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tenantId, setTenantId] = useState("")
  const [widgetId, setWidgetId] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#0F1B3A")
  const [accentColor, setAccentColor] = useState("#2EC5FF")
  const [bareFromQuery, setBareFromQuery] = useState(false)

  // 1) Read query params (tenant/colors/mode)
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

  // 2) Effective "bare" flag: prop wins; else URL
  const effectiveIsBare = useMemo(
    () => (typeof isBare === "boolean" ? isBare : bareFromQuery),
    [isBare, bareFromQuery],
  )

  // 3) Make the iframe page fully transparent (kills white squares on WordPress)
  useEffect(() => {
    document.documentElement.style.background = "transparent"
    document.body.style.background = "transparent"
  }, [])

  // 4) Set CSS variables (bg is transparent in bare mode)
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primaryColor)
    document.documentElement.style.setProperty("--accent", accentColor)
    document.documentElement.style.setProperty("--bg", effectiveIsBare ? "transparent" : "#FFFFFF")
  }, [primaryColor, accentColor, effectiveIsBare])

  // 5) Notify parent (if it listens) so iframe can resize automatically
  useEffect(() => {
    const notifySize = () => {
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            source: "omniarc-widget",
            type: "size",
            // When closed, we ask parent to be a tiny bubble; when open, parent can expand.
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

  // 6) ESC to close
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
    <div
      // fixed to the corner; no background here at all
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2147483000 }}
    >
      {isOpen ? (
        // Only show a container when OPEN.
        // In bare mode this container is transparent (no shadow/no radius).
        // Width/height are 100% so it fills whatever the iframe size is (works great on WordPress).
        <div
          style={{
            background: effectiveIsBare ? "transparent" : "#FFFFFF",
            boxShadow: effectiveIsBare ? "none" : "0 12px 40px rgba(0,0,0,.24)",
            borderRadius: effectiveIsBare ? 0 : 16,
            overflow: "hidden",
            width: "100%",
            height: "100%",
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
        // When CLOSED we render ONLY the button (no wrapper background)
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
