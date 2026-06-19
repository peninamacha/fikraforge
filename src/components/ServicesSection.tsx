/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Cpu, 
  Wrench, 
  Lock, 
  Compass, 
  Share2, 
  Trophy, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { getServices, DbServiceItem } from '../lib/db';
import { getCMSData, CMSData } from '../lib/cms';


interface ServicesSectionProps {
  onEnquireClick: () => void;
}

export default function ServicesSection({ onEnquireClick }: ServicesSectionProps) {
  const [cms, setCms] = useState<CMSData>(getCMSData);
  const [services, setServices] = useState<DbServiceItem[]>(getServices);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CMSData>;
      if (customEvent.detail) {
        setCms(customEvent.detail);
      }
    };
    window.addEventListener('fikra_cms_updated', handleUpdate);
    
    const handleDbUpdate = () => {
      setServices(getServices());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);

    return () => {
      window.removeEventListener('fikra_cms_updated', handleUpdate);
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  // Matching icons for each of the 7 service items
  const iconMap: Record<string, React.ReactNode> = {
    '1': <Code className="w-5 h-5 text-[#E0531E]" />,
    '2': <Cpu className="w-5 h-5 text-[#E0531E]" />,
    '3': <Wrench className="w-5 h-5 text-[#E0531E]" />,
    '4': <Lock className="w-5 h-5 text-[#E0531E]" />,
    '5': <Compass className="w-5 h-5 text-[#E0531E]" />,
    '6': <Share2 className="w-5 h-5 text-[#E0531E]" />,
    '7': <Trophy className="w-5 h-5 text-[#E0531E]" />
  };

  // Detailed copy to enrich the service descriptions professionally
  const detailedDescriptions: Record<string, string> = {
    '1': 'Custom-compiled, highly secure web applications, native & cross-platform mobile apps (with Flutter), offline-first data synchronization caching, and lightning-fast API microservices.',
    '2': 'High-fidelity CAD modeling, mechanical design, custom print boards, electronics integration, IoT sensor array networks, and functional mechanism configuration.',
    '3': 'Rapid structural prototyping using precision FDM filament 3D printers, customized CNC routing, functional parts assembly, and material durability validation checking.',
    '4': 'Start-to-finish advice on intellectual property, coordinate registered trademarks, and secure direct legal patent filings with BRELA (Business Registrations and Licensing Agency).',
    '5': 'Highly curated design sprints and brainstorm hackathons to stress-test your architecture, validate product-market fit, and outline robust system requirements.',
    '6': 'Elevating product recognition through specialized social media management, technical content dispatch, platform campaigns, and strategic brand positioning.',
    '7': 'Hosting customized innovation contests, interface design jams, and technical hackathons supporting the Tanzanian maker and developer ecosystem.'
  };

  return (
    <div className="flex flex-col gap-16 py-4">
      {/* Header and Call to Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/5 pb-12">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
            {cms.services_tagline}
          </span>
          <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-4">
            {cms.services_title_1}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C94A1A] to-[#F57C00] font-extrabold uppercase">{cms.services_title_2}</span>
          </h2>
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-xl">
            {cms.services_description}
          </p>
        </div>

        {/* Strategic CTA Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#111113] to-[#0c0c0e] border border-white/[0.05] p-6 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C94A1A]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-wider block mb-1">PROMPT ENGAGEMENT</span>
            <h4 className="font-sans font-bold text-sm text-white mb-2">Have a Custom Project Specification?</h4>
            <p className="text-[11px] text-white/45 leading-relaxed mb-6 font-light">
              Connect with our design coordinators. We provide NDA assurance schemas, structured milestones, and BRELA patent guidance.
            </p>
          </div>

          <button
            onClick={onEnquireClick}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C94A1A] to-[#E0531E] hover:from-[#E0531E] hover:to-[#F57C00] text-white font-sans font-semibold text-xs md:text-sm px-5 py-3 rounded-full transition-all cursor-pointer shadow-md shadow-[#C94A1A]/10 select-none active:scale-95 border-0"
          >
            Start a Consultation <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Services Grid Selection */}
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="font-sans font-black text-xl md:text-2xl text-white tracking-tight text-left">
            Our 7 Specialized Capabilities
          </h3>
          <p className="text-xs text-white/45 max-w-lg mt-1 text-left font-light">
            Each division is coordinate-steered by veteran software contributors, mechanical designers, and legal counsel inside Tanzania.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.approved !== false).map((srv) => (
            <div
              key={srv.id}
              className="group bg-[#111113]/85 border border-white/[0.04] hover:border-[#C94A1A]/45 p-6 rounded-[24px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden text-left"
            >
              {/* Subtle background cell accent */}
              <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-[#C94A1A]/5 blur-2xl group-hover:bg-[#C94A1A]/10 transition-all rounded-full pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#C94A1A]/10 border border-[#C94A1A]/20 flex items-center justify-center">
                    {iconMap[srv.id] || <CheckCircle2 className="w-5 h-5 text-[#E0531E]" />}
                  </div>
                  <span className="font-mono text-xs font-black text-white/20 select-none">
                    {srv.num}
                  </span>
                </div>

                <h4 className="font-sans font-bold text-sm text-white group-hover:text-[#C94A1A] transition-colors mb-2">
                  {srv.name}
                </h4>

                <p className="text-xs text-white/50 leading-relaxed font-light mb-4">
                  {detailedDescriptions[srv.id] || 'Expert engineering consultation and systematic deployment execution aligned to local framework guidelines.'}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-white/30 group-hover:text-[#C94A1A] transition-colors inline-flex items-center gap-1.5">
                  Explore Spec Terms <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Value Proposition & Redirect CTA Bar */}
      <div className="bg-[#111113]/60 border border-white/[0.04] p-8 rounded-[28px] flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="max-w-xl">
          <h4 className="font-sans font-bold text-base text-white mb-2">Our Execution Philosophy</h4>
          <p className="text-xs text-white/45 leading-relaxed font-light">
            We operate with deep design honesty (no pseudo logs or fake telemetry lines), prioritizing beautiful spacing, rapid caching optimization, and full intellectual property protection with registered BRELA frameworks.
          </p>
        </div>

        <button
          onClick={onEnquireClick}
          className="inline-flex items-center gap-2 bg-white text-black font-sans font-bold text-xs md:text-sm px-6 py-3.5 rounded-full transition-all hover:bg-white/90 active:scale-95 cursor-pointer whitespace-nowrap select-none border-0"
        >
          Partner With Us <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
}
