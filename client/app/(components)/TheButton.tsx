import { ButtonHTMLAttributes, ReactNode } from 'react';

interface TheButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function TheButton ({ children, ...rest }: TheButtonProps) {
  return (
    <button className="px-4 py-2 bg-slate-600 text-white shadow-md rounded" {...rest}>
      {children}
    </button>
  )
}