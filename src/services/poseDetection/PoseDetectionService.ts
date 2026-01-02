import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { PoseLandmark, LANDMARK_INDICES, KEY_LANDMARKS } from '@/types/camera';

export class PoseDetectionService {
  private detector: poseDetection.PoseDetector | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load TensorFlow.js backend
      await tf.ready();

      // Create detector with MoveNet (Lightning variant for speed)
      const model = poseDetection.SupportedModels.MoveNet;
      this.detector = await poseDetection.createDetector(model, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
        minPoseScore: 0.3
      });

      this.isInitialized = true;
      console.log('Pose detection service initialized');
    } catch (error) {
      console.error('Failed to initialize pose detection:', error);
      throw new Error('Failed to initialize pose detection. Please check your internet connection and try again.');
    }
  }

  async detectFromVideo(videoElement: HTMLVideoElement): Promise<PoseLandmark[]> {
    if (!this.detector || !this.isInitialized) {
      await this.initialize();
    }

    if (!videoElement.videoWidth || !videoElement.videoHeight) {
      throw new Error('Video element not ready for detection');
    }

    try {
      const poses = await this.detector!.estimatePoses(videoElement);
      
      if (poses.length === 0) {
        return [];
      }

      // Use the first (and only) pose
      const pose = poses[0];
      
      // Convert to our PoseLandmark format
      const landmarks: PoseLandmark[] = pose.keypoints.map((keypoint, index) => {
        const landmarkName = this.getLandmarkName(index);
        return {
          x: keypoint.x / videoElement.videoWidth,
          y: keypoint.y / videoElement.videoHeight,
          score: keypoint.score || 0,
          name: landmarkName
        };
      });

      return landmarks;
    } catch (error) {
      console.error('Pose detection failed:', error);
      throw new Error('Failed to detect pose. Please ensure you are clearly visible in the frame.');
    }
  }

  async detectFromImage(imageData: ImageData): Promise<PoseLandmark[]> {
    if (!this.detector || !this.isInitialized) {
      await this.initialize();
    }

    try {
      // Create a temporary canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to create canvas context');
      }

      // Put image data onto canvas
      ctx.putImageData(imageData, 0, 0);

      // Detect poses
      const poses = await this.detector!.estimatePoses(canvas);
      
      if (poses.length === 0) {
        throw new Error('No pose detected in the image');
      }

      // Use the first (and only) pose
      const pose = poses[0];
      
      // Convert to our PoseLandmark format
      const landmarks: PoseLandmark[] = pose.keypoints.map((keypoint, index) => {
        const landmarkName = this.getLandmarkName(index);
        return {
          x: keypoint.x / imageData.width,
          y: keypoint.y / imageData.height,
          score: keypoint.score || 0,
          name: landmarkName
        };
      });

      // Clean up
      canvas.width = 0;
      canvas.height = 0;

      return landmarks;
    } catch (error) {
      console.error('Image pose detection failed:', error);
      throw new Error('Failed to detect pose in captured image. Please try again.');
    }
  }

  getLandmarkConfidence(landmarks: PoseLandmark[], landmarkIndices: number[]): number[] {
    return landmarkIndices.map(index => landmarks[index]?.score || 0);
  }

  getKeyLandmarkConfidence(landmarks: PoseLandmark[]): number {
    const keyConfidences = this.getLandmarkConfidence(landmarks, KEY_LANDMARKS);
    return keyConfidences.reduce((sum, conf) => sum + conf, 0) / keyConfidences.length;
  }

  hasRequiredLandmarks(landmarks: PoseLandmark[]): boolean {
    const requiredIndices = [
      LANDMARK_INDICES.LEFT_SHOULDER,
      LANDMARK_INDICES.RIGHT_SHOULDER,
      LANDMARK_INDICES.LEFT_HIP,
      LANDMARK_INDICES.RIGHT_HIP,
      LANDMARK_INDICES.LEFT_ANKLE,
      LANDMARK_INDICES.RIGHT_ANKLE
    ];

    return requiredIndices.every(index => 
      landmarks[index] && landmarks[index].score > 0.3
    );
  }

  private getLandmarkName(index: number): string {
    const landmarkNames = [
      'nose',
      'left_eye',
      'right_eye',
      'left_ear',
      'right_ear',
      'left_shoulder',
      'right_shoulder',
      'left_elbow',
      'right_elbow',
      'left_wrist',
      'right_wrist',
      'left_hip',
      'right_hip',
      'left_knee',
      'right_knee',
      'left_ankle',
      'right_ankle'
    ];

    return landmarkNames[index] || `landmark_${index}`;
  }

  dispose(): void {
    if (this.detector) {
      this.detector.dispose();
      this.detector = null;
    }
    this.isInitialized = false;
  }
}