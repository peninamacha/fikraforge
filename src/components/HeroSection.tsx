/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Cpu, 
  Wrench, 
  Trophy, 
  Flame, 
  ArrowUpRight, 
  Quote, 
  Newspaper,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProducts, getFeedbacks, getNews, DbProduct, DbTestimonial, DbNewsArticle } from '../lib/db';
import { ProductPlatform } from '../types';
import { getCMSData, CMSData } from '../lib/cms';


interface HeroSectionProps {
  onLearnMore: () => void;
  onContactClick: (options?: { scrollToId?: string }) => void;
  onProductClick: (product: ProductPlatform) => void;
  onOpenNews: () => void;
}

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    title: 'Digital Software Casts',
    tagline: 'HIGH PERFORMANCE CODE REPOSITORY',
    description: 'Compiling secure full-stack web architectures, offline fallback databases, responsive mobile app clients, and cloud gateways under precision parameters.',
    cellCode: 'CELL_DIG_01'
  },
  {
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&w=1200&q=80',
    title: 'Physical Models & CNC Milling',
    tagline: 'SPATIAL STRUCTURE MILLING',
    description: 'Generating precise industrial mechanical blueprints, 3D printing rapid prototypes with high-grade FDM filaments, and structural test frames.',
    cellCode: 'CELL_MEC_02'
  },
  {
    image: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=1200&q=80',
    title: 'IP & Licensing Consultancy',
    tagline: 'COMPREHENSIVE PATENT DESIGN',
    description: 'Assisting growing startups with comprehensive intellectual property formulation, NDA architectures, and formal BRELA registration frameworks.',
    cellCode: 'CELL_LAW_03'
  }
];

