import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, X, MapPin, RefreshCw, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface CameraCaptureProps {
  onCapture: (file: File, location: LocationData | null) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
    }
  }, [stream]);

  // Initialize location
  const getLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Failed to get precise location. Ensure location services are enabled.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    startCamera();
    getLocation();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageUrl);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file, location);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col">
          <h3 className="text-white font-bold text-lg">GovTrack Camera</h3>
          <div className="flex items-center gap-1.5 mt-1">
            {isLocating ? (
              <span className="flex items-center gap-1 text-[10px] text-white/70 uppercase tracking-widest font-bold">
                <RefreshCw className="w-3 h-3 animate-spin" /> Acquiring GPS...
              </span>
            ) : location ? (
              <span className="flex items-center gap-1 text-[10px] text-green-400 uppercase tracking-widest font-bold">
                <MapPin className="w-3 h-3" /> GPS Lock: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-red-400 uppercase tracking-widest font-bold">
                <MapPin className="w-3 h-3" /> {locationError || 'GPS Unavailable'}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {hasPermission === false ? (
          <div className="text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-white font-bold text-lg">Camera Access Denied</p>
            <p className="text-white/60 text-sm max-w-sm mx-auto">
              Please enable camera permissions in your browser settings to capture geotagged evidence.
            </p>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className={cn(
                "absolute inset-0 w-full h-full object-cover",
                capturedImage ? "hidden" : "block"
              )}
            />
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
        
        {/* Alignment Grid Overlay */}
        {!capturedImage && hasPermission && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-white">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div className="" />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black p-8 pb-12 flex items-center justify-center gap-8 relative z-10">
        {capturedImage ? (
          <>
            <button 
              onClick={handleRetake}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold uppercase tracking-widest transition-colors backdrop-blur-md"
            >
              Retake
            </button>
            <button 
              onClick={handleConfirm}
              className="px-8 py-3 rounded-full bg-gov-blue text-white text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gov-blue/90 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <Check className="w-5 h-5" /> Use Photo
            </button>
          </>
        ) : (
          <button 
            onClick={handleCapture}
            disabled={!hasPermission}
            className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="w-16 h-16 rounded-full bg-white group-hover:scale-95 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
