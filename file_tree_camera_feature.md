# Camera Body Shape Analysis - File Structure Overview

## Project Root Structure
```
/workspace/shadcn-ui/
├── src/
│   ├── components/camera/              # Camera-specific components
│   │   ├── CameraConsentModal.tsx      # Camera permission modal component
│   │   ├── CameraInterface.tsx         # Main camera UI component
│   │   ├── PoseOverlay.tsx             # Pose landmark visualization overlay
│   │   ├── ResultsDisplay.tsx          # Analysis results display component
│   │   ├── QualityIndicator.tsx        # Real-time quality feedback component
│   │   ├── CameraAnalysisButton.tsx    # Button to trigger camera analysis
│   │   ├── ErrorDisplay.tsx            # Error state component
│   │   └── index.ts                    # Barrel exports
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useCamera.ts                # Camera management hook
│   │   ├── usePoseDetection.ts         # Pose detection hook
│   │   ├── useBodyShapeAnalysis.ts     # Body shape analysis hook
│   │   └── useQualityAssessment.ts     # Quality assessment hook
│   │
│   ├── services/                       # Business logic services
│   │   ├── camera/
│   │   │   └── CameraService.ts        # Camera API wrapper service
│   │   │
│   │   ├── poseDetection/
│   │   │   ├── PoseDetectionService.ts # TensorFlow.js pose detection
│   │   │   ├── MoveNetDetector.ts      # MoveNet-specific implementation
│   │   │   ├── BlazePoseDetector.ts    # BlazePose-specific implementation
│   │   │   └── index.ts
│   │   │
│   │   ├── measurement/
│   │   │   ├── MeasurementCalculator.ts # Body measurement calculations
│   │   │   ├── LandmarkProcessor.ts    # Landmark processing utilities
│   │   │   └── index.ts
│   │   │
│   │   ├── classification/
│   │   │   ├── BodyShapeClassifier.ts  # Body shape classification
│   │   │   ├── ClassificationRules.ts  # Classification rule definitions
│   │   │   └── index.ts
│   │   │
│   │   └── quality/
│   │       ├── QualityAssessmentService.ts # Scan quality assessment
│   │       ├── QualityMetrics.ts       # Quality metric calculations
│   │       └── index.ts
│   │
│   ├── contexts/                       # React contexts
│   │   ├── CameraContext.tsx           # Camera state management context
│   │   └── index.ts
│   │
│   ├── pages/                          # Page components
│   │   ├── Questionnaire.tsx           # Existing (modified for integration)
│   │   └── CameraAnalysis.tsx          # Optional dedicated page
│   │
│   ├── types/                          # TypeScript type definitions
│   │   ├── camera.ts                   # Camera-related types
│   │   ├── pose.ts                     # Pose detection types
│   │   ├── bodyShape.ts                # Body shape classification types
│   │   └── index.ts
│   │
│   ├── utils/                          # Utility functions
│   │   ├── camera/
│   │   │   ├── cameraUtils.ts          # Camera utility functions
│   │   │   └── videoUtils.ts           # Video processing utilities
│   │   │
│   │   ├── math/
│   │   │   ├── geometry.ts             # Geometry calculations
│   │   │   └── statistics.ts           # Statistical calculations
│   │   │
│   │   └── validation/
│   │       └── validationUtils.ts      # Data validation utilities
│   │
│   ├── config/                         # Configuration files
│   │   ├── cameraConfig.ts             # Camera feature configuration
│   │   ├── poseDetectionConfig.ts      # Pose detection configuration
│   │   └── thresholds.ts               # Classification thresholds
│   │
│   ├── workers/                        # Web Worker files
│   │   ├── poseDetection.worker.ts     # Pose detection worker
│   │   └── qualityAssessment.worker.ts # Quality assessment worker
│   │
│   ├── assets/                         # Static assets
│   │   └── models/                     # TensorFlow.js model files
│   │       ├── movenet/
│   │       └── blazepose/
│   │
│   └── lib/                            # Existing library files
│       └── auth.ts                     # Existing auth (unchanged)
│
├── public/                             # Public assets
│   └── models/                         # Publicly accessible models
│       ├── movenet/
│       │   ├── model.json
│       │   └── group1-shard*.bin
│       └── blazepose/
│
├── tests/                              # Test files
│   ├── components/camera/
│   ├── hooks/
│   ├── services/
│   └── utils/
│
└── documentation/                      # Documentation
    ├── camera-feature/
    │   ├── API.md
    │   ├── INTEGRATION.md
    │   └── TROUBLESHOOTING.md
    └── diagrams/                       # System design diagrams
        ├── architect.plantuml
        ├── class_diagram.plantuml
        ├── sequence_diagram.plantuml
        └── ui_navigation.plantuml
```

## Key File Descriptions

