/**
 * Influnz AI assistant mascot, drawn as SVG so it scales crisply at any size.
 */
export default function RobotMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="rmHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ece9f1" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="9" r="4" fill="#ef7a63" />
      <rect x="30.5" y="11" width="3" height="7" rx="1.5" fill="#d9d4de" />
      <rect x="6" y="26" width="7" height="16" rx="3.5" fill="#ef7a63" />
      <rect x="51" y="26" width="7" height="16" rx="3.5" fill="#ef7a63" />
      <rect x="10" y="17" width="44" height="34" rx="14" fill="url(#rmHead)" stroke="#e3dee8" />
      <rect x="16" y="23" width="32" height="22" rx="9" fill="#1d2140" />
      <path d="M22.5 33.5c1.2-2.4 4.4-2.4 5.6 0M35.9 33.5c1.2-2.4 4.4-2.4 5.6 0" stroke="#7fe3ff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M28.5 38.5c2 1.6 5 1.6 7 0" stroke="#7fe3ff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
