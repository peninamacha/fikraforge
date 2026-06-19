/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star, Calendar } from 'lucide-react';
import { getNews, DbNewsArticle } from '../lib/db';

interface NewsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsOverlay({ isOpen, onClose }: NewsOverlayProps) {
  const [news, setNews] = useState<DbNewsArticle[]>(getNews);

  useEffect(() => {
    const handleDbUpdate = () => {
      setNews(getNews());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const approvedNews = news.filter(n => n.approved !== false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-16 bottom-11 z-[150] bg-[#050505]/98 backdrop-blur-3xl overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-title-modal"
    >
      <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-10">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 bg-transparent border-0 text-white/50 hover:text-white font-sans text-xs uppercase tracking-[2px] cursor-pointer mb-8 transition-colors group font-mono"
        >
          <span className="text-[15px] group-hover:-translate-x-1 transition-transform inline-block">←</span> Back
        </button>

        {/* Header */}
        <div className="mb-12 text-left">
          <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
            News &amp; Insights
          </span>
          <h2 id="news-title-modal" className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-4 select-none">
            Intellectual Forge Chronology
          </h2>
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl font-light">
            A comprehensive look at our corporate milestones, physical lab expansions, and live product launches since our founding in December 2023.
          </p>
        </div>

        {/* Chronological List */}
        <div className="flex flex-col border-t border-white/[0.08] text-left">
          {approvedNews.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-6 py-8 border-b border-white/[0.08] items-start hover:bg-white/[0.01] px-2 transition-colors duration-200"
            >
              {/* Date Column */}
              <div className="flex items-center gap-2 text-[#C94A1A] font-mono text-[11px] font-bold uppercase tracking-wider md:pt-1">
                <Calendar className="w-3.5 h-3.5 text-[#C94A1A]" />
                {article.monthYear}
              </div>

              {/* Main Content Column */}
              <div>
                <h3 className="font-sans font-semibold text-base md:text-lg text-white mb-2 leading-relaxed hover:text-[#C94A1A] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs md:text-sm text-white/50 leading-relaxed font-light">
                  {article.body}
                </p>
                <span className="text-[10px] text-white/30 font-mono mt-1 block">Full story registered · {article.date}</span>
              </div>

              {/* Tag Column */}
              <div className="md:pt-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest bg-[#C94A1A]/10 text-[#E0531E] border border-[#C94A1A]/15 px-3 py-1 rounded-full font-semibold">
                  <BookOpen className="w-3 h-3 text-[#E0531E]" />
                  {article.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
