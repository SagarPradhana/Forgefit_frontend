import { UserCheck, FileText, Upload, Trash2, Loader2, HardDrive, File } from "lucide-react";
import { Modal, CommonButton } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
  docUploading: string | null;
  setDocUploading: (val: string | null) => void;
  onDeleteDoc: (docType: string, docUrl: string) => void;
}

export const DocumentModal = ({
  isOpen,
  onClose,
  selectedUser,
  docUploading,
  setDocUploading,
  onDeleteDoc,
}: DocumentModalProps) => {
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
              <div className="h-20 w-20 rounded-full bg-slate-800 border-2 border-white/10 overflow-hidden shadow-2xl">
                {selectedUser?.profilePhoto ? (
                  <img src={selectedUser.profilePhoto} className="h-full w-full object-cover" alt="Profile" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-600 font-black text-2xl uppercase">
                    {selectedUser?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full gap-2">
                <label className="cursor-pointer hover:text-indigo-400 text-white transition">
                  <Upload size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDocUploading('profile');
                      const reader = new FileReader();
                      reader.onload = () => {
                        // In real app, call uploadFile api here
                        toast.success("Profile photo uploaded successfully");
                        setDocUploading(null);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
                {selectedUser?.profilePhoto && (
                  <button
                    onClick={() => onDeleteDoc('profile', selectedUser.profilePhoto)}
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

          <div className="relative group">
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-2xl transition hover:bg-orange-500/5 cursor-pointer group">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition">
                  {docUploading === 'id' ? <Loader2 size={24} className="animate-spin" /> : <Upload size={20} />}
                </div>
                <p className="mt-2 text-xs font-bold text-slate-300 uppercase tracking-widest">Click to upload ID scan</p>
                <p className="text-[10px] text-slate-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
              </div>
              <input type="file" className="hidden" onChange={() => {
                setDocUploading('id');
                setTimeout(() => {
                  toast.success("ID proof verified and stored");
                  setDocUploading(null);
                }, 1500);
              }} />
            </label>
            {selectedUser?.idProof && (
              <button
                onClick={() => onDeleteDoc('identity_proof', selectedUser.idProof)}
                className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-500/30"
                title="Remove ID"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
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
            <button className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest hover:underline transition">Add More</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {selectedUser?.otherDocs?.length > 0 ? (
              selectedUser.otherDocs.map((doc: string, idx: number) => (
                <div key={idx} className="group relative flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                    <File size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">Document_{idx + 1}</p>
                    <p className="text-[8px] text-slate-500 uppercase">Stored PDF</p>
                  </div>
                  <button
                    onClick={() => onDeleteDoc('other', doc)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
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
