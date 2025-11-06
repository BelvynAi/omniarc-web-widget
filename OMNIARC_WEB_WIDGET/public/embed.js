;(() => {
  // Configuration
  const WIDGET_URL = "https://your-deployment-url.vercel.app" // Replace with your deployment URL
  const LAUNCHER_SIZE = 56
  const CHAT_WIDTH = 380
  const CHAT_HEIGHT_DESKTOP = "70vh"
  const CHAT_HEIGHT_MOBILE = "85vh"

  // Get configuration from script tag data attributes or window variables
  function getConfig() {
    // Try multiple methods to get the script tag
    let script = document.currentScript
    if (!script) {
      const scripts = document.querySelectorAll("script[data-tenant-id]")
      script = scripts[scripts.length - 1]
    }
    if (!script) {
      const scripts = Array.from(document.scripts)
      script = scripts.find((s) => s.src?.includes("embed.js"))
    }

    return {
      tenantId: script?.dataset.tenantId || window.OMNIARC_TENANT_ID || "",
      widgetId: script?.dataset.widgetId || window.OMNIARC_WIDGET_ID || "",
      primaryColor: script?.dataset.primaryColor || window.OMNIARC_PRIMARY_COLOR || "#0F1B3A",
      accentColor: script?.dataset.accentColor || window.OMNIARC_ACCENT_COLOR || "#2EC5FF",
    }
  }

  const config = getConfig()

  if (!config.tenantId) {
    console.error(
      "[Omniarc Widget] Error: tenantId is required. Set data-tenant-id attribute or window.OMNIARC_TENANT_ID",
    )
    console.log("[Omniarc Widget] Available methods:")
    console.log("1. <script src='...' data-tenant-id='YOUR_ID'></script>")
    console.log("2. <script>window.OMNIARC_TENANT_ID = 'YOUR_ID'</script><script src='...'></script>")
    return
  }

  console.log("[Omniarc Widget] Initializing with config:", { tenantId: config.tenantId })

  // Create container
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

  // Build iframe URL with parameters
  const params = new URLSearchParams({
    tenantId: config.tenantId,
    widgetId: config.widgetId || config.tenantId,
    tenantPrimaryColor: config.primaryColor,
    tenantAccentColor: config.accentColor,
  })
  const iframeUrl = `${WIDGET_URL}?${params.toString()}`

  // Create iframe
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
    // Verify origin for security (optional but recommended)
    // if (!event.origin.startsWith(WIDGET_URL)) return;

    if (event.data?.source !== "omniarc-widget") return

    if (event.data?.type === "size") {
      const width = event.data.width || LAUNCHER_SIZE
      const height = event.data.height || LAUNCHER_SIZE

      iframe.style.width = width + "px"
      iframe.style.height = height + "px"

      // Center chat panel on mobile
      if (width > LAUNCHER_SIZE) {
        iframe.style.borderRadius = "12px"
        iframe.style.right = "auto"
        iframe.style.left = "50%"
        iframe.style.transform = "translateX(-50%)"

        // Handle mobile viewport
        if (window.innerWidth < 768) {
          iframe.style.width = "92vw"
          iframe.style.height = CHAT_HEIGHT_MOBILE
          iframe.style.maxWidth = CHAT_WIDTH + "px"
        } else {
          iframe.style.width = CHAT_WIDTH + "px"
          iframe.style.height = CHAT_HEIGHT_DESKTOP
        }
      } else {
        // Reset to launcher button
        iframe.style.borderRadius = "50%"
        iframe.style.right = "0"
        iframe.style.left = "auto"
        iframe.style.transform = "none"
      }

      // Update container size to prevent overflow
      container.style.width = Math.max(width, LAUNCHER_SIZE) + "px"
      container.style.height = Math.max(height, LAUNCHER_SIZE) + "px"
    }
  })

  // Append to page
  container.appendChild(iframe)
  document.body.appendChild(container)

  console.log("[Omniarc Widget] Widget loaded successfully")
})()
