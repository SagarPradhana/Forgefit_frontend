import { UserCheck, FileText, Upload, Trash2, Loader2, HardDrive, File, Plus } from "lucide-react";
import { Modal, CommonButton } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";
import { useMutation } from "../../../hooks/useApi";
import { API_ENDPOINTS } from "../../../utils/url";
import { useState } from "react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
  docUploading: string | null;
  setDocUploading: (val: string | null) => void;
  onDeleteDoc: (docType: string, docUrl: string) => void;
  onRefresh?: () => void;
}

export const DocumentModal = ({
  isOpen,
  onClose,
  selectedUser,
  docUploading,
  setDocUploading,
  onDeleteDoc,
  onRefresh,
}: DocumentModalProps) => {
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  const { mutate: upload, loading: uploading } = useMutation("upload", {
    onSuccess: () => {
      setDocUploading(null);
      setCacheBuster(Date.now());
      if (onRefresh) onRefresh();
    },
    onError: () => {
      setDocUploading(null);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;

    // Size limit: 2MB for general docs, 150KB for ID proofs specially if required by user
    const maxSize = fileType === "identity_proof" ? 150 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum allowed is ${fileType === "identity_proof" ? "150KB" : "2MB"}`);
      return;
    }

    setDocUploading(fileType);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await upload(`${API_ENDPOINTS.ADMIN.USER_UPLOAD(selectedUser.id)}?file_type=${fileType}`, formData);
    } catch (error) {
      setDocUploading(null);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Secure Document Vault"
      footer={
        <div className="flex justify-end gap-3 p-4">
          <CommonButton onClick={onClose} variant="secondary">Done</CommonButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* User Identity Banner */}
        <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-slate-800 border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
              {docUploading === 'profile' ? (
                <Loader2 className="animate-spin text-indigo-400" size={24} />
              ) : (selectedUser?.profile_image_path || selectedUser?.metadata?.profile_image_path) ? (
                <img src={`${selectedUser.profile_image_path || selectedUser.metadata.profile_image_path}?v=${cacheBuster}`} className="h-full w-full object-cover" alt="" />
              ) : (
                <span className="text-3xl font-black text-slate-700 uppercase">{selectedUser?.name?.charAt(0)}</span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl border-4 border-slate-950 flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110">
              <Upload size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} />
            </label>
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">{selectedUser?.name}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Member Authentication Vault</p>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID Proof Card */}
          <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-4 group hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-black text-orange-500/50 uppercase tracking-widest">ID Required</span>
            </div>
            <div>
              <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-tight">Identity Proof</h4>
              <p className="text-[10px] text-slate-500 uppercase leading-none">Government ID, Passport or DL</p>
            </div>
            
            {(selectedUser?.identity_proof_image_path || selectedUser?.metadata?.identity_proof_image_path) ? (
              <div className="mt-2 flex items-center justify-between p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                <div className="flex items-center gap-2">
                  <UserCheck size={14} className="text-emerald-400" />
                  <span className="text-[10px] text-slate-300 font-black uppercase">Verified</span>
                </div>
                <div className="flex gap-1">
                  <a href={selectedUser.identity_proof_image_path || selectedUser.metadata.identity_proof_image_path} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-white transition"><Upload size={14} className="rotate-180" /></a>
                  <button onClick={() => onDeleteDoc('identity_proof', selectedUser.identity_proof_image_path || selectedUser.metadata.identity_proof_image_path)} className="p-2 text-red-400/50 hover:text-red-400 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ) : (
              <label className="mt-2 flex flex-col items-center justify-center py-6 border-2 border-dashed border-white/10 rounded-3xl hover:bg-orange-500/5 hover:border-orange-500/30 cursor-pointer transition">
                {docUploading === 'identity_proof' ? <Loader2 className="animate-spin text-orange-400" size={20} /> : <Plus className="text-slate-600" size={24} />}
                <span className="text-[8px] font-black uppercase text-slate-500 mt-2 tracking-widest">Upload ID Scan</span>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'identity_proof')} />
              </label>
            )}
          </div>

          {/* Health Records Placeholder Card */}
          <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col gap-4 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <HardDrive size={20} />
              </div>
              <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">Additional</span>
            </div>
            <div>
              <h4 className="font-bold text-white uppercase text-sm mb-1 tracking-tight">Archive Files</h4>
              <p className="text-[10px] text-slate-500 uppercase leading-none">Medical certs, legal documents</p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {(selectedUser?.other_docs_path || selectedUser?.metadata?.other_docs_path)?.map((doc: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase truncate pr-4">Doc_{i + 1}</span>
                  <button onClick={() => onDeleteDoc('other', doc)} className="text-red-400/30 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              ))}
              {(selectedUser?.other_docs_path?.length || selectedUser?.metadata?.other_docs_path?.length || 0) < 3 && (
                <label className="flex items-center justify-center p-3 border border-white/10 rounded-xl hover:bg-emerald-500/5 cursor-pointer text-emerald-400/50 hover:text-emerald-400 transition">
                  <Plus size={16} />
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'other')} />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
