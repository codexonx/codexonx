'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CodeXonXLogo } from '@/components/ui/codexonx-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Icons component with additional icons
const Icons = {
  github: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        'h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-[#181717]',
        className
      )}
      aria-hidden="true"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  twitter: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        'h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-[#1DA1F2]',
        className
      )}
      aria-hidden="true"
    >
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
  linkedin: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        'h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0A66C2]',
        className
      )}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        'h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-[#E1306C]',
        className
      )}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.882 1.44 1.44 0 000-2.882z" />
    </svg>
  ),
  youtube: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        'h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF0000]',
        className
      )}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  discord: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M13 8H7" />
      <path d="M17 12H7" />
    </svg>
  ),
  mail: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  arrowUp: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  ),
  check: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  zap: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
    </svg>
  ),
  fileText: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  code: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  graduationCap: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M22 10v6" />
      <path d="M12 3 2 9l10 6 10-6-10-6z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  penSquare: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M3 3h18v18H3z" />
      <path d="M9 15l6-6 2 2-6 6H9v-2z" />
    </svg>
  ),
  listChecks: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M3 7l2 2 4-4" />
      <path d="M3 17l2 2 4-4" />
      <line x1="13" y1="6" x2="21" y2="6" />
      <line x1="13" y1="12" x2="21" y2="12" />
      <line x1="13" y1="18" x2="21" y2="18" />
    </svg>
  ),
  signal: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M2 20h2" />
      <path d="M6 18h2" />
      <path d="M10 16h2" />
      <path d="M14 14h2" />
      <path d="M18 12h2" />
    </svg>
  ),
  folderOpen: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M3 7h4l2 2h12a2 2 0 0 1 2 2l-1 8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
    </svg>
  ),
  layoutTemplate: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  puzzle: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M22 13v3a2 2 0 0 1-2 2h-3v3l-4-4 4-4v3h3v-3z" />
      <path d="M2 11V8a2 2 0 0 1 2-2h3V3l4 4-4 4V8H4v3z" />
    </svg>
  ),
  palette: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M12 3a9 9 0 0 0-9 9 6 6 0 0 0 6 6h.5a1.5 1.5 0 1 1 0 3H9a9 9 0 1 0 3-18z" />
      <circle cx="6.5" cy="11.5" r="1.5" />
      <circle cx="9.5" cy="7.5" r="1.5" />
      <circle cx="14.5" cy="7.5" r="1.5" />
      <circle cx="17.5" cy="11.5" r="1.5" />
    </svg>
  ),
  layers: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  users: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  lifeBuoy: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M4.93 4.93l4.24 4.24" />
      <path d="M14.83 14.83l4.24 4.24" />
      <path d="M4.93 19.07l4.24-4.24" />
      <path d="M14.83 9.17l4.24-4.24" />
    </svg>
  ),
  building2: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M3 21V7a2 2 0 0 1 2-2h6l4 4v12" />
      <path d="M7 21v-4h6v4" />
      <path d="M7 13h6" />
    </svg>
  ),
  phone: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.1.9.3 1.78.6 2.63a2 2 0 0 1-.45 2.11L8 9c1.5 2.9 3.9 5.3 6.8 6.8l.54-.25a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.74 1.72z" />
    </svg>
  ),
  mapPin: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  briefcase: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-4 w-4', className)}
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  chevronRight: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-3 w-3', className)}
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  ),
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const FooterLink = ({ href, children, className, icon }: FooterLinkProps) => (
  <li className="flex items-center gap-2">
    {icon && <span className="text-muted-foreground">{icon}</span>}
    <Link
      href={href}
      className={cn(
        'text-sm text-muted-foreground hover:text-foreground transition-colors',
        className
      )}
    >
      {children}
    </Link>
  </li>
);

