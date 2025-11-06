;(() => {
  // Configuration
  const WIDGET_URL = "https://omniarc-web-widget.vercel.app" // Updated deployment URL

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
      primaryColor: script?.dataset.primaryColor || window.OMNIARC_PRIMARY_COLOR || "#0F1B3A",
      accentColor: script?.dataset.accentColor || window.OMNIARC_ACCENT_COLOR || "#2EC5FF",
    }
  }

  const config = getConfig()

  if (!config.tenantId) {
    console.error("[Omniarc] tenantId required. Use data-tenant-id attribute or window.OMNIARC_TENANT_ID")
    return
  }

  console.log("[Omniarc Widget] Initializing with config:", { tenantId: config.tenantId })

  // Build iframe URL
  const baseUrl = WIDGET_URL
  const params = new URLSearchParams({
    tenantId: config.tenantId,
    tenantPrimaryColor: encodeURIComponent(config.primaryColor),
    tenantAccentColor: encodeURIComponent(config.accentColor),
  })

  // Create iframe with fixed dimensions
  const iframe = document.createElement("iframe")
  iframe.src = `${baseUrl}?${params}`
  iframe.style.cssText =
    "position:fixed;bottom:0;right:0;width:450px;height:100vh;max-height:700px;border:none;z-index:2147483647;background:transparent;pointer-events:auto;"
  iframe.setAttribute("allow", "clipboard-read; clipboard-write")
  iframe.setAttribute("title", "Omniarc Chat Widget")

  // Mobile responsive
  if (window.innerWidth < 768) {
    iframe.style.width = "100vw"
    iframe.style.height = "100vh"
  }

  // Append to body when ready
  if (document.body) {
    document.body.appendChild(iframe)
  } else {
    document.addEventListener("DOMContentLoaded", () => document.body.appendChild(iframe))
  }

  console.log("[Omniarc Widget] Widget loaded successfully")
})()
