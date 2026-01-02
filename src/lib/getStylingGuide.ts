import { BodyShapeStylingGuide } from '@/types/styling';
import { stylingGuides } from '@/data/stylingGuides';

/**
 * Get the styling guide for a specific body shape
 * @param shape - The body shape type
 * @returns The styling guide for the specified shape, or undefined if not found
 */
export function getStylingGuide(shape: string): BodyShapeStylingGuide | undefined {
  const key = shape.toUpperCase() as keyof typeof stylingGuides;
  return stylingGuides[key];
}

/**
 * Get all available body shape types
 * @returns Array of available body shape types
 */
export function getAvailableBodyShapes(): string[] {
  return Object.keys(stylingGuides);
}

/**
 * Check if a body shape type is valid
 * @param shape - The body shape type to check
 * @returns True if the shape is valid, false otherwise
 */
export function isValidBodyShape(shape: string): boolean {
  const key = shape.toUpperCase() as keyof typeof stylingGuides;
  return key in stylingGuides;
}