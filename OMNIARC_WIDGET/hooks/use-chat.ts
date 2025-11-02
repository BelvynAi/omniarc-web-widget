"use client"

import { useState, useEffect, useCallback } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

const WEBHOOK_URL = "https://n8n.srv896614.hstgr.cloud/webhook/7cc3d8e3-1777-4eec-89ce-02b14573a3d4-omniarc"
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useChat(tenantId: string, widgetId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sessionId] = useState<string>(generateSessionId()) // Generate session ID immediately by calling the function

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
    }
  }, [tenantId])

  // Save messages to localStorage
  useEffect(() => {
    if (!tenantId || messages.length === 0) return

    const storageKey = `omniarc_messages_${tenantId}`
    localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages, tenantId])

  const fetchWithRetry = useCallback(async (payload: any, retryCount = 0): Promise<any> => {
    try {
      console.log("[v0] Attempting to send message (attempt", retryCount + 1, "of", MAX_RETRIES + 1, ")")

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Received response:", data)
      return data
    } catch (error) {
      console.error("[v0] Fetch attempt", retryCount + 1, "failed:", error)

      // Retry on network errors or 5xx errors
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount) // Exponential backoff
        console.log("[v0] Retrying in", delay, "ms...")
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithRetry(payload, retryCount + 1)
      }

      throw error
    }
  }, [])

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

        const data = await fetchWithRetry(payload)

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
        console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))

        const errorMessage: Message = {
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
        setIsSending(false)
      }
    },
    [tenantId, widgetId, sessionId, isSending, fetchWithRetry],
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
