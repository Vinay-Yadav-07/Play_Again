import React from 'react';

export const SPORT_FALLBACKS: Record<string, string> = {
  Cricket: '/gear/cricket_bat.jpg',
  Football: '/gear/football.jpg',
  Badminton: '/gear/badminton_racket.jpg',
  Basketball: '/gear/basketball.jpg',
  Tennis: '/gear/tennis_racket.jpg',
  Fitness: '/gear/dumbbells.jpg',
  Other: '/gear/backpack.jpg',
};

export function getSportImage(sport: string, image?: string | null): string {
  if (
    image &&
    !image.includes('unsplash.com/photo-1519766304817') &&
    !image.includes('unsplash.com/photo-1617083934555') &&
    !image.includes('unsplash.com/photo-1531415074868') &&
    !image.includes('unsplash.com/photo-1517649763962')
  ) {
    return image;
  }
  return SPORT_FALLBACKS[sport] || '/gear/cricket_bat.jpg';
}

export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  sport?: string
) {
  const target = e.currentTarget;
  const fallback = (sport && SPORT_FALLBACKS[sport]) || '/gear/cricket_bat.jpg';
  if (!target.src.endsWith(fallback)) {
    target.src = fallback;
  }
}
