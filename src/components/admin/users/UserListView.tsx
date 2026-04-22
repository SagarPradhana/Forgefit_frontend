import { motion } from "framer-motion";
import { Grid, List as ListIcon, Edit2, Calendar, ToggleRight, ToggleLeft, Trash2, FileText, Mail, Phone, Users, Loader2, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import type { ViewType } from "./types";

interface UserListViewProps {
  viewType: ViewType;
  users: any[];
  usersLoading: boolean;
  statusUpdating: boolean;
  deletingRecord: boolean;
  loadingStatusId: string | null;
  loadingDeleteId: string | null;
  page: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onEdit: (user: any) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  onOpenDocs: (user: any) => void;
  onOpenAttendance: (user: any) => void;
  onOpenSubscription: (user: any) => void;
  lastUserElementRef: (node: HTMLDivElement) => void;
}

export const UserListView = ({
  viewType,
  users,
  usersLoading,
  statusUpdating,
  deletingRecord,
  loadingStatusId,
  loadingDeleteId,
  page,
  hasMore,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenDocs,
  onOpenAttendance,
  onOpenSubscription,
  lastUserElementRef,
}: UserListViewProps) => {
  if (viewType === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
        {users.length > 0 ? (
          users.map((user: any, index) => (
            <motion.div
              key={user.id || index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.05,
                ease: [0.23, 1, 0.32, 1] 
              }}
              className="group relative"
              ref={index === users.length - 1 ? lastUserElementRef : null}
            >
              <div className="relative h-full flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl p-7 transition-all duration-700 hover:-translate-y-3 hover:border-indigo-500/50 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)] group/card">
                {/* 🌈 Premium Mesh Gradient Background */}
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px] group-hover/card:bg-indigo-500/20 transition-all duration-700" />
                <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-emerald-500/5 blur-[100px] group-hover/card:bg-emerald-500/10 transition-all duration-700" />

                {/* Header: Ultimate Identity */}
                <div className="relative mb-8 flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative flex-shrink-0 group/avatar">
                      {/* Rotating Gradient Border */}
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 opacity-40 group-hover/avatar:opacity-100 group-hover/avatar:rotate-180 transition-all duration-1000 blur-sm" />
                      <div className="relative h-16 w-16 rounded-2xl bg-slate-950 p-[2px] shadow-2xl">
                        <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-900 font-black text-2xl text-white uppercase tracking-tighter overflow-hidden">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            user.name.charAt(0)
                          )}
                        </div>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-slate-950 ${user.is_active !== false ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-slate-500'}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-black tracking-tight text-white uppercase group-hover/card:text-indigo-300 transition-colors">
                        {user.name}
                      </h3>
                      <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Users size={10} className="text-slate-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {user.role || 'Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onOpenDocs(user)}
                    className="p-3 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 rounded-2xl transition-all duration-300 border border-white/10 shadow-xl group/doc"
                    title="Document Vault"
                  >
                    <FileText size={20} className="group-hover/doc:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Body: High-Density Data rows */}
                <div className="flex-1 space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Mail size={16} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Email Address</p>
                      <p className="text-xs font-bold text-slate-300 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Phone size={16} className="text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Contact Number</p>
                      <p className="text-xs font-bold text-slate-300 tracking-wider">
                        {user.mobile || user.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer: Ultimate Action Zone */}
                <div className="pt-6 border-t border-white/10 grid grid-cols-5 gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-indigo-500/20 text-indigo-400 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group/btn"
                    title="Edit Profile"
                  >
                    <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60 group-hover/btn:opacity-100">Edit</span>
                  </button>

                  <button
                    onClick={() => onOpenAttendance(user)}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group/btn"
                    title="Record Attendance"
                  >
                    <Calendar size={16} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60 group-hover/btn:opacity-100">Log</span>
                  </button>

                  <button
                    onClick={() => onOpenSubscription(user)}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-purple-500/20 text-purple-400 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group/btn"
                    title="Manage Subscriptions"
                  >
                    <CreditCard size={16} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60 group-hover/btn:opacity-100">Plans</span>
                  </button>

                  <button
                    disabled={statusUpdating && loadingStatusId === user.id}
                    onClick={() => onToggleStatus(user.id, user.is_active !== false)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl border transition-all duration-300 group/btn ${user.is_active !== false
                      ? "bg-white/5 text-amber-400 border-white/5 hover:bg-amber-500/20 hover:border-amber-500/30"
                      : "bg-white/5 text-slate-500 border-white/5 hover:bg-slate-500/20"
                      } ${statusUpdating && loadingStatusId === user.id ? "opacity-50 cursor-wait" : ""}`}
                    title={user.is_active !== false ? "Suspend User" : "Reactivate User"}
                  >
                    {statusUpdating && loadingStatusId === user.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        {user.is_active !== false ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-60 group-hover/btn:opacity-100">State</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={deletingRecord && loadingDeleteId === user.id}
                    onClick={() => onDelete(user.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-white/5 hover:bg-red-500/20 text-red-500 border border-white/5 hover:border-red-500/30 transition-all duration-300 group/btn ${deletingRecord && loadingDeleteId === user.id ? "opacity-50 cursor-wait" : ""}`}
                    title="Delete Permanently"
                  >
                    {deletingRecord && loadingDeleteId === user.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-60 group-hover/btn:opacity-100">Drop</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : !usersLoading && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 mb-4">
              <Users size={32} className="text-slate-600" />
            </div>
            <h4 className="text-xl font-bold text-white mb-1">No users found</h4>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
        {usersLoading && (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      {users.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-slate-300">Name</th>
                <th className="text-left py-4 px-4 text-slate-300">Email</th>
                <th className="text-left py-4 px-4 text-slate-300">Mobile</th>
                <th className="text-left py-4 px-4 text-slate-300">Role</th>
                <th className="text-center py-4 px-4 text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                  <td className="py-4 px-4 text-slate-300">{user.email}</td>
                  <td className="py-4 px-4 text-slate-300">{user.mobile || user.phone}</td>
                  <td className="py-4 px-4">
                    <span className="capitalize bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-110"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onOpenAttendance(user)}
                        className="text-emerald-400 hover:text-emerald-300 transition-transform hover:scale-110"
                        title="Attendance"
                      >
                        <Calendar size={18} />
                      </button>
                      <button
                        onClick={() => onOpenSubscription(user)}
                        className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-110"
                        title="Subscription"
                      >
                        <CreditCard size={18} />
                      </button>
                      <button
                        disabled={statusUpdating && loadingStatusId === user.id}
                        onClick={() => onToggleStatus(user.id, user.is_active !== false)}
                        className={`${user.is_active !== false ? "text-amber-400" : "text-slate-500"} hover:scale-110 transition-transform ${statusUpdating && loadingStatusId === user.id ? "opacity-50" : ""}`}
                        title={user.is_active !== false ? "Deactivate" : "Activate"}
                      >
                        {statusUpdating && loadingStatusId === user.id ? <Loader2 size={16} className="animate-spin" /> : (user.is_active !== false ? <ToggleRight size={20} /> : <ToggleLeft size={20} />)}
                      </button>
                      <button
                        onClick={() => onOpenDocs(user)}
                        className="text-slate-400 hover:text-indigo-400 transition-transform hover:scale-110"
                        title="Documents"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        disabled={deletingRecord && loadingDeleteId === user.id}
                        onClick={() => onDelete(user.id)}
                        className={`text-red-400 hover:text-red-300 transition-transform hover:scale-110 ${deletingRecord && loadingDeleteId === user.id ? "opacity-50" : ""}`}
                        title="Delete"
                      >
                        {deletingRecord && loadingDeleteId === user.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <p className="text-sm text-slate-400">Page {page}</p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="p-2 rounded bg-white/10 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={!hasMore}
                onClick={() => onPageChange(page + 1)}
                className="p-2 rounded bg-white/10 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">No users found</div>
      )}
    </div>
  );
};
