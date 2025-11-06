// app/page.tsx
'use client'

import { ChatWidget } from '@/components/chat-widget'

export default function Page() {
  // No useSearchParams here. ChatWidget reads the URL (?tenantId, ?mode=bare) itself.
  return <ChatWidget />
}
