
import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { checkHalalIngredients } from '../services/geminiService';
import { HalalCheckResult } from '../types';

const HalalScanner: React.FC<{ language?: string; onClose: () => void }> = ({ language = 'en', onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<HalalCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      alert("Camera access denied.");
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const imageData = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    const check = await checkHalalIngredients(imageData, language);
    setResult(check);
    setLoading(false);
    
    // Stop camera
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
      <button onClick={onClose} className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full">
        <X size={24} />
      </button>

      {!result && !loading && !stream && (
        <div className="text-center text-white space-y-6">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/40">
            <Camera size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Halal Product Scanner</h2>
          <p className="text-slate-400 max-w-xs mx-auto">Scan the ingredient list on any product to check its Halal status with AI.</p>
          <button onClick={startCamera} className="bg-emerald-600 px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
            Start Scanning
          </button>
        </div>
      )}

      {stream && (
        <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border-2 border-emerald-500/50">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-8 flex justify-center">
            <button onClick={captureAndScan} className="w-16 h-16 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center active:scale-90 transition-all">
              <div className="w-12 h-12 bg-emerald-600 rounded-full" />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center text-white space-y-4">
          <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
          <p className="text-lg font-medium">Analyzing Ingredients...</p>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            {result.status === 'halal' ? (
              <CheckCircle size={48} className="text-emerald-500" />
            ) : result.status === 'haram' ? (
              <X size={48} className="text-red-500" />
            ) : (
              <AlertTriangle size={48} className="text-amber-500" />
            )}
            <div>
              <h3 className={`text-2xl font-bold uppercase ${result.status === 'halal' ? 'text-emerald-600' : result.status === 'haram' ? 'text-red-600' : 'text-amber-600'}`}>
                {result.status}
              </h3>
              <p className="text-slate-500 text-sm">AI-Powered Analysis</p>
            </div>
          </div>

          <p className="text-slate-700 dark:text-slate-300 mb-4 font-medium">{result.reason}</p>

          {result.concerns.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Concerns</p>
              <div className="flex flex-wrap gap-2">
                {result.concerns.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setResult(null)} className="w-full mt-8 bg-slate-100 dark:bg-slate-800 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            Scan Another
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default HalalScanner;
