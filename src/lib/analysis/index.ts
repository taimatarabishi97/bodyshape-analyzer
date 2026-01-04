/**
 * Analysis Module Index
 * 
 * Exports all analysis-related functionality
 */

// Segmentation
export { 
  SilhouetteSegmenter, 
  getSegmenter, 
  disposeSegmenter 
} from './SilhouetteSegmenter';
export type { SegmentationResult, SegmenterConfig } from './SilhouetteSegmenter';

// Measurement
export { 
  SilhouetteMeasurer, 
  silhouetteMeasurer 
} from './SilhouetteMeasurer';
export type { 
  AnatomicalLevels, 
  WidthMeasurement, 
  SilhouetteWidths, 
  SilhouetteRatios,
  MeasurerConfig 
} from './SilhouetteMeasurer';

// Hybrid Analysis
export { 
  HybridBodyAnalyzer, 
  getHybridAnalyzer, 
  disposeHybridAnalyzer 
} from './HybridBodyAnalyzer';
export type { 
  PoseQualityCheck, 
  HybridMeasurements, 
  HybridAnalysisResult, 
  HybridQualityScore,
  AnalyzerConfig 
} from './HybridBodyAnalyzer';

// Legacy (for compatibility)
export { classifyBodyShape, getAnalysisResult } from './bodyShapeClassifier';
