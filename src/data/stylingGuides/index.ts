import { hourglassGuide } from './hourglass';
import { pearGuide } from './pear';
import { rectangleGuide } from './rectangle';
import { invertedTriangleGuide } from './invertedTriangle';
import { appleGuide } from './apple';

export const stylingGuides = {
  HOURGLASS: hourglassGuide,
  PEAR: pearGuide,
  RECTANGLE: rectangleGuide,
  INVERTED_TRIANGLE: invertedTriangleGuide,
  APPLE: appleGuide,
};

export type BodyShapeType = keyof typeof stylingGuides;