const LanguageSelect = () => (
  <div className="relative">
    <label htmlFor="language-select" className="sr-only">
      Dil Seçiniz
    </label>
    <select
      id="language-select"
      className="appearance-none bg-transparent border border-border rounded-md py-1.5 pl-3 pr-8 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      defaultValue="tr"
      aria-label="Dil seçimi"
    >
      <option value="tr">Türkçe</option>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

const SiteFooter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  // Social media data with follower counts (simulated)
  const socialMedia = [
    {
      name: 'GitHub',
      icon: <Icons.github className="group-hover:scale-110 transition-transform" />,
      url: 'https://github.com/codexonx',
      followers: '12.5k',
      color: 'hover:text-[#181717]',
      tooltip: "GitHub'da bizi takip edin",
    },
    {
      name: 'Twitter',
      icon: <Icons.twitter className="group-hover:scale-110 transition-transform" />,
      url: 'https://twitter.com/codexonx',
      followers: '8.2k',
      color: 'hover:text-[#1DA1F2]',
      tooltip: "Twitter'da bizi takip edin",
    },
    {
      name: 'LinkedIn',
      icon: <Icons.linkedin className="group-hover:scale-110 transition-transform" />,
      url: 'https://linkedin.com/company/codexonx',
      followers: '5.7k',
      color: 'hover:text-[#0A66C2]',
      tooltip: "LinkedIn'de bağlantı kurun",
    },
    {
      name: 'Instagram',
      icon: <Icons.instagram className="group-hover:scale-110 transition-transform" />,
      url: 'https://instagram.com/codexonx',
      followers: '15.3k',
      color: 'hover:text-[#E1306C]',
      tooltip: "Instagram'da bizi takip edin",
    },
    {
      name: 'YouTube',
      icon: <Icons.youtube className="group-hover:scale-110 transition-transform" />,
      url: 'https://youtube.com/codexonx',
      followers: '23.1k',
      color: 'hover:text-[#FF0000]',
      tooltip: "YouTube'da bizi takip edin",
    },
  ];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Lütfen bir e-posta adresi giriniz');
      return;
    }

    if (!validateEmail(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would call your subscription API here
      // await subscribeToNewsletter(email);

      setIsSubscribed(true);
      setEmail('');

      // Reset subscription status after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      console.error('Subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t bg-background/95 backdrop-blur-sm relative">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1 z-50"
        aria-label="Sayfa başına dön"
      >
        <Icons.arrowUp className="h-5 w-5" />
      </button>

      <div className="container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Social */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center space-x-3">
              <CodeXonXLogo size="lg" />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  CodeXonX
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Next Generation Development</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Modern yazılım geliştirme araçları ve kaynakları ile projelerinizi bir sonraki
              seviyeye taşıyın. Hızlı, güvenli ve ölçeklenebilir çözümler sunuyoruz.
            </p>

            {/* Enhanced Social Media Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium text-foreground">Bizi Takip Edin</h3>
              <div className="flex flex-wrap gap-2">
                {socialMedia.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 ${social.color}`}
                    aria-label={social.tooltip}
                    data-tooltip={social.tooltip}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-foreground/80 group-hover:scale-110 transition-transform">
                        {social.icon}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {social.followers}
                      </span>
                    </div>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1.5 px-2.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {social.tooltip}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground transform rotate-45"></span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Newsletter Subscription */}
            <div className="pt-4">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-5 rounded-xl border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Icons.mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground mb-1.5">
                      Bültenimize Kaydolun
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      En son güncellemelerden ve yeniliklerden haberdar olun.
                    </p>

                    {isSubscribed ? (
                      <div className="flex items-center gap-2 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md">
                        <Icons.check className="h-4 w-4 flex-shrink-0" />
                        <span>Teşekkürler! Aboneliğiniz alındı. 🎉</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSubscribe} className="space-y-2">
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className={`h-11 text-sm pl-4 pr-32 ${error ? 'border-red-500' : ''}`}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isLoading}
                          />
                          <Button
                            type="submit"
                            className="absolute right-1 top-1 h-9 px-4 text-sm font-medium"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center gap-2">
                                <span className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin"></span>
                                Gönderiliyor...
                              </span>
                            ) : (
                              'Abone Ol'
                            )}
                          </Button>
                        </div>
                        {error && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {error}
                          </p>
                        )}
                      </form>
                    )}

                    <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                      Abone olarak,{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Gizlilik Politikamızı
                      </a>{' '}
                      kabul etmiş olursunuz. İstediğiniz zaman aboneliğinizi iptal edebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Icons.zap className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">Hızlı Erişim</h3>
            </div>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {[
                {
                  name: 'Dokümantasyon',
                  href: '/docs',
                  icon: (
                    <Icons.fileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'API Referansı',
                  href: '/api',
                  icon: (
                    <Icons.code className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Eğitimler',
                  href: '/tutorials',
                  icon: (
                    <Icons.graduationCap className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Blog',
                  href: '/blog',
                  icon: (
                    <Icons.penSquare className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Sürüm Notları',
                  href: '/changelog',
                  icon: (
                    <Icons.listChecks className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Sistem Durumu',
                  href: '/status',
                  icon: (
                    <Icons.signal className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                  badge: (
                    <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Çevrimiçi
                    </span>
                  ),
                },
              ].map(item => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.badge && <span className="ml-auto">{item.badge}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Icons.folderOpen className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-foreground">Kaynaklar</h3>
            </div>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {[
                {
                  name: 'Şablonlar',
                  href: '/templates',
                  icon: (
                    <Icons.layoutTemplate className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                  badge: 'Yeni',
                },
                {
                  name: 'Eklentiler',
                  href: '/plugins',
                  icon: (
                    <Icons.puzzle className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Temalar',
                  href: '/themes',
                  icon: (
                    <Icons.palette className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Projeler',
                  href: '/showcase',
                  icon: (
                    <Icons.layers className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Topluluk',
                  href: '/community',
                  icon: (
                    <Icons.users className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
                {
                  name: 'Destek',
                  href: '/support',
                  icon: (
                    <Icons.lifeBuoy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  ),
                },
              ].map(item => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Company */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icons.building2 className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-foreground">İletişim</h3>
              </div>
              <ul className="space-y-3 list-none p-0 m-0">
                <li className="flex items-start gap-3">
                  <Icons.mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <a
                      href="mailto:info@codexonx.com"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      info@codexonx.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Icons.phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <a
                      href="tel:+905551234567"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      +90 555 123 45 67
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Icons.mapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adres</p>
                    <p className="text-sm text-foreground">
                      Teknopark İstanbul,
                      <br />
                      İTÜ ARI 3, 34467
                      <br />
                      Sarıyer/İstanbul
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icons.briefcase className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-foreground">Şirket</h3>
              </div>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {[
                  { name: 'Hakkımızda', href: '/about' },
                  { name: 'Kariyer', href: '/careers' },
                  { name: 'Basın', href: '/press' },
                  { name: 'İş Ortakları', href: '/partners' },
                  { name: 'SSS', href: '/faq' },
                ].map(item => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-1.5"
                    >
                      <Icons.chevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-4 sm:flex-row md:items-center">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {currentYear} <span className="font-medium text-foreground">CodeXonX</span>. Tüm
                hakları saklıdır.
              </p>
              <div className="flex items-center gap-4">
                <FooterLink href="/privacy" className="text-xs hover:underline">
                  Gizlilik Politikası
                </FooterLink>
                <span className="h-4 w-px bg-border" aria-hidden="true" />
                <FooterLink href="/terms" className="text-xs hover:underline">
                  Kullanım Koşulları
                </FooterLink>
                <span className="h-4 w-px bg-border" aria-hidden="true" />
                <FooterLink href="/cookies" className="text-xs hover:underline">
                  Çerez Politikası
                </FooterLink>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSelect />
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </div>
        </div>

        {/* Made with love */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Made with <span className="text-red-500">❤️</span> in Turkey •
            <a
              href="https://github.com/yourusername/codexonx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline ml-1"
            >
              Kaynak Kodu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
