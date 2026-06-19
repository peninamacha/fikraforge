/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, ExternalLink, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { ProductPlatform } from '../types';
import FikraIcon from './FikraIcon';

interface PortfolioOverlayProps {
  product: ProductPlatform | null;
  onClose: () => void;
}

export default function PortfolioOverlay({ product, onClose }: PortfolioOverlayProps) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-prod-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#111113] border border-white/10 rounded-[24px] max-w-2xl w-full overflow-hidden shadow-2xl relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/45 hover:text-white bg-white/5 hover:bg-white/10 border-0 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-all z-10"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Visual Banner */}
        <div className="aspect-video bg-[#0c0c0e] relative flex items-center justify-center border-b border-white/5 overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-6xl text-white/20 select-none">
              <FikraIcon icon={product.icon} className="w-16 h-16 text-white/20" />
            </div>
          )}
          {/* Subtle gradient dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111113] to-transparent pointer-events-none" />
        </div>

        {/* Product Content info */}
        <div className="p-6 md:p-8">
          <span className="text-[10px] font-mono tracking-widest text-[#C94A1A] uppercase block mb-2 font-mono">
            {product.category}
          </span>
          <h3 id="modal-prod-title" className="font-sans font-black text-2xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 tracking-tight mb-3">
            {product.name}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed mb-6 font-light">
            {product.longDescription || product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] uppercase font-mono tracking-wider bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded-full font-mono"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-5">
            {/* Status indicators */}
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest">
              <span className={`h-1.5 w-1.5 rounded-full ${
                product.status === 'live' ? 'bg-green-500 animate-pulse' : product.status === 'development' ? 'bg-amber-500 animate-pulse' : 'bg-white/40'
              }`} />
              <span className="text-white/40">Status:</span>
              <span className={product.status === 'live' ? 'text-green-400' : product.status === 'development' ? 'text-amber-400' : 'text-white/60'}>
                {product.status === 'live' ? 'Live & Active' : product.status === 'development' ? 'Under Active Code' : 'Conceptual stage'}
              </span>
            </div>

            {/* URL/Links */}
            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C94A1A] hover:text-[#E0531E] hover:underline font-semibold"
              >
                Go to platform <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
