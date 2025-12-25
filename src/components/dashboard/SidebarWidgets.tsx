"use client";

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Tag, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  tag: string;
  url: string;
  rating?: number;
  sold?: number;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  compact = false
}) => {
  const formatSold = (sold: number) => {
    if (sold >= 1000) return `${(sold / 1000).toFixed(1)}k`;
    return sold;
  };

  return (
    <a 
      href={product.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group block bg-[#1c2229] rounded-xl overflow-hidden border border-white/5 hover:border-[#ee4d2d]/50 transition-all hover:shadow-lg hover:shadow-[#ee4d2d]/10 mb-4 h-full flex flex-col relative"
    >
      {/* Image Section */}
      <div className={`relative overflow-hidden ${compact ? 'h-32' : 'h-40'} shrink-0`}>
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
        
        {/* Tag Badge */}
        <div className="absolute top-2 left-2 bg-[#ee4d2d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
          <Tag size={8} /> {product.tag}
        </div>
        
        {/* Rating Badge */}
        {product.rating && product.rating > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
            <Star size={8} fill="currentColor" className="text-yellow-400" /> 
            <span>{product.rating}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c2229] to-transparent opacity-60"></div>
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-white text-xs font-bold leading-tight mb-1 line-clamp-2 group-hover:text-[#ee4d2d] transition-colors flex-1">
          {product.name}
        </h4>
        
        {/* Sold Count */}
        {product.sold && product.sold > 0 && (
          <p className="text-[10px] text-slate-500 mb-2">
            {formatSold(product.sold)} sold
          </p>
        )}
        
        {/* Price and Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[#ee4d2d] font-bold text-sm">{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through decoration-slate-500/50">
                {product.originalPrice}
              </span>
            )}
          </div>
          <div className="bg-white/5 p-1 rounded hover:bg-[#ee4d2d] hover:text-white transition-colors text-slate-400">
            <ShoppingBag size={12} />
          </div>
        </div>
        
        {/* Stock Warning */}
        {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
          <p className="text-[9px] text-orange-400 mt-1">
            Only {product.stock} left!
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-[9px] text-red-400 mt-1">
            Out of stock
          </p>
        )}
      </div>
    </a>
  );
};

export const AffiliateDisclosure = ({ className = "" }: { className?: string }) => (
  <div className={`mt-3 pt-3 border-t border-white/5 ${className}`}>
    <p className="text-[9px] text-slate-600 italic leading-relaxed">
      *This page contains affiliate links. I may earn a commission when you buy through them.
    </p>
  </div>
);

export const gearRecommendationsLeft: Product[] = [
  { 
    id: 1, 
    name: 'Medal Hanger Display Bib Holder Marathon Running Bib Holder For Gymnastics Race Soccer Swim Running',
    price: '₱167 - ₱769',   
    originalPrice: '₱998 - ₱3,000',
    image: 'https://cf.shopee.ph/file/ph-11134207-81ztn-mftjtxwxwwzxc2',
    tag: 'BEST SELLER',
    url: 'https://s.shopee.ph/1qVFbwCNei'
  },
  { 
    id: 2, 
    name: 'ANTA Women Travel PG 7 Running Shoes 2E Widefoot Shock Absorption Sport Sneakers', 
    price: '₱2,983', 
    originalPrice: '₱4,295',
    image: 'https://cf.shopee.ph/file/cn-11134207-7r98o-lxmfst8003kz53', 
    tag: 'Best for Running',
    url: 'https://s.shopee.ph/1qVFc65aiK'
  },
];

export const gearRecommendationsRight: Product[] = [
  { 
    id: 5, 
    name: 'ANTA Men C202 7 Sports Running Shoes Professional Marathon Racing Carbon Plate Shoes',
    price: '₱6,645',   
    originalPrice: '₱6,995',
    image: 'https://cf.shopee.ph/file/cn-11134207-820l4-mhss6jvk5hj9c0',
    tag: 'NEW SHOES',
    url: 'https://s.shopee.ph/1VsPBy3eXS'
  },
  { 
    id: 4, 
    name: '[Free Strap] Xiaomi Redmi Watch 5 Lite 1.96inch AMOLED Display Built-in GPS 5ATM Water Resistance', 
    price: '₱2,699', 
    originalPrice: '₱4,999',
    image: 'https://cf.shopee.ph/file/ph-11134201-7rase-m1mf3ba6smsl7c', 
    tag: 'Built-in GPS (No phone needed)',
    url: 'https://s.shopee.ph/1qVFbCfTpS'
  },
];
