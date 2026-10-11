import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import './auth-web.css';

interface FormFieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  help?: ReactNode;
  full?: boolean;
  children: ReactNode;
}

export default function FormField({ id, label, optional, error, help, full, children }: FormFieldProps) {
  return (
    <div className={`aw-field${full ? ' aw-field--full' : ''}`}>
      <label className="aw-label" htmlFor={id}>
        {label}
        {optional && <span className="aw-opt">Optional</span>}
      </label>
      {children}
      {error ? (
        <p className="aw-error" id={`${id}-err`} role="alert">
          <CircleAlert size={13} />
          {error}
        </p>
      ) : help ? (
        <p className="aw-help">{help}</p>
      ) : null}
    </div>
  );
}
