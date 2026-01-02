import React from 'react';
import { ClothingIllustration } from './types';

interface ClothingIllustrationProps {
  type: ClothingIllustration | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

export function ClothingIllustrationSVG({ type, className = '', size = 'md' }: ClothingIllustrationProps) {
  const sizeClass = sizeMap[size];
  const baseClass = `${sizeClass} ${className}`;

  const illustrations: Record<string, React.ReactNode> = {
    // Dresses
    'dress-bodycon': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 10 C30 10 25 15 25 20 L25 25 L20 30 L20 85 C20 90 30 92 40 92 C50 92 60 90 60 85 L60 30 L55 25 L55 20 C55 15 50 10 50 10 L45 8 L35 8 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M35 8 C35 5 37 3 40 3 C43 3 45 5 45 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="40" cy="25" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    ),
    'dress-wrap': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 12 L25 20 L20 25 L15 85 C15 90 30 95 40 95 C50 95 65 90 65 85 L60 25 L55 20 L50 12" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 12 C30 8 35 5 40 5 C45 5 50 8 50 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M32 20 L40 45 L48 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M25 45 L55 45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
    'dress-aline': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 12 L28 20 L25 30 L10 90 C10 93 25 96 40 96 C55 96 70 93 70 90 L55 30 L52 20 L50 12" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 12 C30 8 35 5 40 5 C45 5 50 8 50 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 30 L52 30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
    'dress-slip': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 10 L25 18 L23 90 C23 93 30 96 40 96 C50 96 57 93 57 90 L55 18 L52 10" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 10 L32 5 L40 3 L48 5 L52 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="10" x2="25" y2="18" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="52" y1="10" x2="55" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    // Tops
    'top-vneck': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 15 L15 20 L10 25 L10 70 L25 72 L55 72 L70 70 L70 25 L65 20 L55 15" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 15 L40 35 L55 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 25 L5 50 L10 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M70 25 L75 50 L70 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'top-blazer': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12 L15 18 L10 25 L10 80 L30 82 L30 75 L50 75 L50 82 L70 80 L70 25 L65 18 L60 12" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 12 L25 8 L40 6 L55 8 L60 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 25 L3 55 L10 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M70 25 L77 55 L70 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M33 18 L40 45 L47 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="40" cy="55" r="3" fill="currentColor"/>
        <path d="M30 75 L30 82 L50 82 L50 75" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'top-cropped-jacket': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 15 L15 20 L12 28 L12 55 L32 58 L32 50 L48 50 L48 58 L68 55 L68 28 L65 20 L58 15" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 15 L28 10 L40 8 L52 10 L58 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 28 L5 45 L12 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M68 28 L75 45 L68 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M35 20 L40 35 L45 20" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'top-peplum': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 15 L18 20 L15 28 L15 50 L10 55 L10 70 L25 72 L55 72 L70 70 L70 55 L65 50 L65 28 L62 20 L55 15" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 15 L30 10 L40 8 L50 10 L55 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 28 L8 45 L15 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M65 28 L72 45 L65 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 50 L65 50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
    // Bottoms
    'bottom-high-waist-jeans': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8 L18 10 L15 50 L18 92 L35 95 L40 50 L45 95 L62 92 L65 50 L62 10 L60 8 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 8 L60 8" stroke="currentColor" strokeWidth="2"/>
        <path d="M22 15 L58 15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M37 15 L37 35" stroke="currentColor" strokeWidth="1"/>
        <path d="M43 15 L43 35" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    'bottom-wide-leg': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 8 L20 12 L10 92 L35 95 L40 40 L45 95 L70 92 L60 12 L58 8 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 8 L58 8" stroke="currentColor" strokeWidth="2"/>
        <path d="M24 15 L56 15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'bottom-pencil-skirt': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8 L18 12 L22 85 C22 90 30 92 40 92 C50 92 58 90 58 85 L62 12 L60 8 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 8 L60 8" stroke="currentColor" strokeWidth="2"/>
        <path d="M22 15 L58 15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M40 85 L40 92" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'bottom-aline-skirt': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 8 L23 12 L10 88 C10 92 25 95 40 95 C55 95 70 92 70 88 L57 12 L55 8 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 8 L55 8" stroke="currentColor" strokeWidth="2"/>
        <path d="M26 15 L54 15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    // Outerwear
    'outer-trench': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 10 L12 15 L8 25 L8 90 C8 93 20 95 20 95 L25 95 L25 88 L55 88 L55 95 L60 95 C60 95 72 93 72 90 L72 25 L68 15 L62 10" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 10 L25 5 L40 3 L55 5 L62 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 25 L0 50 L8 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M72 25 L80 50 L72 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 15 L40 30 L50 15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15 50 L65 50" stroke="currentColor" strokeWidth="2"/>
        <circle cx="35" cy="35" r="2" fill="currentColor"/>
        <circle cx="45" cy="35" r="2" fill="currentColor"/>
        <circle cx="35" cy="65" r="2" fill="currentColor"/>
        <circle cx="45" cy="65" r="2" fill="currentColor"/>
      </svg>
    ),
    'outer-tailored-coat': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10 L14 15 L10 25 L10 88 L25 92 L25 85 L55 85 L55 92 L70 88 L70 25 L66 15 L60 10" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 10 L28 5 L40 3 L52 5 L60 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 25 L2 50 L10 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M70 25 L78 50 L70 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M33 15 L40 35 L47 15" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="40" cy="50" r="3" fill="currentColor"/>
        <circle cx="40" cy="70" r="3" fill="currentColor"/>
      </svg>
    ),
    'outer-biker-jacket': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12 L14 18 L10 28 L10 65 L30 68 L50 68 L70 65 L70 28 L66 18 L60 12" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 12 L28 7 L40 5 L52 7 L60 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 28 L2 48 L10 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M70 28 L78 48 L70 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 18 L55 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 45 L30 45" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="50" cy="55" r="2" fill="currentColor"/>
      </svg>
    ),
    // Fabrics
    'fabric-drape': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 10 C15 10 20 25 25 35 C30 45 20 55 25 70 C30 85 35 90 40 90 C45 90 50 85 55 70 C60 55 50 45 55 35 C60 25 65 10 65 10" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" fillOpacity="0.1"/>
        <path d="M25 30 C30 35 35 35 40 30 C45 35 50 35 55 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M22 55 C28 60 35 58 40 55 C45 58 52 60 58 55" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    'fabric-structure': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="10" width="50" height="80" rx="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
        <line x1="15" y1="30" x2="65" y2="30" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="15" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="15" y1="70" x2="65" y2="70" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="30" y1="10" x2="30" y2="90" stroke="currentColor" strokeWidth="1"/>
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    // Generic icons for formulas
    'shoes': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 50 L10 55 L10 70 L70 70 L70 55 L65 50 L60 48 L55 50 L45 50 L40 48 L35 50 L25 50 L20 48 Z" 
          fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 60 L70 60" stroke="currentColor" strokeWidth="1.5"/>
        <ellipse cx="25" cy="55" rx="5" ry="3" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    'accessory': (
      <svg viewBox="0 0 80 100" className={baseClass} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="50" r="20" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
        <circle cx="40" cy="50" r="12" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="40" cy="50" r="5" fill="currentColor" fillOpacity="0.3"/>
        <path d="M40 20 L40 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="40" cy="15" r="5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  };

  return illustrations[type] || illustrations['fabric-structure'];
}

