/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Calendar, Sparkles, Network } from 'lucide-react';
import { getCompetitions, DbCompetition } from '../lib/db';

interface CompetitionOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onEnquireClick: () => void;
}

export default function CompetitionOverlay({ isOpen, onClose, onEnquireClick }: CompetitionOverlayProps) {
  const [competitions, setCompetitions] = useState<DbCompetition[]>(getCompetitions);

  useEffect(() => {
    const handleDbUpdate = () => {
      setCompetitions(getCompetitions());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const approvedCompetitions = competitions.filter(c => c.approved !== false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-16 bottom-11 z-[150] bg-[#050505]/98 backdrop-blur-3xl overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comp-title-modal"
    >
      <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-10">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 bg-transparent border-0 text-white/50 hover:text-white font-sans text-xs uppercase tracking-[2px] cursor-pointer mb-8 transition-colors group font-mono"
        >
          <span className="text-[15px] group-hover:-translate-x-1 transition-transform inline-block">←</span> Back to Design Studio
        </button>

        {/* Header */}
        <div className="mb-10 text-left">
          <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
            Design Competitions
          </span>
          <h2 id="comp-title-modal" className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-4 select-none">
            We host. We challenge.<br />We build the next generation.
          </h2>
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl font-light">
            FikraForge Design Studio organizes, hosts, and co-sponsors premier technology, software, and physical engineering competitions across East Africa. We connect inventors directly to mentoring, legal IP backing, and prototype synthesis tools.
          </p>
        </div>

        {/* Competitions Grid */}
        <div className="flex flex-col gap-6 mb-12 text-left">
          {approvedCompetitions.map((comp) => (
            <div
              key={comp.id}
              className="group bg-[#111113]/80 border border-white/[0.08] hover:border-[#C94A1A]/40 rounded-[20px] p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center transition-all duration-300"
            >
              <div>
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest ${
                      comp.status === 'live'
                        ? 'text-green-500'
                        : comp.status === 'upcoming'
                        ? 'text-amber-500'
                        : 'text-white/40'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        comp.status === 'live'
                          ? 'bg-green-500 animate-pulse'
                          : comp.status === 'upcoming'
                          ? 'bg-amber-500'
                          : 'bg-white/40'
                      }`}
                    />
                    {comp.statusText}
                  </span>
                </div>

                <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight mb-2 group-hover:text-[#C94A1A] transition-colors">
                  {comp.title}
                </h3>
                <p className="text-xs md:text-sm text-white/55 leading-relaxed mb-4 max-w-3xl font-light">
                  {comp.description}
                </p>

                {/* Additional Specific Badges */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider bg-[#C94A1A]/10 border border-[#C94A1A]/20 rounded-full px-3 py-1 text-[#E0531E] font-semibold">
                    <Trophy className="w-3 h-3 text-[#E0531E]" /> {comp.prize}
                  </span>
                  {comp.partners && comp.partners.map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60"
                    >
                      <Network className="w-3 h-3" /> {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deadline block */}
              <div className="md:text-right flex md:flex-col justify-between md:justify-center items-center md:items-end border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
                <span className="text-[10px] text-white/40 tracking-wider uppercase mb-1 font-mono">
                  {comp.status === 'past' ? 'Concluded' : 'Deadline'}
                </span>
                <span className="font-sans font-semibold text-sm md:text-base text-white/95">
                  {comp.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => {
              onClose();
              onEnquireClick();
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C94A1A] to-[#E0531E] hover:from-[#E0531E] hover:to-[#F57C00] text-white font-sans font-bold text-xs md:text-sm px-6 py-4 rounded-full transition-all cursor-pointer shadow-md shadow-[#C94A1A]/10 active:scale-95"
          >
            Register or Co-Sponsor an Event →
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-transparent text-white/70 hover:text-white border border-white/15 hover:border-white/35 rounded-full px-6 py-4 font-sans font-semibold text-xs md:text-sm cursor-pointer transition-all"
          >
            Explore Projects
          </button>
        </div>
      </div>
    </motion.div>
  );
}
