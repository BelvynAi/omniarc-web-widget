// Universal embed script that works everywhere (HTML, Elementor, Framer, etc.)
// Usage: Copy this entire code into a Custom Code/HTML element

;(() => {
  const WIDGET_URL = "https://your-deployment-url.vercel.app" // REPLACE THIS
  const LAUNCHER_SIZE = 56
  const CHAT_WIDTH = 380
  const CHAT_HEIGHT_DESKTOP = "70vh"
  const CHAT_HEIGHT_MOBILE = "85vh"

  // Configuration - EDIT THESE VALUES
  const TENANT_ID = "YOUR_TENANT_ID" // REPLACE THIS
  const PRIMARY_COLOR = "#0F1B3A"
  const ACCENT_COLOR = "#2EC5FF"

  if (!TENANT_ID || TENANT_ID === "YOUR_TENANT_ID") {
    console.error("[Omniarc] Error: Please set TENANT_ID in the embed code")
    return
  }

  // Wait for DOM to be ready
  function init() {
    const container = document.createElement("div")
    container.id = "omniarc-widget-container"
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: ${LAUNCHER_SIZE}px;
      height: ${LAUNCHER_SIZE}px;
      z-index: 2147483000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `

    const params = new URLSearchParams({
      tenantId: TENANT_ID,
      tenantPrimaryColor: PRIMARY_COLOR,
      tenantAccentColor: ACCENT_COLOR,
    })
    const iframeUrl = `${WIDGET_URL}?${params.toString()}`

    const iframe = document.createElement("iframe")
    iframe.src = iframeUrl
    iframe.id = "omniarc-widget-iframe"
    iframe.style.cssText = `
      position: absolute;
      bottom: 0;
      right: 0;
      width: ${LAUNCHER_SIZE}px;
      height: ${LAUNCHER_SIZE}px;
      border: none;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: transparent;
      transition: all 200ms ease-out;
    `
    iframe.allow = "microphone; camera"
    iframe.setAttribute("aria-label", "Chat widget")

    // Handle messages from iframe
    window.addEventListener("message", (event) => {
      if (event.data?.source !== "omniarc-widget") return

      if (event.data?.type === "size") {
        const width = event.data.width || LAUNCHER_SIZE
        const height = event.data.height || LAUNCHER_SIZE

        iframe.style.width = width + "px"
        iframe.style.height = height + "px"

        if (width > LAUNCHER_SIZE) {
          iframe.style.borderRadius = "12px"
          iframe.style.right = "auto"
          iframe.style.left = "50%"
          iframe.style.transform = "translateX(-50%)"

          if (window.innerWidth < 768) {
            iframe.style.width = "92vw"
            iframe.style.height = CHAT_HEIGHT_MOBILE
            iframe.style.maxWidth = CHAT_WIDTH + "px"
          } else {
            iframe.style.width = CHAT_WIDTH + "px"
            iframe.style.height = CHAT_HEIGHT_DESKTOP
          }
        } else {
          iframe.style.borderRadius = "50%"
          iframe.style.right = "0"
          iframe.style.left = "auto"
          iframe.style.transform = "none"
        }

        container.style.width = Math.max(width, LAUNCHER_SIZE) + "px"
        container.style.height = Math.max(height, LAUNCHER_SIZE) + "px"
      }
    })

    container.appendChild(iframe)
    document.body.appendChild(container)
    console.log("[Omniarc] Widget loaded successfully")
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