// Silhouette icons for the cheatsheet
export function SilhouetteIcon({ type, className = '' }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    'wrap': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5 L12 10 L8 40 L20 42 L32 40 L28 10 L25 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15 5 L20 3 L25 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 10 L20 22 L24 10" stroke="currentColor" strokeWidth="1"/>
        <path d="M12 20 L28 20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/>
      </svg>
    ),
    'fitted': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5 L12 10 L10 40 L20 42 L30 40 L28 10 L26 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 5 L20 3 L26 5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'aline': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5 L14 10 L5 42 L35 42 L26 10 L25 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15 5 L20 3 L25 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 15 L26 15" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/>
      </svg>
    ),
    'highwaist': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5 L10 8 L8 42 L18 44 L20 25 L22 44 L32 42 L30 8 L28 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 5 L28 5" stroke="currentColor" strokeWidth="2"/>
        <path d="M13 10 L27 10" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    'belted': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5 L12 15 L8 42 L32 42 L28 15 L26 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 5 L20 3 L26 5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10" y="18" width="20" height="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    'bootcut': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5 L12 8 L10 30 L6 44 L16 44 L20 25 L24 44 L34 44 L30 30 L28 8 L26 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 5 L26 5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    'empire': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5 L13 10 L8 42 L32 42 L27 10 L25 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15 5 L20 3 L25 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 12 L27 12" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'wideleg': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5 L12 8 L5 44 L17 44 L20 20 L23 44 L35 44 L28 8 L26 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 5 L26 5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    'peplum': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5 L12 15 L12 22 L8 28 L12 30 L12 35 L28 35 L28 30 L32 28 L28 22 L28 15 L26 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 5 L20 3 L26 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 22 L28 22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/>
      </svg>
    ),
    'vneck': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8 L8 12 L8 38 L32 38 L32 12 L28 8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8 L20 22 L28 8" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'structured': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 8 L6 12 L6 38 L18 40 L22 40 L34 38 L34 12 L30 8" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 8 L15 5 L25 5 L30 8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 12 L2 25 L6 28" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M34 12 L38 25 L34 28" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'fitflare': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5 L14 10 L13 18 L5 42 L35 42 L27 18 L26 10 L25 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15 5 L20 3 L25 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13 18 L27 18" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'ruched': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5 L12 10 L10 40 L30 40 L28 10 L26 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 5 L20 3 L26 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 18 C14 20 16 18 18 20 C20 18 22 20 24 18 C26 20 28 18 28 18" stroke="currentColor" strokeWidth="1"/>
        <path d="M11 28 C13 30 15 28 17 30 C19 28 21 30 23 28 C25 30 27 28 29 28" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    'raglan': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 5 L8 15 L8 38 L32 38 L32 15 L24 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 5 L20 3 L24 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 5 L8 15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M24 5 L32 15" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'longline': (
      <svg viewBox="0 0 40 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 5 L10 10 L8 45 L18 46 L18 40 L22 40 L22 46 L32 45 L30 10 L26 5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 5 L20 3 L26 5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 10 L20 25 L24 10" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  };

  return <>{icons[type] || icons['fitted']}</>;
}
