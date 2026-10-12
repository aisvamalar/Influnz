import { useCallback, useEffect, useState } from 'react';

/** Demo mode: every OTP channel accepts this code. */
export const DEMO_OTP = '123456';
export const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export type OtpStatus = 'idle' | 'sending' | 'code' | 'checking' | 'verified';

export function useOtpVerification() {
  const [status, setStatus] = useState<OtpStatus>('idle');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const send = useCallback(() => {
    setStatus('sending');
    setError('');
    setCode('');
    setTimeout(() => {
      setStatus('code');
      setTimer(RESEND_SECONDS);
    }, 700);
  }, []);

  const confirm = useCallback((value: string) => {
    if (value.length < OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code`);
      return;
    }
    setStatus('checking');
    setError('');
    setTimeout(() => {
      if (value === DEMO_OTP) {
        setStatus('verified');
      } else {
        setStatus('code');
        setError('That code is incorrect. Check the message and try again.');
      }
    }, 600);
  }, []);

  const enter = useCallback((value: string) => {
    setCode(value);
    setError('');
    if (value.length === OTP_LENGTH) confirm(value);
  }, [confirm]);

  const reset = useCallback(() => {
    setStatus('idle');
    setCode('');
    setError('');
    setTimer(0);
  }, []);

  return { status, code, error, timer, send, confirm, enter, reset };
}

export type OtpVerification = ReturnType<typeof useOtpVerification>;
