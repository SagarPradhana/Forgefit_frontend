import { motion } from "framer-motion";
import { Grid, List as ListIcon, Edit2, Calendar, ToggleRight, ToggleLeft, Trash2, FileText, Mail, Phone, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
  lastUserElementRef,
}: UserListViewProps) => {
  if (viewType === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
        {users.length > 0 ? (
          users.map((user: any, index) => (
            <motion.div
              key={user.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
              ref={index === users.length - 1 ? lastUserElementRef : null}
            >
              <div className="relative h-full flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/40 hover:bg-slate-900/60 hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)]">
                {/* Glass Highlight */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-[80px]" />

                {/* Header: Identity */}
                <div className="relative mb-6 flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-400 p-[2px] shadow-lg">
                      <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950 font-black text-xl text-white uppercase tracking-tighter">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-slate-900 ${user.is_active !== false ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black tracking-tight text-white uppercase group-hover:text-indigo-300 transition-colors">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                        {user.role || 'Member'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => onOpenDocs(user)}
                      className="p-2.5 bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 rounded-xl transition border border-white/10 shadow-lg"
                      title="Document Vault"
                    >
                      <FileText size={18} />
                    </button>
                  </div>
                </div>

                {/* Body: Metadata Icons */}
                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                    <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Mail size={14} className="text-indigo-400" />
                    </div>
                    <span className="text-xs font-medium truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                    <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                      <Phone size={14} className="text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium tracking-wider">{user.mobile || user.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Footer: Multi-Action Zone */}
                <div className="pt-5 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={() => onEdit(user)}
                      className="flex-1 h-10 flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl transition border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onOpenAttendance(user)}
                      className="flex-1 h-10 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-xl transition border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Calendar size={12} /> Log
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={statusUpdating && loadingStatusId === user.id}
                      onClick={() => onToggleStatus(user.id, user.is_active !== false)}
                      className={`flex-1 flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition ${user.is_active !== false
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20"
                        } ${statusUpdating && loadingStatusId === user.id ? "opacity-50 cursor-wait" : ""}`}
                      title={user.is_active !== false ? "Deactivate User" : "Activate User"}
                    >
                      {statusUpdating && loadingStatusId === user.id ? <Loader2 size={14} className="animate-spin" /> : (user.is_active !== false ? <ToggleRight size={14} /> : <ToggleLeft size={14} />)}
                      {user.is_active !== false ? "Active" : "Inactive"}
                    </button>
                    <button
                      disabled={deletingRecord && loadingDeleteId === user.id}
                      onClick={() => onDelete(user.id)}
                      className={`h-10 w-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20 ${deletingRecord && loadingDeleteId === user.id ? "opacity-50 cursor-wait" : ""}`}
                      title="Delete"
                    >
                      {deletingRecord && loadingDeleteId === user.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
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
