import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', required, ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-500 focus:border-primary-500 hover:border-slate-300'}
              disabled:bg-slate-50 disabled:text-slate-500`}
            required={required}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
