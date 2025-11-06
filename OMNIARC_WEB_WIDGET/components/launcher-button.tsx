"use client"

interface LauncherButtonProps {
  onClick: () => void
  hasUnread: boolean
  primaryColor: string
  accentColor: string
}

export function LauncherButton({ onClick, hasUnread, primaryColor, accentColor }: LauncherButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open chat"
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        backgroundColor: primaryColor,
        border: hasUnread ? `3px solid ${accentColor}` : "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 150ms ease",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 3px ${accentColor}40`
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white" />
      </svg>
    </button>
  )
}
