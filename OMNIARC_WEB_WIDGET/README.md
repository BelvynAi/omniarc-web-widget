# Omniarc Chat Widget

A standalone embeddable chat widget built with React and Next.js.

## Features

- 🎨 Customizable tenant theming via query parameters
- 💾 Persistent message history in localStorage
- ♿ Fully accessible with ARIA labels and keyboard navigation
- 📱 Responsive design (mobile and desktop)
- 🔒 Focus trap when open, ESC to close
- ✨ Smooth animations and transitions

## Embedding

Add this snippet to your website:

\`\`\`html
<iframe
  src="https://widget.omniarc.app/widget.html?tenantId=YOUR_TENANT_ID"
  style="border:0; width:0; height:0; position:fixed; bottom:24px; right:24px; z-index:2147483000;"
  id="omniarc-widget"
  allow="clipboard-read; clipboard-write"
></iframe>
<script>
  window.addEventListener('message', (e) => {
    if (!e.data || e.data.source !== 'omniarc-widget') return;
    const f = document.getElementById('omniarc-widget');
    if (e.data.type === 'size' && f) {
      f.style.width  = e.data.width + 'px';
      f.style.height = e.data.height + 'px';
    }
  });
</script>
\`\`\`

## Query Parameters

- `tenantId` (required) - Your unique tenant identifier
- `widgetId` (optional) - Widget identifier (defaults to tenantId)
- `tenantPrimaryColor` (optional) - Primary color hex (default: #0F1B3A)
- `tenantAccentColor` (optional) - Accent color hex (default: #2EC5FF)

## Example

\`\`\`
https://widget.omniarc.app/?tenantId=demo&tenantPrimaryColor=%230F1B3A&tenantAccentColor=%232EC5FF
\`\`\`

## Webhook Integration

The widget sends POST requests to the configured webhook with:

\`\`\`json
{
  "chatInput": "User message text",
  "tenantId": "tenant-id",
  "widgetId": "widget-id",
  "context": {
    "referrer": "https://example.com",
    "path": "https://example.com/page",
    "locale": "en-US"
  }
}
\`\`\`

Expected response format:

\`\`\`json
{
  "reply": "Assistant response text"
}
\`\`\`

Or:

\`\`\`json
{
  "messages": [
    {
      "role": "assistant",
      "content": "Assistant response text"
    }
  ]
}
\`\`\`

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000?tenantId=demo` to test the widget.
