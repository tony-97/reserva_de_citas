import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PortalCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export function PortalCard({ title, description, icon, href }: PortalCardProps) {
  return (
    <Link 
      to={href}
      className="block group bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 leading-relaxed">
        {description}
      </p>
      <div className="mt-6 flex items-center text-blue-600 font-medium text-sm">
        Ingresar al portal
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
