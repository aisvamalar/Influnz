import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  size?: 'md' | 'sm';
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  label?: string;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  size = 'md',
  disabled = false,
  invalid = false,
  autoFocus = false,
  label = 'One-time code',
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (i: number, raw: string) => {
    const clean = raw.replace(/\D/g, '');
    if (clean.length > 1) {
      onChange(clean.slice(0, length));
      refs.current[Math.min(clean.length, length) - 1]?.focus();
      return;
    }
    setAt(i, clean);
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      setAt(i - 1, '');
      refs.current[i - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    refs.current[Math.min(text.length, length) - 1]?.focus();
  };

  return (
    <div
      className={`aw-otp aw-otp--${size}${invalid ? ' is-invalid' : ''}`}
      role="group"
      aria-label={label}
      onPaste={handlePaste}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          className={`aw-otp__box${d ? ' is-filled' : ''}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={d}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onFocus={e => e.target.select()}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
