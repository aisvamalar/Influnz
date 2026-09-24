/**
 * Influnz Logo — uses the actual brand logo.png asset.
 * size controls the rendered height; width scales automatically.
 * inverted adds a white background pill (for use on dark/coral panels).
 */
import logoImg from '../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  markOnly?: boolean;   // reserved for future icon-only crop
  inverted?: boolean;   // wraps in a white pill for dark backgrounds
}

const heights: Record<NonNullable<LogoProps['size']>, number> = {
  sm:  28,
  md:  36,
  lg:  48,
  xl:  64,
};

export default function Logo({ size = 'md', inverted = false }: LogoProps) {
  const h = heights[size];

  if (inverted) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          borderRadius: Math.round(h * 0.35),
          padding: `${Math.round(h * 0.15)}px ${Math.round(h * 0.28)}px`,
          border: '1px solid rgba(255,255,255,0.25)',
        }}
      >
        <img
          src={logoImg}
          alt="Influnz"
          height={Math.round(h * 0.72)}
          style={{ height: Math.round(h * 0.72), width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </span>
    );
  }

  return (
    <img
      src={logoImg}
      alt="Influnz"
      height={h}
      style={{ height: h, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}
