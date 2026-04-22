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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
              ref={index === users.length - 1 ? lastUserElementRef : null}
            >
              <div className="relative h-full flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-3xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80">
                {/* Visual Identity */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-14 w-14 rounded-2xl bg-slate-800 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                      {(user.profile_image_path || user.metadata?.profile_image_path) ? (
                        <img src={user.profile_image_path || user.metadata.profile_image_path} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <span className="text-xl font-black text-slate-500 uppercase">{user.name?.charAt(0)}</span>
                      )}
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${user.is_active !== false ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                    </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-white uppercase tracking-tight">{user.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Mail size={12} className="shrink-0" />
                    <span className="text-xs truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <Phone size={12} className="shrink-0" />
                    <span className="text-xs">{user.mobile || user.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Unified Premium Action Zone */}
                <div className="mt-auto pt-5 border-t border-white/5 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-indigo-500/20 text-indigo-400 border border-white/5 hover:border-indigo-500/30 transition-all group"
                    title="Edit Member Information"
                  >
                    <Edit2 size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Edit</span>
                  </button>

                  <button
                    onClick={() => onOpenSubscription(user)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-purple-500/20 text-purple-400 border border-white/5 hover:border-purple-500/30 transition-all group"
                    title="Manage Membership Plans"
                  >
                    <CreditCard size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Plans</span>
                  </button>

                  <button
                    onClick={() => onOpenAttendance(user)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all group"
                    title="Attendance Log"
                  >
                    <Calendar size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Log</span>
                  </button>

                  <button
                    onClick={() => onOpenDocs(user)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-amber-500/20 text-amber-400 border border-white/5 hover:border-amber-500/30 transition-all group"
                    title="Document Vault"
                  >
                    <FileText size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Docs</span>
                  </button>

                  <button
                    disabled={statusUpdating && loadingStatusId === user.id}
                    onClick={() => onToggleStatus(user.id, user.is_active !== false)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5 transition-all group ${user.is_active !== false ? 'text-amber-500 hover:bg-amber-500/10' : 'text-slate-500'}`}
                    title={user.is_active !== false ? "Suspend User" : "Reactivate User"}
                  >
                    {statusUpdating && loadingStatusId === user.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        {user.is_active !== false ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Status</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={deletingRecord && loadingDeleteId === user.id}
                    onClick={() => onDelete(user.id)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-red-500/20 text-red-500 border border-white/5 hover:border-red-500/30 transition-all group"
                    title="Permanently Remove"
                  >
                    {deletingRecord && loadingDeleteId === user.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Drop</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : !usersLoading && (
          <div className="col-span-full py-20 text-center">
            <Users size={40} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest">No users listed in this vision</p>
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