### Core Components
1. **CameraConsentModal.tsx** - Handles camera permission requests with privacy disclosures
2. **CameraInterface.tsx** - Main camera UI with video feed and controls
3. **PoseOverlay.tsx** - Visual overlay showing detected pose landmarks
4. **ResultsDisplay.tsx** - Displays analysis results with confidence scores
5. **QualityIndicator.tsx** - Real-time quality feedback component

### Custom Hooks
1. **useCamera.ts** - Manages camera state, permissions, and stream handling
2. **usePoseDetection.ts** - Coordinates pose detection and model loading
3. **useBodyShapeAnalysis.ts** - Orchestrates the complete analysis pipeline
4. **useQualityAssessment.ts** - Provides quality assessment functionality

### Service Layer
1. **CameraService.ts** - Abstracts browser camera APIs with error handling
2. **PoseDetectionService.ts** - TensorFlow.js integration for pose detection
3. **MeasurementCalculator.ts** - Calculates body measurements from landmarks
4. **BodyShapeClassifier.ts** - Classifies body shape based on measurements
5. **QualityAssessmentService.ts** - Assesses scan quality and provides feedback

### Context Management
1. **CameraContext.tsx** - React Context for managing camera and analysis state

### Type Definitions
1. **camera.ts** - Camera-related types (CameraState, PermissionStatus, etc.)
2. **pose.ts** - Pose detection types (PoseLandmark, DetectionResult, etc.)
3. **bodyShape.ts** - Body shape types (BodyShapeType, BodyMeasurements, etc.)

### Configuration
1. **cameraConfig.ts** - Camera feature configuration and defaults
2. **poseDetectionConfig.ts** - Pose detection model configuration
3. **thresholds.ts** - Classification and quality thresholds

## Integration Points with Existing Application

### 1. Modified Files
```
src/pages/Questionnaire.tsx
- Add import for CameraAnalysisButton component
- Add state for camera analysis results
- Integrate camera results into form submission
```

### 2. New Routes (Optional)
```
src/App.tsx (if adding dedicated page)
- Add route: <Route path="/camera-analysis" element={<CameraAnalysis />} />
```

### 3. State Integration
```typescript
// Extend existing questionnaire state
interface QuestionnaireState {
  // Existing fields...
  bodyShape?: BodyShapeType;
  bodyMeasurements?: BodyMeasurements;
  analysisMethod?: 'manual' | 'camera';
  cameraAnalysisTimestamp?: Date;
}
```

### 4. Submission Data Extension
```typescript
// Extend submission payload
interface SubmissionPayload {
  // Existing fields...
  body_shape?: string;
  body_measurements?: Record<string, number>;
  analysis_method?: string;
  camera_analysis_data?: {
    confidence: number;
    quality_score: number;
    timestamp: string;
  };
}
```

## Build Configuration Updates

### package.json Additions
```json
{
  "dependencies": {
    "@tensorflow/tfjs": "^4.10.0",
    "@tensorflow-models/pose-detection": "^2.0.0",
    "react-webcam": "^7.0.1"
  },
  "devDependencies": {
    "@types/react-webcam": "^5.2.4"
  }
}
```

### Environment Variables
```env
# Camera Feature Configuration
NEXT_PUBLIC_ENABLE_CAMERA_FEATURE=true
NEXT_PUBLIC_TFJS_MODEL_URL=https://tfhub.dev/google/movenet/singlepose/lightning/4
NEXT_PUBLIC_CAMERA_QUALITY_THRESHOLD=0.7
NEXT_PUBLIC_ENABLE_MODEL_CACHING=true
```

## Development Workflow

### 1. Feature Flag
The camera feature is gated behind a feature flag for controlled rollout:
```typescript
const isCameraFeatureEnabled = process.env.NEXT_PUBLIC_ENABLE_CAMERA_FEATURE === 'true';
```

### 2. Progressive Enhancement
- Basic functionality works without camera (manual input)
- Camera feature enhances experience when available
- Graceful degradation for unsupported browsers

### 3. Testing Strategy
- Unit tests for services and utilities
- Integration tests for component interactions
- E2E tests for complete user flows
- Manual testing on target devices

## Deployment Considerations

### 1. Bundle Optimization
- Code splitting for camera feature
- Lazy loading of TensorFlow.js
- Tree-shaking to remove unused code

### 2. Asset Optimization
- Model files hosted on CDN
- Compression for faster downloads
- Caching strategies for models

### 3. Monitoring
- Feature usage analytics
- Error tracking and reporting
- Performance metrics collection

## Maintenance Notes

### 1. Model Updates
- Keep TensorFlow.js models updated
- Monitor for breaking changes in pose detection APIs
- Maintain compatibility with browser updates

### 2. Browser Compatibility
- Regular testing on target browsers
- Update polyfills as needed
- Monitor browser API changes

### 3. Performance Monitoring
- Track analysis completion times
- Monitor memory usage
- Optimize based on real-world usage data

---

*File Structure Version: 1.0*  
*Last Updated: 2026-01-01*  
*Author: Bob, Software Architect*