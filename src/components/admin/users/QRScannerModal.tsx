import { useEffect, useRef, useState, useCallback } from "react";
import { Modal } from "../../ui/primitives";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "../../../store/toastStore";
import { api } from "../../../utils/httputils";
import { CheckCircle, XCircle, Camera, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function QRScannerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  
  type ScanStatus = "scanning" | "processing" | "success" | "error";
  const [scanStatus, setScanStatus] = useState<ScanStatus>("scanning");
  const scanStatusRef = useRef<ScanStatus>("scanning");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  
  const lastScanned = useRef<string | null>(null);
  const lastScannedTime = useRef<number>(0);
  
  const containerId = "admin-qr-reader";

  useEffect(() => {
    scanStatusRef.current = scanStatus;
  }, [scanStatus]);

  const startScanner = useCallback(async (mode: "environment" | "user") => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      }
      
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      
      await scanner.start(
        { facingMode: mode },
        { fps: 10, qrbox: { width: 300, height: 300 } },
        (decodedText) => {
          if (scanStatusRef.current !== "scanning") return;
          
          const now = Date.now();
          // Prevent scanning exact same code within 4 seconds to avoid crazy loops
          if (lastScanned.current === decodedText && now - lastScannedTime.current < 4000) {
             return; 
          }
          
          lastScanned.current = decodedText;
          lastScannedTime.current = now;
          
          if (scannerRef.current?.pause) {
            try { scannerRef.current.pause(true); } catch (e) {}
          }
          
          setScannedData(decodedText);
          handleScannedUrl(decodedText);
        },
        () => {} // ignore empty frames silently
      );
      setIsScanning(true);
    } catch (err) {
      toast.error("Failed to start camera. Please check permissions.");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setScanStatus("scanning");
      setScannedData(null);
      setErrorMessage("");
      lastScanned.current = null;
      lastScannedTime.current = 0;
      
      setTimeout(() => {
        startScanner(facingMode);
      }, 300);
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error).finally(() => {
          scannerRef.current?.clear();
        });
      }
      setIsScanning(false);
    };
  }, [isOpen]); 

  const toggleCamera = async () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    await startScanner(newMode);
  };

  const handleScannedUrl = async (url: string) => {
    try {
      setScanStatus("processing");
      
      let targetUrl = url;
      try {
        const urlObj = new URL(url);
        targetUrl = urlObj.pathname;
      } catch (e) {}
      
      // api.post automatically checks for !response.ok and throws an error if status is 4xx or 5xx.
      // We pass { showToast: false } so it does NOT show a global message toaster.
      await api.post(targetUrl, {}, { showToast: false });
      
      // If we reach here, it's a success (e.g. 200, 201)
      setScanStatus("success");
      
      // Auto-resume to normal camera mode after short delay
      setTimeout(() => {
         setScanStatus("scanning");
         setScannedData(null);
         if (scannerRef.current?.resume) {
           try { scannerRef.current.resume(); } catch(e) {}
         }
      }, 2500);
      
    } catch (err: any) {
      const errMessage = err?.message || err?.error || err?.errors?.[0]?.msg || "Invalid QR Code or Request Failed";
      setErrorMessage(errMessage);
      setScanStatus("error");
      
      // Auto-resume after showing error message
      setTimeout(() => {
        setScanStatus("scanning");
        setScannedData(null);
        setErrorMessage("");
        if (scannerRef.current?.resume) {
           try { scannerRef.current.resume(); } catch(e) {}
        }
      }, 3500);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Scan ID Card">
      <div className="flex flex-col items-center justify-center p-4 min-h-[500px] w-[95vw] sm:w-[600px] max-w-full overflow-hidden">
        
        <AnimatePresence mode="wait">
          {scanStatus === "scanning" && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center">
              <div id={containerId} className="w-full max-w-lg rounded-2xl overflow-hidden border-2 border-indigo-500/50 relative shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-black/50 aspect-square flex items-center justify-center">
                 {/* Scanner line */}
                 <div className="absolute inset-0 z-10 pointer-events-none before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-indigo-500 before:shadow-[0_0_15px_rgba(99,102,241,1)] before:animate-[scan_2s_ease-in-out_infinite]" />
              </div>
              
              <div className="flex items-center justify-between w-full max-w-lg mt-6">
                <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                  <Camera size={16} /> Align QR Code within frame
                </p>
                <button 
                  onClick={toggleCamera}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
                >
                  <RefreshCcw size={14} /> Flip Camera
                </button>
              </div>
            </motion.div>
          )}

          {scanStatus === "processing" && (
             <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 flex-1 w-full">
                <div className="h-20 w-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]" />
                <p className="text-base font-black text-indigo-400 uppercase tracking-widest animate-pulse">Processing ID...</p>
             </motion.div>
          )}

          {scanStatus === "success" && (
            <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 text-center flex-1 w-full">
              <div className="h-32 w-32 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                <CheckCircle size={64} />
              </div>
              <p className="text-3xl font-black text-white mb-3 tracking-tight">Attendance Logged!</p>
              <p className="text-base text-slate-400 break-all mb-4">Ready for next scan.</p>
            </motion.div>
          )}

          {scanStatus === "error" && (
            <motion.div 
              key="error"
              initial={{ x: -10 }} 
              animate={{ x: [10, -10, 10, -10, 0] }} 
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-12 text-center flex-1 w-full"
            >
              <div className="w-full max-w-lg rounded-2xl border-2 border-red-500 bg-red-500/5 p-8 shadow-[0_0_50px_rgba(239,68,68,0.25)]">
                <div className="h-20 w-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                  <XCircle size={40} />
                </div>
                <p className="text-2xl font-black text-white mb-3 uppercase tracking-widest">Scan Rejected</p>
                <p className="text-lg text-red-400 font-bold break-words">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
      `}</style>
    </Modal>
  );
}
