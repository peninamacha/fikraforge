/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Target, Compass, Sparkles, Award } from 'lucide-react';
import { getTeam, DbTeamMember } from '../lib/db';
import { getCMSData, CMSData } from '../lib/cms';

export default function AboutSection() {
  const [cms, setCms] = useState<CMSData>(getCMSData);
  const [team, setTeam] = useState<DbTeamMember[]>(getTeam);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CMSData>;
      if (customEvent.detail) {
        setCms(customEvent.detail);
      }
    };
    window.addEventListener('fikra_cms_updated', handleUpdate);

    const handleDbUpdate = () => {
      setTeam(getTeam());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);

    return () => {
      window.removeEventListener('fikra_cms_updated', handleUpdate);
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  const [activeTab, setActiveTab] = useState<'story' | 'mission' | 'vision' | 'values'>('story');


  const tabs = [
    { label: 'Our Story', value: 'story' as const },
    { label: 'Mission', value: 'mission' as const },
    { label: 'Vision', value: 'vision' as const },
    { label: 'Values', value: 'values' as const }
  ];

  const valuesList = [
    {
      title: 'Purpose',
      desc: 'We only build what matters. Every project must solve a real challenge or empower local processes directly.'
    },
    {
      title: 'Precision',
      desc: 'Measure twice, cut once — in code blocks, CAD coordinates, materials, and drafting IP patent dossiers.'
    },
    {
      title: 'Seamlessness',
      desc: 'Technology should minimize friction, and let content and payments circulate flows smoothly.'
    },
    {
      title: 'Integrity',
      desc: 'We guard and protect early stage intellectual property, working legally first and ethically siempre.'
    },
    {
      title: 'Resilience',
      desc: 'Adapting to the modern edge (Flutter, AI models) while staying grounded, serving real networks.'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-4">
      {/* Left Column: Story Tabs information */}
      <div className="lg:col-span-6 flex flex-col justify-start">
        <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
          {cms.about_tagline}
        </span>
        <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-6">
          {cms.about_title_1}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C94A1A] to-[#F57C00] font-extrabold uppercase">{cms.about_title_2}</span>
        </h2>

        {/* Tab Controls Navigation */}
        <div className="flex gap-1 border-b border-white/5 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`font-sans text-xs px-3.5 py-2 cursor-pointer bg-transparent border-t-0 border-x-0 border-b-2 hover:text-white transition-all select-none ${
                activeTab === tab.value
                  ? 'text-white border-[#C94A1A]'
                  : 'text-white/45 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[220px]">
          {activeTab === 'story' && (
            <div className="flex flex-col gap-4 animate-fade">
              <p className="text-sm text-white/55 leading-relaxed">
                {cms.about_desc_1}
              </p>
              <p className="text-sm text-white/55 leading-relaxed">
                {cms.about_desc_2}
              </p>
            </div>
          )}

          {activeTab === 'mission' && (
            <div className="flex flex-col gap-4 animate-fade">
              <div className="flex items-center gap-2 text-[#C94A1A] mb-1">
                <Target className="w-5 h-5" />
                <span className="font-sans font-medium text-xs uppercase tracking-wider font-mono">Our Goal</span>
              </div>
              <p className="text-sm text-white/55 leading-relaxed">
                To democratize technology by inventing accessible, custom-coded and physically-engineered solutions. We remove complexities, letting individuals protect and build their creations directly.
              </p>
            </div>
          )}

          {activeTab === 'vision' && (
            <div className="flex flex-col gap-4 animate-fade">
              <div className="flex items-center gap-2 text-[#C94A1A] mb-1">
                <Compass className="w-5 h-5" />
                <span className="font-sans font-medium text-xs uppercase tracking-wider font-mono">Tomorrow's scope</span>
              </div>
              <p className="text-sm text-white/55 leading-relaxed">
                We envision FikraForge Inc. as East Africa's premier Innovation Forge — a collaborative launchpad where abstract software prototypes and physical concepts get cast, patented, and deployed to immediate active markets.
              </p>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="flex flex-col gap-3 animate-fade">
              {valuesList.map((val, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C94A1A] mt-2 flex-shrink-0 animate-pulse" />
                  <p className="text-xs text-white/55 leading-relaxed">
                    <strong className="text-white font-medium">{val.title}</strong> — {val.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Multi-Disciplinary Team Profiles */}
      <div className="lg:col-span-6 flex flex-col justify-start lg:pt-14 w-full">
        <span className="text-[10px] font-semibold tracking-[2px] text-white/45 uppercase block mb-5 font-mono">
          Multi-disciplinary Team
        </span>

        {/* Team Grid Cards */}
        <div className="flex flex-col gap-3">
          {team.filter(t => t.approved !== false).map((member) => (
            <div
              key={member.id}
              className="group bg-[#111113]/80 border border-white/[0.05] hover:border-white/10 p-5 rounded-2xl flex items-center gap-5 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-[#C94A1A]/10 border border-[#C94A1A]/25 text-xs font-semibold text-[#E0531E] flex items-center justify-center font-mono flex-shrink-0 object-cover">
                {member.avatarInitials}
              </div>
              <div>
                <h4 className="font-sans text-sm font-semibold text-white group-hover:text-[#C94A1A] transition-colors">
                  {member.name}
                </h4>
                <p className="text-[10px] text-white/45 uppercase tracking-wide mb-1 font-medium font-mono">
                  {member.role}
                </p>
                <p className="text-xs text-white/40 leading-relaxed max-w-lg">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
