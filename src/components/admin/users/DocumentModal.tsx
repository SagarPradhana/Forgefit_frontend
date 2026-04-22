import { UserCheck, FileText, Upload, Trash2, Loader2, HardDrive, File, Plus } from "lucide-react";
import { Modal, CommonButton } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";
import { useMutation } from "../../../hooks/useApi";
import { API_ENDPOINTS } from "../../../utils/url";

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
  const { mutate: upload } = useMutation("upload", {
    onSuccess: () => {
      setDocUploading(null);
      if (onRefresh) onRefresh();
    },
    onError: () => {
      setDocUploading(null);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // --- Validations ---
    
    // 1. ID Proof size limit: 150KB
    if (fileType === "identity_proof") {
      const maxSize = 150 * 1024; // 150KB
      if (file.size > maxSize) {
        toast.error("ID Proof file size must be less than 150KB");
        return;
      }
    }

    // 2. Others count limit: max 3
    if (fileType === "other") {
      const currentOtherDocsCount = selectedUser?.metadata?.other_docs_path?.length || 0;
      if (currentOtherDocsCount >= 3) {
        toast.error("Maximum 3 other documents are allowed");
        return;
      }
    }

    setDocUploading(fileType === "identity_proof" ? "id" : fileType);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = `${API_ENDPOINTS.ADMIN.USER_UPLOAD(selectedUser.id)}?file_type=${fileType}`;
      await upload(url, formData);
    } catch (error) {
      // Error handled by useMutation or toast
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Document Vault - ${selectedUser?.name}`}
      footer={<CommonButton onClick={onClose}>Finished</CommonButton>}
    >
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <UserCheck size={16} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Profile Photo</h4>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">Required</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-slate-800 border-2 border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
                {docUploading === 'profile' ? (
                  <Loader2 size={24} className="animate-spin text-indigo-400" />
                ) : selectedUser?.metadata?.profile_image_path ? (
                  <img src={selectedUser.metadata.profile_image_path} className="h-full w-full object-cover" alt="Profile" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-600 font-black text-2xl uppercase">
                    {selectedUser?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full gap-2">
                <label className="cursor-pointer hover:text-indigo-400 text-white transition">
                  <Upload size={18} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'profile')} 
                  />
                </label>
                {selectedUser?.metadata?.profile_image_path && (
                  <button
                    onClick={() => onDeleteDoc('profile', selectedUser.metadata.profile_image_path)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload a clear, high-resolution portrait. Supports JPG, PNG. Max size 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Identity Proof Section */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                <FileText size={16} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Identity Proof</h4>
            </div>
            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase">ID/Passport</span>
          </div>

          {selectedUser?.metadata?.identity_proof_image_path ? (
            <div className="relative group p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">Identity Proof Scan</p>
                  <p className="text-[8px] text-orange-500/70 uppercase">Verified Document</p>
                </div>
                <div className="flex items-center gap-2">
                   <a 
                    href={selectedUser.metadata.identity_proof_image_path} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-white transition"
                   >
                     <Upload size={14} className="rotate-180" />
                   </a>
                   <button
                    onClick={() => onDeleteDoc('identity_proof', selectedUser.metadata.identity_proof_image_path)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl transition hover:bg-orange-500/5 cursor-pointer group">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition">
                    {docUploading === 'id' ? <Loader2 size={24} className="animate-spin" /> : <Upload size={20} />}
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-300 uppercase tracking-widest">Click to upload ID scan</p>
                  <p className="text-[10px] text-slate-500 mt-1">Images or PDF (Max 150KB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'identity_proof')} 
                />
              </label>
            </div>
          )}
        </div>

        {/* Others / Attachments Section */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HardDrive size={16} />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Other Attachments</h4>
            </div>
            
            {(selectedUser?.metadata?.other_docs_path?.length || 0) < 3 && (
              <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest hover:underline cursor-pointer transition">
                {docUploading === 'other' ? (
                  <Loader2 size={12} className="animate-spin inline mr-1" />
                ) : (
                  <Plus size={12} className="inline mr-1" />
                )}
                Add More
                <input 
                  type="file" 
                  className="hidden" 
                  disabled={!!docUploading}
                  onChange={(e) => handleFileUpload(e, 'other')} 
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {selectedUser?.metadata?.other_docs_path?.length > 0 ? (
              selectedUser.metadata.other_docs_path.map((doc: string, idx: number) => (
                <div key={idx} className="group relative flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                    <File size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">Document_{idx + 1}</p>
                    <p className="text-[8px] text-slate-500 uppercase">Archive File</p>
                  </div>
                  <div className="flex items-center gap-1">
                     <a 
                      href={doc} 
                      target="_blank" 
                      rel="noreferrer"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition"
                    >
                      <Upload size={12} className="rotate-180" />
                    </a>
                    <button
                      onClick={() => onDeleteDoc('other', doc)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-4 text-center border-2 border-dotted border-white/5 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">No additional archives</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
