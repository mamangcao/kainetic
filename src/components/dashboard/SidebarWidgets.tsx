import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Tag } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    tag: string;
  };
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => (
  <a 
    href="https://shopee.com" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group block bg-[#1c2229] rounded-xl overflow-hidden border border-white/5 hover:border-[#ee4d2d]/50 transition-all hover:shadow-lg hover:shadow-[#ee4d2d]/10 mb-4 h-full flex flex-col"
  >
    <div className={`relative overflow-hidden ${compact ? 'h-32' : 'h-40'} shrink-0`}>
      <Image src={product.image} alt={product.name} fill className="object-cover transform group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-2 left-2 bg-[#ee4d2d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
        <Tag size={8} /> {product.tag}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1c2229] to-transparent opacity-60"></div>
    </div>
    <div className="p-3 flex flex-col flex-1">
      <h4 className="text-white text-xs font-bold leading-tight mb-1 line-clamp-2 group-hover:text-[#ee4d2d] transition-colors flex-1">
        {product.name}
      </h4>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <span className="text-[#ee4d2d] font-bold text-sm">{product.price}</span>
        <div className="bg-white/5 p-1 rounded hover:bg-[#ee4d2d] hover:text-white transition-colors text-slate-400">
           <ShoppingBag size={12} />
        </div>
      </div>
    </div>
  </a>
);

export const AffiliateDisclosure = ({ className = "" }: { className?: string }) => (
  <div className={`mt-3 pt-3 border-t border-white/5 ${className}`}>
    <p className="text-[9px] text-slate-600 italic leading-relaxed">
      *This page contains affiliate links. I may earn a commission when you buy through them.
    </p>
  </div>
);

// --- Dummy Data ---
export const gearRecommendationsLeft = [
    { id: 1, name: 'Carbon Speed Shoes', price: '₱12,995', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=300&q=80', tag: 'Top Pick' },
    { id: 2, name: 'GPS Multisport Watch', price: '₱28,450', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=300&q=80', tag: 'Best Seller' },
    { id: 3, name: 'Hydration Vest 5L', price: '₱4,500', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80', tag: 'Essential' },
];

export const gearRecommendationsRight = [
    { id: 4, name: 'Aero Cycling Helmet', price: '₱8,995', image: 'https://images.unsplash.com/photo-1559087316-6b2733b9c9f6?auto=format&fit=crop&w=300&q=80', tag: 'Safety' },
    { id: 5, name: 'Performance Shades', price: '₱6,495', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80', tag: 'Trending' },
];