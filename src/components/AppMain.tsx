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
  const [progress, setProgress] = useState<number>(0);

  // Active Screen Section (0 to 5)
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Overlays state
  const [isCompetitionsOpen, setIsCompetitionsOpen] = useState<boolean>(false);
  const [isNewsOpen, setIsNewsOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductPlatform | null>(null);

  // Loader automatic progress animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds

    let frameId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(progressPercent);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
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
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center gap-6"
          >
            {/* Cinematic logo fade-in and scale-up */}
            <div className="flex flex-col items-center gap-4">
              <motion.img
                src="/logo.png"
                alt="FikraForge Logo"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="h-16 w-auto object-contain mb-2"
              />
            </div>

            {/* Seamless fill progress line */}
            <div className="w-56 h-[2px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#C94A1A] via-amber-500 to-[#F57C00] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* loading coordinates and percentage ticker */}
            <div className="flex justify-between w-56 font-mono text-[9px] text-white/35 uppercase tracking-[2.5px] mt-1 select-none">
              <span>SYSTEM BOOT</span>
              <span className="text-[#C94A1A] font-extrabold">{progress.toString().padStart(3, '0')}%</span>
            </div>
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
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
          <div className="flex flex-col gap-2">
            <img 
              src="/logo.png" 
              alt="FikraForge Logo" 
              className="h-8 w-auto object-contain self-start opacity-60 hover:opacity-100 transition-opacity"
            />
            <div className="font-sans text-[10px] md:text-xs text-white/35">
              &copy; 2026 FikraForge Inc. · Dar es Salaam, TZ
            </div>
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
