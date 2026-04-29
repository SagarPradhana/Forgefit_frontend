import { useEffect, useRef, useState } from "react";
import { Modal } from "../../ui/primitives";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "../../../store/toastStore";
import { api } from "../../../utils/httputils";
import { CheckCircle, XCircle, Camera } from "lucide-react";
import { motion } from "framer-motion";

export function QRScannerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<"scanning" | "processing" | "success" | "error">("scanning");
  const [errorMessage, setErrorMessage] = useState("");
  const containerId = "admin-qr-reader";

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    let mounted = true;

    if (isOpen) {
      setScanStatus("scanning");
      setScannedData(null);
      setErrorMessage("");
      
      setTimeout(async () => {
        if (!mounted) return;
        try {
          scanner = new Html5Qrcode(containerId);
          scannerRef.current = scanner;
          
          await scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              if (!mounted) return;
              scanner?.pause();
              setScannedData(decodedText);
              handleScannedUrl(decodedText, scanner);
            },
            () => {} 
          );
          if (mounted) setIsScanning(true);
        } catch (err) {
          toast.error("Failed to start camera. Please check permissions.");
        }
      }, 300);
    }

    return () => {
      mounted = false;
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(console.error).finally(() => {
          scanner?.clear();
        });
      }
      setIsScanning(false);
    };
  }, [isOpen]);

  const handleScannedUrl = async (url: string, scanner: Html5Qrcode | null) => {
    try {
      setScanStatus("processing");
      
      let targetUrl = url;
      try {
        const urlObj = new URL(url);
        targetUrl = urlObj.pathname;
      } catch (e) {}
      
      const res: any = await api.post(targetUrl, {}, { showToast: false });
      if (res && res.code !== undefined && res.code !== 200) {
        throw new Error(res.message || "Invalid API response");
      }
      
      setScanStatus("success");
      setTimeout(() => {
         onClose();
      }, 3000);
      
    } catch (err: any) {
      const errMessage = err?.message || err?.error || err?.errors?.[0]?.msg || "Invalid QR Code or Request Failed";
      setErrorMessage(errMessage);
      setScanStatus("error");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Scan ID Card">
      <div className="flex flex-col items-center justify-center p-4 min-h-[400px] w-full sm:w-[500px]">
        
        {scanStatus === "scanning" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
            <div id={containerId} className="w-full max-w-md rounded-xl overflow-hidden border-2 border-indigo-500/50 relative shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-black">
               {/* Scanner machine line animation via CSS */}
               <div className="absolute inset-0 z-10 pointer-events-none before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-indigo-500 before:shadow-[0_0_15px_rgba(99,102,241,1)] before:animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-400 flex items-center gap-2">
              <Camera size={16} /> Align QR Code within frame
            </p>
          </motion.div>
        )}

        {scanStatus === "processing" && (
           <div className="flex flex-col items-center py-10">
              <div className="h-16 w-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-black text-indigo-400 uppercase tracking-widest animate-pulse">Processing ID...</p>
           </div>
        )}

        {scanStatus === "success" && (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center py-10 text-center">
            <div className="h-24 w-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle size={48} />
            </div>
            <p className="text-2xl font-black text-white mb-2 tracking-tight">Attendance Successful!</p>
            <p className="text-sm text-slate-400 break-all mb-4">Record logged securely.</p>
          </motion.div>
        )}

        {scanStatus === "error" && (
          <motion.div 
            initial={{ x: -10 }} 
            animate={{ x: [10, -10, 10, -10, 0] }} 
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center py-10 text-center w-full"
          >
            <div className="w-full max-w-md rounded-xl border-2 border-red-500 bg-red-500/5 p-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <div className="h-16 w-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <XCircle size={32} />
              </div>
              <p className="text-lg font-black text-red-400 mb-2 uppercase tracking-widest">Scan Rejected</p>
              <p className="text-sm text-slate-300 font-medium break-words">{errorMessage}</p>
            </div>
            <button 
              onClick={() => {
                setScanStatus("scanning");
                setScannedData(null);
                setErrorMessage("");
                scannerRef.current?.resume();
              }}
              className="mt-6 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-slate-500 shadow-lg"
            >
              Try Again
            </button>
          </motion.div>
        )}

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
