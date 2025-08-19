export function GenieLampLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Paper/Document background */}
      <path
        d="M6 4h16c1.1 0 2 .9 2 2v20c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M6 4h16c1.1 0 2 .9 2 2v20c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Document lines */}
      <line x1="8" y1="8" x2="20" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="8" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

      {/* Genie Lamp */}
      {/* Lamp base */}
      <ellipse cx="16" cy="22" rx="6" ry="2" fill="currentColor" opacity="0.8" />

      {/* Lamp body */}
      <path d="M12 22c0-2 1-4 4-4s4 2 4 4" fill="currentColor" opacity="0.9" />

      {/* Lamp spout */}
      <path d="M20 20c1-1 2-1 3-0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Lamp handle */}
      <path
        d="M12 20c-1-1-2-1-3-0.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Magic sparkles */}
      <circle cx="18" cy="16" r="0.5" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="18" r="0.3" fill="currentColor" opacity="0.4" />
      <circle cx="14" cy="17" r="0.4" fill="currentColor" opacity="0.5" />

      {/* Lamp lid/top */}
      <ellipse cx="16" cy="18" rx="3" ry="0.8" fill="currentColor" />
    </svg>
  )
}

export default GenieLampLogo
