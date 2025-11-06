// Omniarc Chat Widget Embed Script
;(() => {
  console.log("[Omniarc] Embed script loaded")

  // Configuration
  const WIDGET_URL = "https://omniarc-web-widget.vercel.app"

  // Get configuration from script tag or window variables
  function getConfig() {
    let tenantId = ""
    let primaryColor = "#0F1B3A"
    let accentColor = "#2EC5FF"

    // Try to find the script tag
    const scripts = document.querySelectorAll('script[src*="embed.js"]')
    const script = scripts[scripts.length - 1]

    if (script) {
      tenantId = script.getAttribute("data-tenant-id") || ""
      primaryColor = script.getAttribute("data-primary-color") || primaryColor
      accentColor = script.getAttribute("data-accent-color") || accentColor
    }

    // Fallback to window variables
    tenantId = tenantId || window.OMNIARC_TENANT_ID || ""
    primaryColor = window.OMNIARC_PRIMARY_COLOR || primaryColor
    accentColor = window.OMNIARC_ACCENT_COLOR || accentColor

    return { tenantId, primaryColor, accentColor }
  }

  function initWidget() {
    const config = getConfig()

    console.log("[Omniarc] Config:", config)

    if (!config.tenantId) {
      console.error('[Omniarc] Error: tenantId is required. Add data-tenant-id="YOUR_ID" to the script tag.')
      return
    }

    // Check if widget already exists
    if (document.getElementById("omniarc-widget-iframe")) {
      console.log("[Omniarc] Widget already loaded")
      return
    }

    // Build iframe URL
    const params = new URLSearchParams({
      tenantId: config.tenantId,
      tenantPrimaryColor: config.primaryColor,
      tenantAccentColor: config.accentColor,
    })

    const iframeUrl = `${WIDGET_URL}?${params.toString()}`
    console.log("[Omniarc] Creating iframe:", iframeUrl)

    // Create iframe
    const iframe = document.createElement("iframe")
    iframe.id = "omniarc-widget-iframe"
    iframe.src = iframeUrl
    iframe.title = "Omniarc Chat Widget"
    iframe.setAttribute("allow", "clipboard-read; clipboard-write")

    iframe.style.cssText = [
      "position: fixed",
      "bottom: 0",
      "right: 0",
      "width: 450px",
      "height: 100vh",
      "max-height: 700px",
      "border: none",
      "z-index: 2147483647",
      "background: transparent",
      "pointer-events: auto",
    ].join(";")

    // Mobile responsive
    if (window.innerWidth < 768) {
      iframe.style.width = "100vw"
      iframe.style.height = "100vh"
    }

    // Append to body
    try {
      document.body.appendChild(iframe)
      console.log("[Omniarc] Widget iframe added to page")
    } catch (error) {
      console.error("[Omniarc] Error appending iframe:", error)
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget)
  } else {
    // DOM already loaded
    initWidget()
  }

  // Also try after a short delay for page builders
  setTimeout(initWidget, 100)
})()
