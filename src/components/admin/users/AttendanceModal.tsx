import { Modal, Table as PrimitiveTable, CommonButton, Skeleton } from "../../ui/primitives";
import { useState, useEffect, useCallback } from "react";
import { adminAttendanceService, type AttendanceResponse } from "../../../services/adminAttendanceService";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: any;
}

export const AttendanceModal = ({ isOpen, onClose, selectedUser }: AttendanceModalProps) => {
  const [records, setRecords] = useState<AttendanceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0]
  });

  const fetchHistory = useCallback(async () => {
    if (!selectedUser?.id) return;
    setLoading(true);
    try {
      const from_date = Math.floor(new Date(filters.from_date).setHours(0, 0, 0, 0) / 1000);
      const to_date = Math.floor(new Date(filters.to_date).setHours(23, 59, 59, 999) / 1000);

      const res = await adminAttendanceService.getUserAttendance(selectedUser.id, { from_date, to_date });
      if (res && res.data) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedUser?.id, filters.from_date, filters.to_date]);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  const stats = {
    total: records.length,
    present: records.filter(r => r.status.toLowerCase() === 'present').length,
  };

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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">From Date</label>
            <input
              type="date"
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              value={filters.from_date}
              onChange={e => setFilters({ ...filters, from_date: e.target.value })}
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">To Date</label>
            <input
              type="date"
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              value={filters.to_date}
              onChange={e => setFilters({ ...filters, to_date: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Logs</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Present Count</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.present}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
          </div>
        ) : (
          <PrimitiveTable
            headers={["Date", "Check In", "Check Out", "Status"]}
            rows={records.map(r => [
              new Date(r.date * 1000).toLocaleDateString(),
              new Date(r.check_in * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              r.check_out ? new Date(r.check_out * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active",
              <span key={r.id} className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status.toLowerCase() === 'present' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {r.status}
              </span>
            ])}
          />
        )}

        {records.length === 0 && !loading && (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
            <p className="text-sm text-slate-500">No history found for this period.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
