/**
 * SilhouetteSegmenter.ts
 * 
 * Uses MediaPipe Selfie Segmentation to create a binary body silhouette mask.
 * This mask is used for accurate width measurements at anatomical levels.
 */

import { SelfieSegmentation, Results as SegmentationResults } from '@mediapipe/selfie_segmentation';

export interface SegmentationResult {
  mask: ImageData;              // Binary mask (white = person, black = background)
  confidence: number;           // Average confidence of segmentation
  width: number;                // Original image width
  height: number;               // Original image height
  timestamp: number;            // When the segmentation was performed
}

export interface SegmenterConfig {
  modelSelection: 0 | 1;        // 0 = general, 1 = landscape (faster)
  selfieMode: boolean;          // Mirror output for selfie cameras
}

const DEFAULT_CONFIG: SegmenterConfig = {
  modelSelection: 1,            // Use faster landscape model
  selfieMode: false,
};

export class SilhouetteSegmenter {
  private segmenter: SelfieSegmentation | null = null;
  private isInitialized: boolean = false;
  private config: SegmenterConfig;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private latestResult: SegmentationResult | null = null;

  constructor(config: Partial<SegmenterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Create offscreen canvas for processing
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Failed to create canvas context for segmentation');
    }
    this.ctx = ctx;
  }

  /**
   * Initialize the MediaPipe Selfie Segmentation model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.segmenter = new SelfieSegmentation({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
        },
      });

      this.segmenter.setOptions({
        modelSelection: this.config.modelSelection,
        selfieMode: this.config.selfieMode,
      });

      // Set up result callback
      this.segmenter.onResults((results: SegmentationResults) => {
        this.processResults(results);
      });

      // Warm up the model with a small canvas
      const warmupCanvas = document.createElement('canvas');
      warmupCanvas.width = 64;
      warmupCanvas.height = 64;
      const warmupCtx = warmupCanvas.getContext('2d');
      if (warmupCtx) {
        warmupCtx.fillStyle = 'black';
        warmupCtx.fillRect(0, 0, 64, 64);
        await this.segmenter.send({ image: warmupCanvas });
      }

      this.isInitialized = true;
      console.log('[SilhouetteSegmenter] Initialized successfully');
    } catch (error) {
      console.error('[SilhouetteSegmenter] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Process segmentation results into a binary mask
   */
  private processResults(results: SegmentationResults): void {
    if (!results.segmentationMask) {
      console.warn('[SilhouetteSegmenter] No segmentation mask in results');
      return;
    }

    const maskImage = results.segmentationMask;
    const width = maskImage.width;
    const height = maskImage.height;

    // Resize canvas to match input
    this.canvas.width = width;
    this.canvas.height = height;

    // Draw the segmentation mask
    this.ctx.drawImage(maskImage, 0, 0);

    // Get image data and convert to binary mask
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let totalConfidence = 0;
    let pixelCount = 0;

    // Convert to binary mask (threshold at 128) and calculate confidence
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i];  // MediaPipe stores confidence in first channel
      const isForeground = alpha > 128;
      
      // Convert to black/white
      const value = isForeground ? 255 : 0;
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = 255;   // A (fully opaque)

      // Track confidence (how far from threshold)
      if (isForeground) {
        totalConfidence += alpha / 255;
        pixelCount++;
      }
    }

    // Calculate average confidence of foreground pixels
    const confidence = pixelCount > 0 ? totalConfidence / pixelCount : 0;

    this.latestResult = {
      mask: imageData,
      confidence,
      width,
      height,
      timestamp: Date.now(),
    };
  }

  /**
   * Segment a video frame or image
   */
  async segment(
    input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageData
  ): Promise<SegmentationResult | null> {
    if (!this.isInitialized || !this.segmenter) {
      throw new Error('Segmenter not initialized. Call initialize() first.');
    }

    try {
      // Handle ImageData input
      if (input instanceof ImageData) {
        this.canvas.width = input.width;
        this.canvas.height = input.height;
        this.ctx.putImageData(input, 0, 0);
        await this.segmenter.send({ image: this.canvas });
      } else {
        await this.segmenter.send({ image: input });
      }

      // Return the latest result (populated by onResults callback)
      return this.latestResult;
    } catch (error) {
      console.error('[SilhouetteSegmenter] Segmentation failed:', error);
      return null;
    }
  }

  /**
   * Get the raw mask data as a 2D array of booleans
   * true = person, false = background
   */
  getMaskArray(): boolean[][] | null {
    if (!this.latestResult) return null;

    const { mask, width, height } = this.latestResult;
    const data = mask.data;
    const result: boolean[][] = [];

    for (let y = 0; y < height; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        row.push(data[idx] > 128);
      }
      result.push(row);
    }

    return result;
  }

  /**
   * Check if segmenter is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get latest segmentation result
   */
  getLatestResult(): SegmentationResult | null {
    return this.latestResult;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.segmenter) {
      this.segmenter.close();
      this.segmenter = null;
    }
    this.isInitialized = false;
    this.latestResult = null;
    console.log('[SilhouetteSegmenter] Disposed');
  }
}

// Singleton instance for reuse
let segmenterInstance: SilhouetteSegmenter | null = null;

export async function getSegmenter(): Promise<SilhouetteSegmenter> {
  if (!segmenterInstance) {
    segmenterInstance = new SilhouetteSegmenter();
    await segmenterInstance.initialize();
  }
  return segmenterInstance;
}

export function disposeSegmenter(): void {
  if (segmenterInstance) {
    segmenterInstance.dispose();
    segmenterInstance = null;
  }
}
