export function OrdocLogo({ className = "", size }: { className?: string; size?: number }) {
  const iconSize = size || 32
  const iconClass = size ? `w-[${size}px] h-[${size}px]` : "size-8"
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${iconClass} rounded-lg bg-primary flex items-center justify-center`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 text-primary-foreground"
        >
          <path
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-xl font-semibold tracking-tight">Ordoc</span>
    </div>
  )
}
