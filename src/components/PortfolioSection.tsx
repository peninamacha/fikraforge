/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ExternalLink, Layers, Smartphone, Settings2, Sparkles } from 'lucide-react';
import { getProducts, DbProduct } from '../lib/db';
import { ProductPlatform } from '../types';

import FikraIcon from './FikraIcon';

interface PortfolioSectionProps {
  onProductClick: (product: ProductPlatform) => void;
}

export default function PortfolioSection({ onProductClick }: PortfolioSectionProps) {
  const [filter, setFilter] = useState<'all' | 'platform' | 'digital' | 'hardware' | 'design'>('all');
  const [products, setProducts] = useState<DbProduct[]>(getProducts);

  useEffect(() => {
    const handleDbUpdate = () => {
      setProducts(getProducts());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  // Filter approved products only, and construct longDescriptions
  const approvedProducts = products
    .filter(p => p.approved !== false)
    .map(p => ({
      ...p,
      longDescription: p.longDescription || p.description,
      icon: p.icon || '🛸',
      tags: p.tags || ['Custom Override'],
      image: p.image || `https://placehold.co/600x400/121212/C94A1A?text=${encodeURIComponent(p.name)}`
    }));

  const mergedProducts = approvedProducts;

  const categories = [
    { label: 'All Projects', value: 'all' as const },
    { label: 'Live Platforms', value: 'platform' as const },
    { label: 'Digital/SaaS', value: 'digital' as const },
    { label: 'Hardware/Prototypes', value: 'hardware' as const },
    { label: 'Brand & UX Design', value: 'design' as const }
  ];

  // Filtering products mapping criteria
  const filteredProducts = mergedProducts.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'platform') return p.category.toLowerCase().includes('live') || p.category.toLowerCase().includes('platform');
    if (filter === 'digital') return p.category.toLowerCase().includes('digital') || p.category.toLowerCase().includes('saas');
    if (filter === 'hardware') return p.category.toLowerCase().includes('hardware') || p.category.toLowerCase().includes('concept');
    if (filter === 'design') return p.category.toLowerCase().includes('brand') || p.category.toLowerCase().includes('design') || p.category.toLowerCase().includes('lab');
    return true;
  });

  return (
    <div className="flex flex-col py-4">
      {/* Header labels */}
      <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] self-start font-mono">
        Our Lab Portfolio
      </span>
      <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-4 select-none">
        Work we're proud of.
      </h2>
      <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-xl mb-8">
        Take a look at active software products, cloud-hosted SaaS networks, functional hardware models, and branding materials built inside the forge.
      </p>

      {/* Filter Menu buttons */}
      <div className="flex flex-wrap gap-2 mb-8 items-center border-b border-white/5 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`font-sans text-xs font-semibold px-4 py-2.5 rounded-full cursor-pointer transition-all border select-none ${
              filter === cat.value
                ? 'bg-[#C94A1A] text-white border-[#C94A1A] shadow-md shadow-[#C94A1A]/10'
                : 'bg-transparent text-white/50 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onProductClick(p)}
            className={`group bg-[#111113]/80 border border-white/[0.08] hover:border-white/15 rounded-[24px] overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ${
              p.status === 'concept' ? 'border-dashed opacity-70' : ''
            }`}
          >
            {/* Visual Header of Card */}
            <div className="aspect-[16/10] bg-[#0c0c0e] flex items-center justify-center relative border-b border-white/5 overflow-hidden">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 saturate-[1.05]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-5xl select-none text-white/15 group-hover:scale-110 transition-transform duration-500">
                  <FikraIcon icon={p.icon} className="w-12 h-12 text-white/20" />
                </div>
              )}
              {/* Overlay Badge */}
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md rounded-full px-3 py-1 text-[9px] font-mono tracking-wider font-semibold text-[#F5F5F7]">
                {p.status === 'live' ? '✓ LIVE' : p.status === 'development' ? '⚡ CODING' : '⬡ CONCEPT'}
              </div>
            </div>

            {/* Content Body of Card */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C94A1A] uppercase block mb-2">
                  {p.category}
                </span>
                <h3 className="font-sans font-semibold text-lg text-white group-hover:text-[#C94A1A] transition-colors mb-2">
                  {p.name}
                </h3>
                <p className="text-xs text-white/45 leading-relaxed mb-4 line-clamp-2 font-light">
                  {p.description}
                </p>
              </div>

              {/* Card Footer tags and redirect options */}
              <div className="flex flex-wrap gap-1.5 items-center justify-between border-t border-white/5 pt-4">
                <div className="flex flex-wrap gap-1">
                  {p.tags?.slice(0, 2).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1 rounded-full text-white/50 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {p.url && (
                  <span className="text-[10px] text-white/55 inline-flex items-center gap-1 group-hover:text-white transition-colors font-medium">
                    Link <ExternalLink className="w-3 h-3 text-[#C94A1A]" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
