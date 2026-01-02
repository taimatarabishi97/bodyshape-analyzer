import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Camera, Lock, Ruler } from 'lucide-react';

interface CameraConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantPermission: () => void;
  onManualEntry?: () => void;
  isLoading?: boolean;
}

export function CameraConsentModal({
  isOpen,
  onClose,
  onGrantPermission,
  onManualEntry,
  isLoading = false
}: CameraConsentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-2 border-white">
                <Lock className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Camera Access Required
          </DialogTitle>
          <DialogDescription className="text-center">
            We need camera access to analyze your body shape
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Privacy First</h4>
                <p className="text-sm text-muted-foreground">
                  All processing happens locally in your browser. No images are stored or sent to any server.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Camera className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Real-time Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  We'll analyze your pose in real-time to determine your body shape classification.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Secure & Private</h4>
                <p className="text-sm text-muted-foreground">
                  Your camera feed is only used for analysis and is immediately discarded after processing.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You'll need to grant camera permission in your browser. 
              Make sure you're in a well-lit area and standing about 6 feet from the camera.
            </p>
          </div>

          {/* Manual Fallback Option */}
          {onManualEntry && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-start space-x-3 mb-3">
                <Ruler className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Alternative: Manual Measurements</h4>
                  <p className="text-sm text-muted-foreground">
                    Don't have a camera or prefer not to use it? Enter your measurements manually.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={onManualEntry}
                className="w-full"
              >
                <Ruler className="w-4 h-4 mr-2" />
                Enter Measurements Manually
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onGrantPermission}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Requesting Access...
              </>
            ) : (
              'Allow Camera Access'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}