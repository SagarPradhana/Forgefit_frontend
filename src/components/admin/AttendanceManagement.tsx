import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GlassCard, SectionTitle, Table, CommonButton, Modal } from "../ui/primitives";
import { Grid, List, Search, UserCheck, Clock, Filter, CheckCircle2, Edit2, Trash2, Plus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminAttendanceService, type AttendanceResponse, type AttendanceRequest } from "../../services/adminAttendanceService";
import { useEffect, useCallback, useMemo } from "react";
import { Skeleton } from "../ui/primitives";
import { toast } from "../../store/toastStore";
import { useGet } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/url";
import { DateRangeFilter, type DateRange } from "../ui/DateRangeFilter";

type AttendanceView = "grid" | "list";


export function AttendanceManagement() {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState<AttendanceView>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ label: "Today" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceResponse | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    user_id: "",
    userName: "",
    date: new Date().toISOString().split('T')[0],
    checkIn: "09:00",
    checkOut: "",
    status: "present"
  });

  const [records, setRecords] = useState<AttendanceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ 
    total_checkins_today: 0, 
    present_now: 0, 
    checked_out_today: 0, 
    avg_time_hours: 0 
  });

  const { data: usersDropdownData } = useGet(API_ENDPOINTS.ADMIN.GET_USERS_DROPDOWN);
  const members = useMemo(() => usersDropdownData?.data || [], [usersDropdownData]);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAttendanceService.getAttendance({
        search: searchQuery || undefined,
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        count: 100
      });
      if (res && res.data) setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, dateRange]);

  const fetchStats = useCallback(async () => {
    try {
      const from = dateRange.from_date ?? Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
      const to   = dateRange.to_date   ?? Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);
      const res = await adminAttendanceService.getStats(from, to) as any;
      if (res) {
        setStats({
          total_checkins_today: res.total_checkins_today ?? res.data?.total_checkins_today ?? 0,
          present_now: res.present_now ?? res.data?.present_now ?? 0,
          checked_out_today: res.checked_out_today ?? res.data?.checked_out_today ?? 0,
          avg_time_hours: res.avg_time_hours ?? res.data?.avg_time_hours ?? 0,
        });
      }
    } catch (err) { console.error(err); }
  }, [dateRange]);

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, [fetchRecords, fetchStats]);

  const handleSave = async () => {
    try {
      // Use epoch conversion
      const dateTimestamp = Math.floor(new Date(form.date).getTime() / 1000);

      const checkInTime = new Date(form.date + 'T' + form.checkIn);
      const checkOutTime = form.checkOut ? new Date(form.date + 'T' + form.checkOut) : undefined;

      const payload: AttendanceRequest = {
        user_id: form.user_id,
        status: form.status.toLowerCase(),
        date: dateTimestamp,
        check_in: Math.floor(checkInTime.getTime() / 1000),
        check_out: checkOutTime ? Math.floor(checkOutTime.getTime() / 1000) : undefined,
        description: ""
      };

      if (editingRecord) {
        await adminAttendanceService.updateAttendance(editingRecord.id, editingRecord.user_id, payload);
        toast.success("Attendance record updated");
      } else {
        await adminAttendanceService.createAttendance(payload);
        toast.success("New attendance logged");
      }
      setModalOpen(false);
      setEditingRecord(null);
      fetchRecords();
      fetchStats();
    } catch (err) {
      toast.error("Failed to save record");
    }
  };

  const handleEdit = (r: AttendanceResponse) => {
    setEditingRecord(r);
    setForm({
      user_id: r.user_id,
      userName: r.user_name || "", 
      date: new Date(r.date * 1000).toISOString().split('T')[0],
      checkIn: new Date(r.check_in * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }),
      checkOut: r.check_out ? new Date(r.check_out * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) : "",
      status: r.status.toLowerCase()
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await adminAttendanceService.deleteAttendance(deleteId);
        toast.success("Record purged from registry");
        setDeleteModalOpen(false);
        setDeleteId(null);
        fetchRecords();
        fetchStats();
      } catch (err) {
        toast.error("Process failure");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header row: title + date filter + view toggle */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <SectionTitle
          title={t("attendance")}
          subtitle="Precision control over member gym access and history"
        />

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Date Range Filter */}
          <DateRangeFilter
            defaultPreset="today"
            onChange={(range) => setDateRange(range)}
          />

          {/* View toggle */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
            {(["grid", "list"] as AttendanceView[]).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`p-2 rounded-lg transition-all ${viewType === type ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-white"}`}
              >
                {type === "grid" && <Grid size={18} />}
                {type === "list" && <List size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards — driven by selectedDate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t("totalCheckins")} value={`${stats.total_checkins_today ?? 0}`} icon={<UserCheck className="text-emerald-400" />} />
        <StatCard title={t("presentNow")} value={`${stats.present_now ?? 0}`} icon={<CheckCircle2 className="text-blue-400" />} />
        <StatCard title={t("checkedOut")} value={`${stats.checked_out_today ?? 0}`} icon={<Clock className="text-amber-400" />} />
        <StatCard title={t("avgTime")} value={`${stats.avg_time_hours ?? 0}h`} icon={<Filter className="text-purple-400" />} />
      </div>

      <GlassCard>
        {/* Controls — search + Mark Attendance only (date moved to top) */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition"
              placeholder="Search member by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CommonButton
            onClick={() => {
              setEditingRecord(null);
              setForm({ user_id: "", userName: "", date: new Date().toISOString().split('T')[0], checkIn: "09:00", checkOut: "", status: "present" });
              setModalOpen(true);
            }}
            className="whitespace-nowrap flex gap-2 items-center justify-center p-3 sm:p-auto"
          >
            <Plus size={18} /> {t("markAttendance")}
          </CommonButton>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
            </div>
          ) : viewType === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {records.map(record => (
                <AttendanceGridCard
                  key={record.id}
                  record={record}
                  onEdit={() => handleEdit(record)}
                  onDelete={() => { setDeleteId(record.id); setDeleteModalOpen(true); }}
                />
              ))}
              {records.length === 0 && (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-500">No attendance records found for this date.</p>
                </div>
              )}
            </motion.div>
          )}

          {viewType === "list" && !loading && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Table
                headers={["ID", "Check In", "Check Out", "Status", "Actions"]}
                rows={records.map(r => [
                  <span key={r.id} className="text-xs font-mono text-slate-500">{r.id.substring(0, 8)}...</span>,
                  new Date(r.check_in * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  r.check_out ? new Date(r.check_out * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active",
                  <span key={`${r.id}-status`} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status?.toLowerCase() === "present" ? "bg-emerald-500/20 text-emerald-400" :
                    r.status?.toLowerCase() === "late" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                    {r.status || 'N/A'}
                  </span>,
                  <div key={`${r.id}-act`} className="flex gap-3 justify-center">
                    <button onClick={() => handleEdit(r)} className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-125"><Edit2 size={16} /></button>
                    <button onClick={() => { setDeleteId(r.id); setDeleteModalOpen(true); }} className="text-red-400 hover:text-red-300 transition-transform hover:scale-125"><Trash2 size={16} /></button>
                  </div>
                ])}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </GlassCard>

      {/* Manual Entry Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRecord ? "Edit Attendance Log" : "Manual Check-In"}
        footer={
          <div className="flex gap-3">
            <CommonButton variant="ghost" onClick={() => setModalOpen(false)}>Cancel</CommonButton>
            <CommonButton onClick={handleSave}>Save Record</CommonButton>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500">Member Name</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
              value={form.user_id}
              onChange={e => {
                const user = members.find((u: any) => u.id === e.target.value);
                setForm({ ...form, user_id: e.target.value, userName: user?.name || "" });
              }}
            >
              <option value="" className="bg-slate-900">Select Member</option>
              {members.map((m: any) => (
                <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Date</label>
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Status</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="present" className="bg-slate-900">Present</option>
                <option value="absent" className="bg-slate-900">Absent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Check In</label>
              <input
                type="time"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                value={form.checkIn}
                onChange={e => setForm({ ...form, checkIn: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500">Check Out</label>
              <input
                type="time"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                value={form.checkOut}
                onChange={e => setForm({ ...form, checkOut: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Record?"
        footer={
          <div className="flex gap-2">
            <CommonButton variant="ghost" onClick={() => setDeleteModalOpen(false)}>No, Keep it</CommonButton>
            <CommonButton variant="danger" onClick={handleDelete}>Yes, Delete Log</CommonButton>
          </div>
        }
      >
        <p className="text-slate-300">Are you sure you want to delete this attendance log? This will remove the record permanently from the member's history.</p>
      </Modal>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{title}</p>
          <h4 className="text-3xl font-black text-white">{value}</h4>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}

function AttendanceGridCard({ record, onEdit, onDelete }: { record: AttendanceResponse, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition-all hover:bg-white/[0.08] relative overflow-hidden">
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-[0_8px_16px_rgba(99,102,241,0.3)]">
          {(record.user_name || 'U').charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight text-xs">{record.user_name || `ID: ${record.id.substring(0, 8)}`}</h4>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${record.status?.toLowerCase() === "present" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            }`}>
            {record.status || 'N/A'}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={onEdit} className="p-2 bg-white/5 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"><Edit2 size={14} /></button>
          <button onClick={onDelete} className="p-2 bg-white/5 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-black/20 rounded-xl relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-black">In</span>
          <p className="text-white font-bold text-sm flex items-center gap-2"><Clock size={12} /> {new Date(record.check_in * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="space-y-1 border-l border-white/10 pl-3">
          <span className="text-[10px] text-slate-500 uppercase font-black">Out</span>
          <p className="text-white font-bold text-sm flex items-center gap-2"><Clock size={12} /> {record.check_out ? new Date(record.check_out * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active"}</p>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl -z-0 rounded-full group-hover:bg-indigo-500/20 transition-all" />
    </div>
  );
}


