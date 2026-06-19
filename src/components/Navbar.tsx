/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, X, Landmark, Lock } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  currentSection: number;
  onNavigate: (index: number) => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

export default function Navbar({
  currentSection,
  onNavigate,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu
}: NavbarProps) {
  const links = [
    { label: 'Home', index: 0 },
    { label: 'Portfolio', index: 1 },
    { label: 'Services', index: 2 },
    { label: 'About', index: 3 },
    { label: 'Contact', index: 4 },
    { label: 'Design Studio', index: 5 }
  ];

  return (
    <>
      <nav 
        className="fixed top-0 inset-x-0 z-[200] flex items-center justify-between px-6 md:px-12 h-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md"
        role="navigation"
        aria-label="Main navigation"
      >
        <div 
          onClick={() => { onNavigate(0); onCloseMenu(); }}
          className="flex items-center gap-2.5 font-sans font-semibold text-sm md:text-base tracking-tight text-white cursor-pointer select-none"
        >
          {/* FikraForge Logo Mark - Custom Premium SVG with glow */}
          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:rotate-6 transition-all duration-300 shadow-md shadow-[#C94A1A]/5">
            <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C94A1A" />
                  <stop offset="100%" stopColor="#F57C00" />
                </linearGradient>
              </defs>
              <path 
                d="M12 2L4 6.5V15.5L12 20L20 15.5V6.5L12 2Z" 
                stroke="url(#nav-logo-grad)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="opacity-40"
              />
              <path 
                d="M10 16V8.5H15M10 11.5H13.5M10 16C10 16 11.2 16 12 15.5C12.8 15 13.2 14.1 13.2 13.2C13.2 10.5 10.5 9.7 12.2 7" 
                stroke="url(#nav-logo-grad)" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="tracking-tight text-white/95 font-bold uppercase text-xs md:text-sm tracking-[2px] font-mono">FikraForge</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1.5 list-none m-0 p-0">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {links.map((link) => (
              <li key={link.index}>
                <button
                  onClick={() => onNavigate(link.index)}
                  className={`font-sans text-xs font-medium px-4 py-2 rounded-full cursor-pointer border-0 bg-transparent transition-all select-none ${
                    currentSection === link.index
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                  aria-current={currentSection === link.index ? 'page' : undefined}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="w-px h-5 bg-white/10 mx-1.5" />

          {/* Admin Vault Quick Enter button */}
          <Link
            href="/ouradmin"
            className="font-mono text-[10px] uppercase font-bold tracking-wider px-3.5 py-2 rounded-full cursor-pointer flex items-center gap-1.5 transition-all select-none bg-transparent border border-white/10 text-white/50 hover:text-white hover:border-white/20"
            title="Authenticate Admin Vault Control Room"
          >
            <Lock className="w-3 h-3 stroke-white/50" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMenu}
          className="md:hidden flex items-center justify-center p-1.5 rounded bg-transparent border-0 text-white/60 hover:text-white cursor-pointer transition-colors"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile nav drawer */}
      <div
        id="mobile-nav-panel"
        className={`md:hidden fixed inset-x-0 top-16 bg-[#050505]/97 backdrop-blur-2xl border-b border-white/5 z-[199] px-6 py-4 flex flex-col gap-1 transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {links.map((link) => (
          <button
            key={link.index}
            onClick={() => {
              onNavigate(link.index);
              onCloseMenu();
            }}
            className={`font-sans text-left text-sm py-3 border-b border-white/5 bg-transparent border-t-0 border-x-0 cursor-pointer transition-colors select-none ${
              currentSection === link.index ? 'text-white font-semibold pl-1' : 'text-white/60 hover:text-white'
            }`}
          >
            {link.label}
          </button>
        ))}

        {/* Mobile Admin gate link */}
        <Link
          href="/ouradmin"
          onClick={onCloseMenu}
          className="font-mono text-left text-xs uppercase tracking-wide py-3 bg-transparent border-0 cursor-pointer transition-colors select-none flex items-center gap-2 text-white/45 hover:text-white"
        >
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Admin Controls</span>
        </Link>
      </div>
    </>
  );
}
