/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, X } from 'lucide-react';

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
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <img 
            src="/logo.png" 
            alt="FikraForge Logo" 
            className="h-8 md:h-9 w-auto object-contain hover:scale-102 transition-transform duration-300"
          />
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


      </div>
    </>
  );
}
