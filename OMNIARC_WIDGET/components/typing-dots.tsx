"use client"

export function TypingDots() {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "12px 16px",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "20px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
        maxWidth: "fit-content",
      }}
    >
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid #E9EDF3",
            borderTop: "2px solid #2EC5FF",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ color: "#64748B", fontSize: "14px", fontFamily: "system-ui, sans-serif" }}>Typing...</span>
      </div>
    </div>
  )
}
