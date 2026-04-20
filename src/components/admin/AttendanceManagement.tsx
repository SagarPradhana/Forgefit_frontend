import { useState, useMemo } from "react";
import { GlassCard, SectionTitle, Table, CommonButton, Modal } from "../ui/primitives";
import {
  Grid,
  List,
  Search,
  UserCheck,
  Clock,
  Filter,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AttendanceView = "grid" | "list";

interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  checkIn: string;
  checkOut?: string;
  status: "Present" | "Absent" | "Late";
  date: string;
}

export function AttendanceManagement() {
  const [viewType, setViewType] = useState<AttendanceView>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({
    userName: "",
    date: new Date().toISOString().split('T')[0],
    checkIn: "09:00",
    checkOut: "10:30",
    status: "Present" as "Present" | "Absent" | "Late"
  });

  // Mock data for attendance
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: "1", userId: "u1", userName: "Sophia Carter", userRole: "Member", checkIn: "07:15 AM", checkOut: "08:45 AM", status: "Present", date: "2026-04-20" },
    { id: "2", userId: "u2", userName: "Noah Kent", userRole: "Member", checkIn: "08:30 AM", status: "Present", date: "2026-04-20" },
    { id: "3", userId: "u3", userName: "Amira Lopez", userRole: "Member", checkIn: "09:00 AM", checkOut: "10:30 AM", status: "Late", date: "2026-04-20" },
  ]);

  const filteredData = useMemo(() => {
    return records.filter(a =>
      (a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.userId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      a.date === selectedDate
    );
  }, [searchQuery, records, selectedDate]);

  const handleSave = () => {
    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? { ...r, ...form } : r));
    } else {
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId: "manual",
        userRole: "Member",
        ...form
      };
      setRecords([newRecord, ...records]);
    }
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleEdit = (r: AttendanceRecord) => {
    setEditingRecord(r);
    setForm({
      userName: r.userName,
      date: r.date,
      checkIn: r.checkIn,
      checkOut: r.checkOut || "",
      status: r.status
    });
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      setRecords(records.filter(r => r.id !== deleteId));
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <SectionTitle
          title="Attendance Management"
          subtitle="Precision control over member gym access and history"
        />

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Check-ins" value={`${records.length}`} icon={<UserCheck className="text-emerald-400" />} />
        <StatCard title="Present Today" value={`${records.filter(r => r.date === selectedDate).length}`} icon={<CheckCircle2 className="text-blue-400" />} />
        <StatCard title="Lates Reported" value={`${records.filter(r => r.status === "Late").length}`} icon={<Clock className="text-amber-400" />} />
        <StatCard title="Avg. Time" value="1.2h" icon={<Filter className="text-purple-400" />} />
      </div>

      <GlassCard>
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-indigo-500 transition"
              placeholder="Search member by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <input
              type="date"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <CommonButton
              onClick={() => {
                setEditingRecord(null);
                setForm({ userName: "", date: selectedDate, checkIn: "09:00", checkOut: "", status: "Present" });
                setModalOpen(true);
              }}
              className="whitespace-nowrap flex gap-2 items-center"
            >
              <Plus size={18} /> Mark Attendance
            </CommonButton>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewType === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredData.map(record => (
                <AttendanceGridCard
                  key={record.id}
                  record={record}
                  onEdit={() => handleEdit(record)}
                  onDelete={() => { setDeleteId(record.id); setDeleteModalOpen(true); }}
                />
              ))}
              {filteredData.length === 0 && (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-500">No attendance records found for this date.</p>
                </div>
              )}
            </motion.div>
          )}

          {viewType === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Table
                headers={["Member", "Check In", "Check Out", "Status", "Actions"]}
                rows={filteredData.map(r => [
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {r.userName.charAt(0)}
                    </div>
                    <span className="font-medium text-white">{r.userName}</span>
                  </div>,
                  r.checkIn,
                  r.checkOut || "Active",
                  <span key={`${r.id}-status`} className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === "Present" ? "bg-emerald-500/20 text-emerald-400" :
                    r.status === "Late" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                    {r.status}
                  </span>,
                  <div key={`${r.id}-act`} className="flex gap-3 justify-center">
                    <button onClick={() => handleEdit(r)} className="text-indigo-400 hover:text-indigo-300"><Edit2 size={16} /></button>
                    <button onClick={() => { setDeleteId(r.id); setDeleteModalOpen(true); }} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
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
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
              placeholder="e.g. Sophia Carter"
              value={form.userName}
              onChange={e => setForm({ ...form, userName: e.target.value })}
            />
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
                onChange={e => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
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

function AttendanceGridCard({ record, onEdit, onDelete }: { record: AttendanceRecord, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition-all hover:bg-white/[0.08] relative overflow-hidden">
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-[0_8px_16px_rgba(99,102,241,0.3)]">
          {record.userName.charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{record.userName}</h4>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${record.status === "Present" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
            }`}>
            {record.status}
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
          <p className="text-white font-bold text-sm flex items-center gap-2"><Clock size={12} /> {record.checkIn}</p>
        </div>
        <div className="space-y-1 border-l border-white/10 pl-3">
          <span className="text-[10px] text-slate-500 uppercase font-black">Out</span>
          <p className="text-white font-bold text-sm flex items-center gap-2"><Clock size={12} /> {record.checkOut || "Active"}</p>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl -z-0 rounded-full group-hover:bg-indigo-500/20 transition-all" />
    </div>
  );
}


