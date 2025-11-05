'use client';

import { ChatWidget } from "@/components/chat-widget";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();
  const isBare = params?.get("mode") === "bare";

  return (
    <div
      className={`w-full h-full ${
        isBare
          ? "bg-transparent shadow-none rounded-none"
          : "bg-white shadow-lg rounded-2xl"
      }`}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <ChatWidget isBare={isBare} />
    </div>
  );
}
