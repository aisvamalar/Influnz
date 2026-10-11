/**
 * Brand marks for social platforms (lucide-react ships no brand icons).
 */
export type PlatformId = 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'x';

const TIKTOK_PATH =
  'M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z';

export default function PlatformMark({ id, size = 22 }: { id: PlatformId; size?: number }) {
  switch (id) {
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <defs>
            <linearGradient id="pmIg" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fdb437" />
              <stop offset=".4" stopColor="#f0345c" />
              <stop offset=".75" stopColor="#c02cb4" />
              <stop offset="1" stopColor="#6a3cdb" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6.5" fill="url(#pmIg)" />
          <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.8" />
          <circle cx="16" cy="8" r="1" fill="#fff" />
        </svg>
      );
    case 'youtube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#ff0000" />
          <path d="M10 9l5.2 3L10 15V9z" fill="#fff" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#000" />
          <g transform="translate(4.8 4.6) scale(0.6)">
            <path d={TIKTOK_PATH} fill="#25f4ee" transform="translate(-1 -1)" />
            <path d={TIKTOK_PATH} fill="#fe2c55" transform="translate(1 1)" />
            <path d={TIKTOK_PATH} fill="#fff" />
          </g>
        </svg>
      );
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#1877f2" />
          <path d="M13.4 20v-6.4h2.2l.35-2.6H13.4V9.4c0-.75.22-1.27 1.3-1.27h1.38V5.8a18 18 0 0 0-2-.1c-2 0-3.35 1.2-3.35 3.42V11H8.5v2.6h2.23V20z" fill="#fff" />
        </svg>
      );
    case 'x':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#000" />
          <g transform="translate(5 5) scale(0.58)">
            <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2z" fill="#fff" />
          </g>
        </svg>
      );
  }
}
