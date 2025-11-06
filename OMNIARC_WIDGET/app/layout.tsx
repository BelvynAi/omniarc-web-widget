// app/page.tsx
'use client'

import { ChatWidget } from '@/components/chat-widget'

// No useSearchParams here. The widget reads ?tenantId and ?mode=bare by itself.
export default function Page() {
  return <ChatWidget />
}
