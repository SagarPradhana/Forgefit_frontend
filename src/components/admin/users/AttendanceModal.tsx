import { Plus } from "lucide-react";
import { Modal, Table as PrimitiveTable, CommonButton } from "../../ui/primitives";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
}

export const AttendanceModal = ({ isOpen, onClose, selectedUser }: AttendanceModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Attendance History - ${selectedUser?.name}`}
      footer={
        <CommonButton onClick={onClose}>
          Close
        </CommonButton>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Days</p>
            <p className="text-2xl font-bold text-white">24</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">This Month</p>
            <p className="text-2xl font-bold text-emerald-400">18</p>
          </div>
        </div>

        <PrimitiveTable
          headers={["Date", "Check In", "Check Out", "Status"]}
          rows={[
            ["2026-04-20", "07:15 AM", "08:42 AM", <span key="s1" className="text-emerald-400">Present</span>],
            ["2026-04-18", "07:30 AM", "09:00 AM", <span key="s2" className="text-emerald-400">Present</span>],
            ["2026-04-17", "08:15 AM", "09:45 AM", <span key="s3" className="text-amber-400">Late</span>],
            ["2026-04-15", "--", "--", <span key="s4" className="text-red-400">Absent</span>],
          ]}
        />

        <div className="flex justify-center pt-2">
          <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-2 transition-colors">
            <Plus size={14} /> Add Manual Entry
          </button>
        </div>
      </div>
    </Modal>
  );
};
