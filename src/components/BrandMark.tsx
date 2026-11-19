import { useState } from 'react';
import {
  Ban,
  BookOpen,
  Clock,
  Croissant,
  Droplet,
  Gamepad2,
  Heart,
  Moon,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Sun,
  UtensilsCrossed,
  Wind,
} from 'lucide-react';
import type { AnchorIconKey, HabitIconKey } from '../types/recovery';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Custom editorial lotus/sprout brand mark matching the warm burnt-sienna Ad-Free emblem.
 */
export function BrandMark({ size = 'md', className = '' }: BrandMarkProps) {
  const dims =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const svgSize = size === 'sm' ? 17 : size === 'lg' ? 28 : 20;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#f5e6d8] text-[#c2652a] shrink-0 ${dims} ${className}`}
      aria-hidden="true"
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20c0-5 0-9 0-13" />
        <path d="M12 19c-4.5 0-8-3-8-7.5 3.5 0 6.5 1.8 8 5.2" />
        <path d="M12 19c4.5 0 8-3 8-7.5-3.5 0-6.5 1.8-8 5.2" />
        <path d="M12 14.5C9.5 11.5 9.5 7 12 4c2.5 3 2.5 7.5 0 10.5Z" />
      </svg>
    </span>
  );
}

export function HabitIcon({
  icon,
  className = 'w-5 h-5',
}: {
  icon: HabitIconKey;
  className?: string;
}) {
  switch (icon) {
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'wind':
      return <Wind className={className} />;
    case 'croissant':
      return <Croissant className={className} />;
    case 'gamepad':
      return <Gamepad2 className={className} />;
    case 'shopping':
      return <ShoppingBag className={className} />;
    case 'sparkles':
    default:
      return <Sparkles className={className} />;
  }
}

export function AnchorIcon({
  icon,
  className = 'w-3.5 h-3.5',
}: {
  icon: AnchorIconKey;
  className?: string;
}) {
  switch (icon) {
    case 'sun':
      return <Sun className={className} />;
    case 'moon':
      return <Moon className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'droplet':
      return <Droplet className={className} />;
    case 'ban':
      return <Ban className={className} />;
    case 'utensils':
      return <UtensilsCrossed className={className} />;
    case 'wind':
      return <Wind className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'sparkles':
    default:
      return <Sparkles className={className} />;
  }
}

interface WarmImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

/**
 * Resilient editorial image component obeying Zero-Broken-Image Policy.
 */
export function WarmImage({ src, alt, className = '', fallbackTitle }: WarmImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#f3e6d8] via-[#ead8c6] to-[#dfc6b0] text-[#8c5a3c] p-4 text-center ${className}`}
      >
        <BrandMark size="md" className="mb-2 bg-[#faf5ee]/80" />
        {fallbackTitle && (
          <span className="font-serif text-sm font-medium text-[#5c4333]">{fallbackTitle}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
