import { CameraType } from '@/types/camera';

export class CameraService {
  private stream: MediaStream | null = null;
  private currentCamera: CameraType = 'front';

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async requestPermission(): Promise<PermissionStatus> {
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Request permission by trying to get a stream
      // Use environment constraint for mobile for better compatibility
      const facingMode = this.isMobile() 
        ? { exact: 'user' } // 'user' for front camera on mobile
        : this.currentCamera;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: this.isMobile() ? 640 : 1280 },
          height: { ideal: this.isMobile() ? 480 : 720 }
        }
      });

      // Immediately stop the stream since we just wanted permission
      stream.getTracks().forEach(track => track.stop());
      
      return 'GRANTED';
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          return 'DENIED';
        }
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No camera found on this device');
        }
        // For OverconstrainedError, try again with less strict constraints
        if (error.name === 'OverconstrainedError') {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            return 'GRANTED';
          } catch {
            throw error;
          }
        }
        throw error;
      }
      throw new Error('Unknown error occurred while requesting camera permission');
    }
  }

  async getStream(cameraType: CameraType = 'front'): Promise<MediaStream> {
    this.currentCamera = cameraType;
    
    try {
      // Use 'user' and 'environment' for mobile devices for better compatibility
      const facingMode = this.isMobile()
        ? cameraType === 'front' ? { exact: 'user' } : { exact: 'environment' }
        : cameraType;

      // Lower resolution for mobile to improve performance
      const idealWidth = this.isMobile() ? 640 : 1280;
      const idealHeight = this.isMobile() ? 480 : 720;

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: idealWidth, max: 1280 },
          height: { ideal: idealHeight, max: 720 },
          frameRate: { ideal: this.isMobile() ? 15 : 30, max: 30 }
        }
      };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintError) {
        // If exact facing mode fails, try with just the string value
        console.warn('Exact facing mode failed, trying fallback:', constraintError);
        const fallbackConstraints: MediaStreamConstraints = {
          video: {
            facingMode: cameraType === 'front' ? 'user' : 'environment',
            width: { ideal: idealWidth },
            height: { ideal: idealHeight }
          }
        };
        this.stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
      }

      return this.stream;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
        }
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No camera found on this device. Please connect a camera and try again.');
        }
        if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          throw new Error('Camera is already in use by another application. Please close other applications using the camera.');
        }
        if (error.name === 'OverconstrainedError') {
          // Last resort: try with minimal constraints
          console.warn('Overconstrained error, trying with minimal constraints');
          try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
            return this.stream;
          } catch {
            throw new Error('Could not access camera with required settings. Please try a different browser.');
          }
        }
        throw new Error(`Failed to access camera: ${error.message}`);
      }
      throw new Error('Unknown error occurred while accessing camera');
    }
  }

  releaseStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }
  }

  async switchCamera(): Promise<CameraType> {
    const newCameraType: CameraType = this.currentCamera === 'front' ? 'back' : 'front';
    
    // Release current stream
    this.releaseStream();
    
    // Get new stream with switched camera
    await this.getStream(newCameraType);
    
    return newCameraType;
  }

  getActiveStream(): MediaStream | null {
    return this.stream;
  }

  getCurrentCamera(): CameraType {
    return this.currentCamera;
  }

  isStreamActive(): boolean {
    return this.stream !== null && this.stream.active;
  }

  takeSnapshot(videoElement: HTMLVideoElement): ImageData {
    if (!videoElement.videoWidth || !videoElement.videoHeight) {
      throw new Error('Video element not ready for snapshot');
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    // Draw video frame to canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Clean up canvas
    canvas.width = 0;
    canvas.height = 0;
    
    return imageData;
  }

  getAvailableCameras(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.filter(device => device.kind === 'videoinput'))
      .catch(() => []); // Return empty array if enumeration fails
  }
}

export type PermissionStatus = 'GRANTED' | 'DENIED' | 'PROMPT';