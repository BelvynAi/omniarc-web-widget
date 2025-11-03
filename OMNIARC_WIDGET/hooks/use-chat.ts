"use client"

import { useState, useEffect, useCallback } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

const WEBHOOK_URL = "https://n8n.srv896614.hstgr.cloud/webhook/7cc3d8e3-1777-4eec-89ce-02b14573a3d4-omniarc"
const WELCOME_MESSAGE = "Hey there! I'm ARC — here to help answer your questions or guide you to the right info"

const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useChat(tenantId: string, widgetId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sessionId] = useState<string>(generateSessionId())

  // Load messages from localStorage
  useEffect(() => {
    if (!tenantId) return

    const storageKey = `omniarc_messages_${tenantId}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setMessages(JSON.parse(stored))
      } catch (e) {
        console.error("[v0] Failed to parse stored messages:", e)
      }
    } else {
      const welcomeMessage: Message = {
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: Date.now(),
      }
      setMessages([welcomeMessage])
    }
  }, [tenantId])

  // Save messages to localStorage
  useEffect(() => {
    if (!tenantId || messages.length === 0) return

    const storageKey = `omniarc_messages_${tenantId}`
    localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages, tenantId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isSending) return

      const userMessage: Message = {
        role: "user",
        content,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsSending(true)
      setIsTyping(true)

      try {
        const payload = {
          chatInput: content,
          tenantId,
          widgetId,
          sessionId,
          context: {
            referrer: document.referrer,
            path: window.location.href,
            locale: navigator.language,
          },
        }

        console.log("[v0] Sending message to webhook:", payload)

        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        const data = await response.json()
        console.log("[v0] Received response:", data)

        if (!response.ok || data.error) {
          const errorMessage = data.output || data.error || `HTTP ${response.status}: ${response.statusText}`
          throw new Error(errorMessage)
        }

        let assistantContent = ""
        if (data.output) {
          assistantContent = data.output
        } else if (data.reply) {
          assistantContent = data.reply
        } else if (data.messages && Array.isArray(data.messages)) {
          const assistantMsg = data.messages.find((m: any) => m.role === "assistant")
          assistantContent = assistantMsg?.content || "No response received"
        } else {
          assistantContent = "No response received"
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: assistantContent,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error("[v0] Error sending message:", error)
        const errorText = error instanceof Error ? error.message : String(error)

        const errorMessage: Message = {
          role: "assistant",
          content: errorText,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
        setIsSending(false)
      }
    },
    [tenantId, widgetId, sessionId, isSending],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    if (tenantId) {
      const storageKey = `omniarc_messages_${tenantId}`
      localStorage.removeItem(storageKey)
    }
  }, [tenantId])

  return {
    messages,
    isTyping,
    isSending,
    sendMessage,
    clearMessages,
  }
}
