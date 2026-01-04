
import React, { useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface QRScannerProps {
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Camera access denied. Please enable permissions.');
      }
    }
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Simulate a scan after 3 seconds for the demo
  useEffect(() => {
    const timer = setTimeout(() => {
      onScan('recipient@upi');
    }, 4000);
    return () => clearTimeout(timer);
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white">
        <XMarkIcon className="w-8 h-8" />
      </button>
      
      <div className="relative w-72 h-72 border-2 border-emerald-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.3)]">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-50" />
        <div className="absolute inset-0 border-[40px] border-black/50"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-scan"></div>
      </div>
      
      <div className="mt-12 text-center px-8">
        <h3 className="text-xl font-bold text-white mb-2">Scan QR Code</h3>
        <p className="text-slate-400 text-sm">Align the QR code within the frame to pay instantly via UPI</p>
      </div>
      
      {error && (
        <div className="mt-8 bg-rose-500/20 border border-rose-500/40 p-4 rounded-xl text-rose-500 text-sm">
          {error}
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
