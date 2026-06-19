/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CornerRightDown, Trophy } from 'lucide-react';
import { getServices, DbServiceItem } from '../lib/db';

interface StudioSectionProps {
  onOpenCompetitions: () => void;
  onEnquireClick: () => void;
}

export default function StudioSection({ onOpenCompetitions, onEnquireClick }: StudioSectionProps) {
  const [services, setServices] = useState<DbServiceItem[]>(getServices);

  useEffect(() => {
    const handleDbUpdate = () => {
      setServices(getServices());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-4">
      
      {/* Left Column: Services offered by FikraForge Consultancy */}
      <div className="lg:col-span-6 flex flex-col justify-start">
        <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
          Consultancy &amp; Production
        </span>
        <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-6">
          Concept → Design<br />
          → IP → Market.
        </h2>
        <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-lg mb-8">
          FikraForge Design Studio provides premium business consultation and production. We assist growing entities in materializing software products, organizing innovation contests, and drafting solid IP catalogs.
        </p>

        {/* Services mapping list */}
        <div className="flex flex-col border-t border-white/5 mb-8">
          {services.filter(s => s.approved !== false).map((srv) => (
            <div
              key={srv.id}
              className="group flex items-center justify-between py-3.5 border-b border-white/5 cursor-pointer hover:bg-white/[0.01] px-1 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-semibold text-[#C94A1A]">
                  {srv.num}
                </span>
                <span className="font-sans text-sm text-white/60 group-hover:text-white transition-colors">
                  {srv.name}
                </span>
              </div>
              <CornerRightDown className="w-4 h-4 text-white/30 group-hover:text-[#C94A1A] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Action badges buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={onEnquireClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C94A1A] to-[#E0531E] hover:from-[#E0531E] hover:to-[#F57C00] text-white font-sans font-semibold text-xs md:text-sm px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-md shadow-[#C94A1A]/10 active:scale-95"
          >
            Start a Project →
          </button>

          <button
            onClick={onOpenCompetitions}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-full px-5 py-3.5 text-white font-sans font-semibold text-xs md:text-sm cursor-pointer transition-all"
          >
            <Trophy className="w-4 h-4 text-[#C94A1A]" /> Active Competitions
          </button>
        </div>
      </div>

      {/* Right Column: Our Proven B2B Production Pipeline */}
      <div className="lg:col-span-6 flex flex-col gap-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
            Our Process Pipeline
          </span>
          <h2 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-white mb-2 leading-tight">
            The Methodical Journey
          </h2>
          <p className="text-xs text-white/55 leading-relaxed font-light">
            We follow strict operational checkpoints to assure physical precision, clean source directories, and legal patent filings.
          </p>
        </div>

        {/* Vertical Pipeline Steps */}
        <div className="flex flex-col gap-6">
          <div className="relative pl-8 border-l border-white/5 hover:border-[#C94A1A]/30 transition-colors duration-300">
            {/* Step bullet */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0c0c0e] border-2 border-[#C94A1A] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C94A1A]" />
            </div>
            <span className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-widest font-bold">Phase 01 · Intake Ideation</span>
            <h4 className="font-sans font-semibold text-sm text-white mt-1">Requirements Alignment</h4>
            <p className="text-xs text-white/45 mt-1 leading-relaxed">
              Formulating user personas, technical frameworks, bandwidth scopes, and defining precise physical models.
            </p>
          </div>

          <div className="relative pl-8 border-l border-white/5 hover:border-[#C94A1A]/30 transition-colors duration-300">
            {/* Step bullet */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0c0c0e] border-2 border-white/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <span className="text-[9px] font-mono text-white/45 uppercase tracking-widest font-bold">Phase 02 · Casting &amp; Prototyping</span>
            <h4 className="font-sans font-semibold text-sm text-white mt-1">High-Precision Execution</h4>
            <p className="text-xs text-white/45 mt-1 leading-relaxed">
              We compile light client-side caches, multi-tier payment gateways, and design physical structural mesh frames.
            </p>
          </div>

          <div className="relative pl-8 border-l border-white/5 hover:border-[#C94A1A]/30 transition-colors duration-300">
            {/* Step bullet */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0c0c0e] border-2 border-white/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <span className="text-[9px] font-mono text-white/45 uppercase tracking-widest font-bold">Phase 03 · IP Cataloging &amp; Legalization</span>
            <h4 className="font-sans font-semibold text-sm text-white mt-1">BRELA Protection</h4>
            <p className="text-xs text-white/45 mt-1 leading-relaxed">
              Coordinating patent draftings, registered intellectual properties, and licensing schemas with administrative organs.
            </p>
          </div>

          <div className="relative pl-8">
            {/* Step bullet */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0c0c0e] border-2 border-white/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <span className="text-[9px] font-mono text-white/45 uppercase tracking-widest font-bold">Phase 04 · Deployment &amp; Live Handover</span>
            <h4 className="font-sans font-semibold text-sm text-white mt-1">Production Ingress</h4>
            <p className="text-xs text-white/45 mt-1 leading-relaxed">
              Hosting on container-isolated nodes with low latency proxies. We deliver clean, well-documented code files.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
