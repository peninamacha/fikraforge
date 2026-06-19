/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import StudioSection from './StudioSection';
import PortfolioSection from './PortfolioSection';
import SocialProofSection from './SocialProofSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import ServicesSection from './ServicesSection';
import CompetitionOverlay from './CompetitionOverlay';
import NewsOverlay from './NewsOverlay';
import PortfolioOverlay from './PortfolioOverlay';
import { ProductPlatform } from '../types';

export default function AppMain() {
  // Preloader State
  const [loading, setLoading] = useState<boolean>(true);

  // Active Screen Section (0 to 5)
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Overlays state
  const [isCompetitionsOpen, setIsCompetitionsOpen] = useState<boolean>(false);
  const [isNewsOpen, setIsNewsOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductPlatform | null>(null);

  // Loader automatic timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard and ESC handlers to dismiss overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement?.tagName;
      if (activeEl === 'INPUT' || activeEl === 'TEXTAREA' || activeEl === 'SELECT') return;

      if (e.key === 'Escape') {
        setIsCompetitionsOpen(false);
        setIsNewsOpen(false);
        setSelectedProduct(null);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePageNavigate = (idx: number) => {
    setCurrentSection(idx);
    setIsMenuOpen(false);
    // Smoothly scroll browser window to top for page transition feel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'studio', label: 'Design Studio' }
  ];

  return (
    <>
      {/* 1. Global Preloader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center gap-6"
          >
            {/* Pulsing Ember logo mark with brand orange colors */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center animate-[pulse_1.5s_infinite_alternate] shadow-lg shadow-[#C94A1A]/10">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="loader-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C94A1A" />
                      <stop offset="100%" stopColor="#F57C00" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M12 2L4 6.5V15.5L12 20L20 15.5V6.5L12 2Z" 
                    stroke="url(#loader-logo-grad)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="opacity-40"
                  />
                  <path 
                    d="M10 16V8.5H15M10 11.5H13.5M10 16C10 16 11.2 16 12 15.5C12.8 15 13.2 14.1 13.2 13.2C13.2 10.5 10.5 9.7 12.2 7" 
                    stroke="url(#loader-logo-grad)" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-sans font-semibold text-lg md:text-xl text-[#F5F5F7] tracking-widest uppercase">
                FikraForge
              </span>
            </div>

            {/* Seamless fill line */}
            <div className="w-48 h-[1px] bg-white/10 rounded overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
                className="h-full bg-gradient-to-r from-[#C94A1A] to-[#F57C00]"
              />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-[3.5px] text-white/40 block">
              Where ideas meet the forge
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Site Structure */}
      <div className="min-h-screen bg-[#050505] text-[#F5F5F7] selection:bg-[#C94A1A]/30 selection:text-white font-sans flex flex-col relative">
        
        {/* Animated Radial ambient orbs with brand sunset orange glow */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#C94A1A]/8 blur-[130px] -top-40 -right-40 animate-[pulse_12s_infinite_alternate]" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[#E0531E]/4 blur-[120px] -bottom-20 -left-20 animate-[pulse_10s_infinite_alternate_2s_delay]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px] opacity-75" />
        </div>

        {/* Global sticky navigation menu */}
        <Navbar
          currentSection={currentSection}
          onNavigate={(idx) => handlePageNavigate(idx)}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          onCloseMenu={() => setIsMenuOpen(false)}
        />

        {/* Standard Multi-Page Render View - Naturally Scrollable Container */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 z-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full"
            >
              {currentSection === 0 && (
                <HeroSection
                  onLearnMore={() => handlePageNavigate(2)}
                  onContactClick={(options) => {
                    handlePageNavigate(4);
                    if (options && options.scrollToId) {
                      setTimeout(() => {
                        window.location.hash = '';
                        window.location.hash = options.scrollToId!;
                      }, 300);
                    }
                  }}
                  onProductClick={(p) => setSelectedProduct(p)}
                  onOpenNews={() => setIsNewsOpen(true)}
                />
              )}
              {currentSection === 1 && (
                <PortfolioSection
                  onProductClick={(p) => setSelectedProduct(p)}
                />
              )}
              {currentSection === 2 && (
                <ServicesSection
                  onEnquireClick={() => handlePageNavigate(4)}
                />
              )}
              {currentSection === 3 && <AboutSection />}
              {currentSection === 4 && <ContactSection />}
              {currentSection === 5 && (
                <StudioSection
                  onOpenCompetitions={() => setIsCompetitionsOpen(true)}
                  onEnquireClick={() => handlePageNavigate(4)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global footer scrolling with content naturally */}
        <footer 
          className="w-full border-t border-white/5 bg-[#050505]/95 backdrop-blur-md py-8 flex flex-col sm:flex-row items-center justify-between px-6 md:px-12 z-[100] gap-4"
          role="contentinfo"
        >
          <div className="font-sans text-[10px] md:text-xs text-white/35">
            &copy; 2026 FikraForge Inc. · Dar es Salaam, TZ
          </div>

          <div className="flex gap-4 font-sans text-[10px] md:text-xs text-white/35">
            <a 
              href="https://barakazetu.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors cursor-pointer text-white/40"
            >
              Privacy Policy
            </a>
            <span className="text-white/10">|</span>
            <a 
              href="https://jamiispot.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors cursor-pointer text-white/40"
            >
              Terms of Use
            </a>
          </div>
        </footer>

        {/* Overlay Modals Panels */}
        <AnimatePresence>
          {isCompetitionsOpen && (
            <CompetitionOverlay
              isOpen={isCompetitionsOpen}
              onClose={() => setIsCompetitionsOpen(false)}
              onEnquireClick={() => setCurrentSection(4)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isNewsOpen && (
            <NewsOverlay
              isOpen={isNewsOpen}
              onClose={() => setIsNewsOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProduct && (
            <PortfolioOverlay
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