export default function HeroSection({ 
  onLearnMore, 
  onContactClick, 
  onProductClick,
  onOpenNews
}: HeroSectionProps) {

  const [cms, setCms] = useState<CMSData>(getCMSData);
  const [products, setProducts] = useState<DbProduct[]>(getProducts);
  const [feedbacks, setFeedbacks] = useState<DbTestimonial[]>(getFeedbacks);
  const [news, setNews] = useState<DbNewsArticle[]>(getNews);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CMSData>;
      if (customEvent.detail) {
        setCms(customEvent.detail);
      }
    };
    window.addEventListener('fikra_cms_updated', handleUpdate);

    const handleDbUpdate = () => {
      setProducts(getProducts());
      setFeedbacks(getFeedbacks());
      setNews(getNews());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);

    return () => {
      window.removeEventListener('fikra_cms_updated', handleUpdate);
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  // Filtering latest 3 approved updates for home view
  const latestNews = news.filter(n => n.approved !== false).slice(0, 3);
  const approvedProducts = products.filter(p => p.approved !== false);
  const approvedFeedbacks = feedbacks.filter(t => t.approved !== false);

  return (
    <div className="flex flex-col gap-24">
      
      {/* ================= SECTION 1: HERO TOP LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-4">
        {/* Left: Branding details & text */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 self-start bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-mono text-white/85 tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C94A1A] animate-ping" />
            {cms.hero_badge}
          </div>

          <span className="text-[10px] font-semibold tracking-[4.5px] uppercase text-[#C94A1A] mb-4 block font-mono">
            FIKRAFORGE CONSULTANCY
          </span>

          <h1 className="font-sans font-black text-5xl md:text-7xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-6 select-none">
            {cms.hero_title_1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C94A1A] to-[#F57C00] font-extrabold uppercase">{cms.hero_title_2}</span>
          </h1>

          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-lg mb-8">
            {cms.hero_description}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C94A1A] to-[#E0531E] hover:from-[#E0531E] hover:to-[#F57C00] text-white font-sans font-semibold text-xs md:text-sm px-6 py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-[#C94A1A]/15 hover:shadow-[#C94A1A]/25 cursor-pointer group"
            >
              Our Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('featured-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center bg-transparent hover:bg-white/[0.04] text-white/70 hover:text-white border border-white/15 hover:border-white/35 px-6 py-4 rounded-full font-sans font-semibold text-xs md:text-sm transition-all cursor-pointer"
            >
              Featured Work
            </button>
          </div>
        </div>

        {/* Right side: Specialized Slideshow Lab Cells */}
        <div className="lg:col-span-6 flex flex-col gap-4 w-full h-[450px] md:h-[490px]">
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-[28px] relative overflow-hidden w-full h-full shadow-2xl flex flex-col group">
            {/* Slide Container with AnimatePresence */}
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full select-none"
                >
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-black/45 z-10" />
                  <img
                    src={SLIDES[activeSlide].image}
                    alt={SLIDES[activeSlide].title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle HUD coordinates overlay */}
                  <div className="absolute top-4 left-4 z-20 bg-black/55 backdrop-blur-md rounded-lg border border-white/15 px-3 py-1 font-mono text-[9px] text-[#C94A1A] tracking-widest uppercase flex items-center gap-1.5 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SYSTEM REF: {SLIDES[activeSlide].cellCode}
                  </div>

                  <div className="absolute top-4 right-4 z-20 bg-black/55 backdrop-blur-md rounded-lg border border-white/10 px-2.5 py-1 font-mono text-[9px] text-white/50 tracking-widest uppercase shadow">
                    ENG ACTIVE
                  </div>

                  {/* Gradient to darken the slide text */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-15" />

                  {/* Slide Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-20 flex flex-col text-left justify-end h-full">
                    <span className="text-[10px] font-semibold tracking-[3px] text-[#C94A1A] uppercase block mb-1.5 font-mono">
                      {SLIDES[activeSlide].tagline}
                    </span>
                    <h3 className="font-sans font-black text-xl md:text-2xl text-white tracking-tight mb-2 select-none">
                      {SLIDES[activeSlide].title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed font-light font-sans max-w-md select-none">
                      {SLIDES[activeSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Arrow Overlays */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -smart-translate-y z-35 w-9 h-9 rounded-full bg-black/60 hover:bg-[#C94A1A] text-white/80 hover:text-white border border-white/10 hover:border-transparent flex items-center justify-center cursor-pointer select-none transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                aria-label="Previous Slide"
                style={{ transform: 'translateY(-50%)' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -smart-translate-y z-35 w-9 h-9 rounded-full bg-black/60 hover:bg-[#C94A1A] text-white/80 hover:text-white border border-white/10 hover:border-transparent flex items-center justify-center cursor-pointer select-none transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                aria-label="Next Slide"
                style={{ transform: 'translateY(-50%)' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 z-35 flex items-center gap-1.5">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                      idx === activeSlide ? 'w-5 bg-[#C94A1A]' : 'w-1.5 bg-white/35 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: FEATURED WORK ================= */}
      <div id="featured-works" className="flex flex-col gap-8 scroll-mt-24">
        <div>
          <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
            01 · Featured Works
          </span>
          <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45">
            Our Lab Masterpieces.
          </h2>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-xl mt-3">
            Real software systems, automated payment web nodes, and hardware fabrications compiled and currently live globally. Click to inspect blueprint details.
          </p>
        </div>

        {/* Featured Work Grid of 3 selected core products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedProducts.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onProductClick(item)}
              className="group bg-[#111113]/80 border border-white/[0.05] hover:border-[#C94A1A]/40 p-6 rounded-[24px] cursor-pointer flex flex-col justify-between transition-all duration-300 relative overflow-hidden text-left"
            >
              {/* Card visual highlight accent glow */}
              <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-[#C94A1A]/10 blur-2xl group-hover:bg-[#C94A1A]/20 transition-all rounded-full" />
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="w-9 h-9 rounded-xl bg-[#C94A1A]/10 border border-[#C94A1A]/20 flex items-center justify-center text-base">
                    {item.icon}
                  </span>
                  
                  {/* Status Indicator */}
                  <span className="text-[8px] font-mono tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase text-white/70">
                    {item.status}
                  </span>
                </div>

                <span className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                
                <h3 className="font-sans font-bold text-base text-white group-hover:text-[#C94A1A] transition-colors mb-2 flex items-center gap-1">
                  {item.name}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                </h3>
                
                <p className="text-xs text-white/50 leading-relaxed font-light mb-4">
                  {item.description}
                </p>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags?.slice(0, 3).map((tg, idx) => (
                  <span key={idx} className="bg-white/[0.03] text-[9px] font-mono text-white/40 px-2 py-1 rounded">
                    {tg}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION 3: CORE STUDIO PERFORMANCE METRICS ================= */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
            02 · Performance Metrics
          </span>
          <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45">
            Proven Studio Statistics.
          </h2>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-xl mt-3">
            High-performance engineering requires hard statistics. Here is the operational capacity and project delivery metrics of our collective.
          </p>
        </div>

        {/* Brainstormed Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card 1: Platforms Live */}
          <div className="bg-[#111113]/55 border border-white/[0.04] hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-colors">
            <div>
              <span className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-wider block">CAPACITY INTEGRATION</span>
              <span className="text-3xl font-mono text-white tracking-tight font-black block mt-3 mb-1">15+ Live</span>
            </div>
            <div>
              <p className="text-xs text-white/50 leading-relaxed font-light mb-2">
                Platform deployments (mobile, SaaS hubs, NFC ecosystems) compiled and currently operating internationally.
              </p>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#C94A1A] to-[#F57C00] h-full w-[85%]" />
              </div>
            </div>
          </div>

          {/* Card 2: Core Uptime */}
          <div className="bg-[#111113]/55 border border-white/[0.04] hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-colors">
            <div>
              <span className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-wider block">MICRO-ARCHITECTURE</span>
              <span className="text-3xl font-mono text-white tracking-tight font-black block mt-3 mb-1">99.8%</span>
            </div>
            <div>
              <p className="text-xs text-white/50 leading-relaxed font-light mb-2">
                Server reliability with multi-tier cache structures, automated webhook relays, and self-repairing databases.
              </p>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#C94A1A] to-[#F57C00] h-full w-[99.8%]" />
              </div>
            </div>
          </div>

          {/* Card 3: Execution Velocity */}
          <div className="bg-[#111113]/55 border border-white/[0.04] hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-colors">
            <div>
              <span className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-wider block">MEDIAN DELIVERY VELOCITY</span>
              <span className="text-3xl font-mono text-white tracking-tight font-black block mt-3 mb-1">4 Weeks</span>
            </div>
            <div>
              <p className="text-xs text-white/50 leading-relaxed font-light mb-2">
                Timeline from preliminary physical blueprint conceptualization or code outline to finalized hand-over releases.
              </p>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#C94A1A] to-[#F57C00] h-full w-[90%]" />
              </div>
            </div>
          </div>

          {/* Card 4: IP Security */}
          <div className="bg-[#111113]/55 border border-white/[0.04] hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-colors">
            <div>
              <span className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-wider block">LEGAL COMPLIANCE</span>
              <span className="text-3xl font-mono text-white tracking-tight font-black block mt-3 mb-1">100% Secure</span>
            </div>
            <div>
              <p className="text-xs text-white/50 leading-relaxed font-light mb-2">
                Start-to-finish BRELA copyright cataloging, patent architecture filing assists, and formal B2B licensing guarantees.
              </p>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#C94A1A] to-[#F57C00] h-full w-full" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= SECTION 4: GLOBAL CALL TO ACTION ================= */}
      <div className="bg-[#111113] border border-white/[0.06] rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center gap-6 shadow-2xl">
        {/* Glow behind Call to Action */}
        <div className="absolute -inset-2 w-full h-full bg-[#C94A1A]/3 blur-[120px] pointer-events-none" />
        
        <span className="text-[10px] font-bold tracking-[3.5px] uppercase text-[#C94A1A] font-mono block">
          COLLABORATE WITH CUSTOM BUILDERS
        </span>

        <h2 className="font-sans font-black text-3xl md:text-5xl tracking-tight leading-tight max-w-2xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Ready to build something real?
        </h2>

        <p className="text-sm text-white/50 max-w-lg leading-relaxed font-light">
          Let's cast your digital concepts or material models into high-fidelity code bases and physical CNC frameworks. Reach out to our engineering coordinators.
        </p>

        <button
          onClick={() => onContactClick()}
          className="inline-flex items-center gap-2 bg-white text-black font-sans font-bold text-xs md:text-sm px-8 py-4 rounded-full transition-all hover:bg-white/90 active:scale-95 cursor-pointer shadow-lg shadow-white/5 group border-0"
        >
          Contact Us 
          <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ================= SECTION 5: SOCIAL PROOF & DISPATCH UPDATES ================= */}
      <div className="border-t border-white/5 pt-16 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] self-start font-mono">
              Social Proof &amp; Testimonies
            </span>
            <h2 className="font-sans font-black text-3xl md:text-4xl tracking-tighter text-white mb-2">
              Trusted by Builders &amp; Thinkers
            </h2>
            <p className="text-xs text-white/45 max-w-lg">
              What founders and organization leaders say after inspecting our engineering outputs and physical CAD meshes.
            </p>
          </div>

          <button
            onClick={() => onContactClick({ scrollToId: 'quick-feedback-form' })}
            className="inline-flex items-center gap-2 bg-[#C94A1A]/10 border border-[#C94A1A]/30 hover:bg-[#C94A1A]/20 text-white font-sans font-semibold text-xs px-4 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer self-start md:self-auto shrink-0 group"
          >
            <span>Give Live Feedback</span>
            <Flame className="w-3.5 h-3.5 text-[#C94A1A] group-hover:animate-bounce" />
          </button>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedFeedbacks.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between bg-[#111113]/85 border border-white/[0.04] p-6 rounded-[24px] relative hover:border-white/10 transition-all text-left"
            >
              <Quote className="w-8 h-8 text-[#C94A1A]/10 absolute top-4 right-4" />
              <p className="text-xs md:text-sm text-white/70 italic leading-relaxed mb-6 font-serif">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img 
                    src={t.avatar} 
                    alt={t.author} 
                    className="w-8 h-8 rounded-full object-cover border border-[#C94A1A]/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#C94A1A]/10 border border-[#C94A1A]/20 flex items-center justify-center font-mono text-[10px] font-semibold text-[#E0531E]">
                    {t.avatarInitials}
                  </div>
                )}
                <div>
                  <h4 className="font-sans text-xs font-semibold text-white">{t.author}</h4>
                  <p className="text-[9px] text-white/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dispatch News Section */}
        <div className="border-t border-white/5 pt-12">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase inline-flex items-center gap-2 font-mono">
              <Newspaper className="w-3.5 h-3.5 text-[#C94A1A]" /> Latest News &amp; Updates
            </span>
            <button
              onClick={onOpenNews}
              className="text-white/40 hover:text-white bg-transparent border-0 inline-flex items-center gap-1.5 text-xs font-sans tracking-wide cursor-pointer transition-colors"
            >
              Archive Chronology <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestNews.map((n) => (
              <div
                key={n.id}
                onClick={onOpenNews}
                className="bg-[#111113]/80 border border-white/[0.04] hover:border-[#C94A1A]/30 p-5 rounded-2xl cursor-pointer flex flex-col justify-between transition-all group text-left"
              >
                <div>
                  <span className="font-mono text-[9px] text-[#C94A1A] tracking-wider block mb-2 font-bold uppercase">
                    {n.monthYear} · {n.category}
                  </span>
                  <h4 className="font-sans text-xs md:text-sm font-medium text-white group-hover:text-[#C94A1A] leading-snug transition-colors line-clamp-2">
                    {n.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[9px] text-white/30 truncate">
                    Registered: {n.date}
                  </span>
                  <span className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-200 transition-all font-mono">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
