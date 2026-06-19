/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Quote, Newspaper, Flame, CalendarClock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFeedbacks, getNews, DbTestimonial, DbNewsArticle } from '../lib/db';

interface SocialProofSectionProps {
  onOpenNews: () => void;
}

export default function SocialProofSection({ onOpenNews }: SocialProofSectionProps) {
  const [feedbacks, setFeedbacks] = useState<DbTestimonial[]>(getFeedbacks);
  const [news, setNews] = useState<DbNewsArticle[]>(getNews);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleDbUpdate = () => {
      setFeedbacks(getFeedbacks());
      setNews(getNews());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  const approvedFeedbacks = feedbacks.filter(t => t.approved !== false);
  const latestNews = news.filter(n => n.approved !== false).slice(0, 3);

  // Auto-play interval to slide right-to-left
  useEffect(() => {
    if (approvedFeedbacks.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % approvedFeedbacks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [approvedFeedbacks.length]);

  const getCardStyle = (idx: number) => {
    const len = approvedFeedbacks.length;
    if (len === 0) return { diff: 0, isActive: false, isSide: false, isVisible: false };
    
    let diff = idx - activeIndex;
    
    // Circular calculations
    while (diff < -len / 2) diff += len;
    while (diff >= len / 2) diff -= len;
    
    const isActive = diff === 0;
    const isSide = Math.abs(diff) === 1 || (len === 2 && Math.abs(diff) === 1);
    const isVisible = Math.abs(diff) <= 1 || (len === 2 && Math.abs(diff) <= 1);
    
    return {
      diff,
      isActive,
      isSide,
      isVisible
    };
  };

  return (
    <div className="flex flex-col py-4 text-left">
      
      {/* Testimonials Header */}
      <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] self-start font-mono">
        Social Proof
      </span>
      <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-8 select-none">
        Trusted by builders<br />across East Africa.
      </h2>

      {/* Testimonial Cards Slider */}
      <div className="relative w-full overflow-hidden py-10 px-1 border border-white/[0.02] bg-white/[0.01] rounded-[32px] mb-12 flex flex-col items-center">
        {/* Ambient background accent glows */}
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-[#C94A1A]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-[#C94A1A]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

        <div className="h-[280px] md:h-[250px] relative w-full overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false}>
            {approvedFeedbacks.map((t, idx) => {
              const { diff, isActive, isSide, isVisible } = getCardStyle(idx);
              if (!isVisible) return null;

              // Compute translate values based on circular diff
              let xVal = '0%';
              if (diff === -1) xVal = '-110%';
              if (diff === 1) xVal = '110%';
              if (diff < -1) xVal = '-220%';
              if (diff > 1) xVal = '220%';

              return (
                <motion.div
                  key={t.id}
                  style={{ x: xVal }}
                  animate={{
                    x: xVal,
                    scale: isActive ? 1.02 : 0.92,
                    opacity: isActive ? 1 : isSide ? 0.30 : 0,
                    zIndex: isActive ? 10 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 26,
                  }}
                  onClick={() => {
                    if (isSide) {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`absolute left-1/2 -ml-[45%] md:-ml-[30%] lg:-ml-[15%] w-[90%] md:w-[60%] lg:w-[30%] h-full flex flex-col justify-between bg-[#111113]/85 border ${
                    isActive ? 'border-[#C94A1A]/35 shadow-[0_0_30px_rgba(201,74,26,0.06)]' : 'border-white/[0.04]'
                  } p-6 md:p-8 rounded-[24px] cursor-pointer transition-all duration-300 backdrop-blur-md select-none`}
                >
                  <Quote className={`w-8 h-8 absolute top-4 right-4 transition-colors ${isActive ? 'text-[#C94A1A]/12' : 'text-white/[0.02]'}`} />

                  <p className={`text-xs md:text-sm font-serif italic leading-relaxed mb-6 flex-1 transition-colors ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img 
                        src={t.avatar} 
                        alt={t.author} 
                        className={`w-8 h-8 rounded-full object-cover border transition-colors ${isActive ? 'border-[#C94A1A]/30' : 'border-transparent'}`}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                        isActive ? 'bg-[#C94A1A]/20 border border-[#C94A1A]/35 text-[#E0531E]' : 'bg-white/[0.02] border border-white/[0.05] text-white/35'
                      }`}>
                        {t.avatarInitials}
                      </div>
                    )}
                    <div>
                      <h4 className={`font-sans text-xs font-semibold transition-colors ${isActive ? 'text-white' : 'text-white/40'}`}>
                        {t.author}
                      </h4>
                      <p className={`text-[10px] transition-colors ${isActive ? 'text-white/50' : 'text-white/25'}`}>
                        {t.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Action controls panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-lg gap-4 mt-6 px-6 z-20">
          {/* Progress dots mapping */}
          <div className="flex items-center gap-2">
            {approvedFeedbacks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === activeIndex ? 'w-6 bg-[#C94A1A]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Jump to page ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action indicator arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + approvedFeedbacks.length) % approvedFeedbacks.length)}
              className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/[0.05] hover:bg-[#C94A1A]/10 hover:border-[#C94A1A]/30 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              aria-label="Previous Feedback"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % approvedFeedbacks.length)}
              className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/[0.05] hover:bg-[#C94A1A]/10 hover:border-[#C94A1A]/30 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              aria-label="Next Feedback"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Latest news ticker preview */}
      <div className="mt-4">
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

        {/* Latest news grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestNews.map((n) => (
            <div
              key={n.id}
              onClick={onOpenNews}
              className="bg-[#111113]/80 border border-white/[0.04] hover:border-[#C94A1A]/30 p-5 rounded-2xl cursor-pointer flex flex-col justify-between transition-all group"
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
  );
}
