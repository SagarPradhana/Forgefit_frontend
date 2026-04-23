import { motion } from "framer-motion";
import { Edit2, Calendar, ToggleRight, ToggleLeft, Trash2, FileText, Mail, Phone, Users, Loader2, ChevronLeft, ChevronRight, CreditCard, Key, Contact } from "lucide-react";
import type { ViewType } from "./types";
import { useState, useEffect } from "react";

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
  onResetPassword: (user: any) => void;
  onOpenIdCard: (user: any) => void;
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
  onResetPassword,
  onOpenIdCard,
  lastUserElementRef,
}: UserListViewProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
              <div className="relative h-full flex flex-col overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-3xl p-4 md:p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80">
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
                    <h3 className="truncate text-xs md:text-sm font-black text-white uppercase tracking-tight">{user.name}</h3>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
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
                <div className="mt-auto pt-4 md:pt-5 border-t border-white/5 grid grid-cols-4 gap-1.5 md:gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-indigo-500/20 text-indigo-400 border border-white/5 hover:border-indigo-500/30 transition-all group"
                    title="Edit Member Information"
                  >
                    <Edit2 size={isMobile ? 14 : 16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">Edit</span>
                  </button>
                  <button
                    onClick={() => onOpenSubscription(user)}
                    className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-purple-500/20 text-purple-400 border border-white/5 hover:border-purple-500/30 transition-all group"
                    title="Manage Membership Plans"
                  >
                    <CreditCard size={isMobile ? 14 : 16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">Plans</span>
                  </button>
                  <button
                    onClick={() => onOpenAttendance(user)}
                    className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all group"
                    title="Attendance Log"
                  >
                    <Calendar size={isMobile ? 14 : 16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">Log</span>
                  </button>
                  <button
                    onClick={() => onOpenDocs(user)}
                    className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-amber-500/20 text-amber-400 border border-white/5 hover:border-amber-500/30 transition-all group"
                    title="Document Vault"
                  >
                    <FileText size={isMobile ? 14 : 16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">Docs</span>
                  </button>
                  <button
                    disabled={statusUpdating && loadingStatusId === user.id}
                    onClick={() => onToggleStatus(user.id, user.is_active !== false)}
                    className={`flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 transition-all group ${user.is_active !== false ? 'text-amber-500 hover:bg-amber-500/10' : 'text-slate-500'}`}
                    title={user.is_active !== false ? "Suspend User" : "Reactivate User"}
                  >
                    {statusUpdating && loadingStatusId === user.id ? (
                      <Loader2 size={isMobile ? 14 : 16} className="animate-spin" />
                    ) : (
                      <>
                        {user.is_active !== false ? <ToggleRight size={isMobile ? 14 : 16} /> : <ToggleLeft size={isMobile ? 14 : 16} />}
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">Status</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onOpenIdCard(user)}
                    className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all group"
                    title="View Identity Card"
                  >
                    <Contact size={isMobile ? 14 : 16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">ID Card</span>
                  </button>
                  <button
                    onClick={() => onResetPassword(user)}
                    className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-slate-600/20 text-slate-400 border border-white/5 hover:border-slate-500/30 transition-all group"
                    title="Security Override"
                  >
                    <Key size={isMobile ? 14 : 16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">Reset</span>
                  </button>
                  <button
                    disabled={deletingRecord && loadingDeleteId === user.id}
                    onClick={() => onDelete(user.id)}
                    className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/5 hover:bg-red-500/20 text-red-500 border border-white/5 hover:border-red-500/30 transition-all group"
                    title="Permanently Remove"
                  >
                    {deletingRecord && loadingDeleteId === user.id ? (
                      <Loader2 size={isMobile ? 14 : 16} className="animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={isMobile ? 14 : 16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter opacity-60">Drop</span>
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
    <div className="mb-8">
      {users.length > 0 ? (
        <div className="relative overflow-hidden rounded-xl md:rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-3xl shadow-2xl">
          <div className="hidden lg:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-white/10 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                  <th className="text-left py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-white/10">Member Identity</th>
                  <th className="text-left py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-white/10">Contact Matrix</th>
                  <th className="text-center py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-white/10">Auth Status</th>
                  <th className="text-right py-6 px-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-white/10">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-gradient-to-b from-transparent to-white/[0.02]">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-5">
                        <div className="relative h-14 w-14 rounded-2xl bg-slate-800 border-2 border-white/15 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl group-hover:border-indigo-500/50 transition-all duration-500">
                          {(user.profile_image_path || user.metadata?.profile_image_path) ? (
                            <img src={user.profile_image_path || user.metadata.profile_image_path} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                          ) : (
                            <span className="text-lg font-black text-slate-500 group-hover:text-indigo-400 transition-colors">{user.name?.charAt(0)}</span>
                          )}
                          <div className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 shadow-lg ${user.is_active !== false ? 'bg-emerald-500' : 'bg-slate-500'} animate-pulse`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-white text-base uppercase tracking-tight truncate leading-tight mb-1 group-hover:text-indigo-200 transition-colors">{user.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] text-slate-500 font-bold uppercase tracking-widest border border-white/5 group-hover:text-slate-300 transition-colors">ID: {user.id?.slice(0, 8)}</span>
                            <span className="text-[9px] font-black text-indigo-400/80 uppercase tracking-tighter italic">{user.role}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                          <div className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <Mail size={12} className="text-indigo-400" />
                          </div>
                          <span className="text-xs font-medium truncate max-w-[200px]">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                          <div className="h-6 w-6 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                            <Phone size={12} className="text-orange-400" />
                          </div>
                          <span className="text-xs font-bold tracking-tight">{user.mobile || user.phone || 'NO DATA'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-center">
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300 shadow-lg ${user.is_active !== false ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-700/20 text-slate-500 border-white/5'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${user.is_active !== false ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-slate-500'}`} />
                        {user.is_active !== false ? 'Verified Active' : 'System Suspended'}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 group-hover:scale-105 transition-transform origin-right">
                        <button
                          onClick={() => onEdit(user)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] hover:bg-indigo-500 text-indigo-400 hover:text-white border border-white/5 transition-all shadow-xl hover:shadow-indigo-500/40 group/btn"
                          title="Edit Operational Data"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onOpenSubscription(user)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] hover:bg-purple-500 text-purple-400 hover:text-white border border-white/5 transition-all shadow-xl hover:shadow-purple-500/40"
                          title="Membership Protocol"
                        >
                          <CreditCard size={16} />
                        </button>
                        <button
                          onClick={() => onOpenAttendance(user)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] hover:bg-emerald-500 text-emerald-400 hover:text-white border border-white/5 transition-all shadow-xl hover:shadow-emerald-500/40"
                          title="Registry Log"
                        >
                          <Calendar size={16} />
                        </button>
                        <button
                          onClick={() => onOpenDocs(user)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] hover:bg-amber-500 text-amber-400 hover:text-white border border-white/5 transition-all shadow-xl hover:shadow-amber-500/40"
                          title="Identity Vault"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => onOpenIdCard(user)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] hover:bg-emerald-500 text-emerald-400 hover:text-white border border-white/5 transition-all shadow-xl hover:shadow-emerald-500/40"
                          title="View Identity Card Protocol"
                        >
                          <Contact size={16} />
                        </button>
                        <button
                          onClick={() => onResetPassword(user)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] hover:bg-slate-600 text-slate-400 hover:text-white border border-white/5 transition-all shadow-xl hover:shadow-slate-500/40"
                          title="Reset Security Protocol"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          disabled={statusUpdating && loadingStatusId === user.id}
                          onClick={() => onToggleStatus(user.id, user.is_active !== false)}
                          className={`h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] border border-white/5 transition-all shadow-xl ${user.is_active !== false ? 'text-amber-500 hover:bg-amber-500 hover:text-white shadow-amber-500/20' : 'text-slate-500 hover:bg-slate-500 hover:text-white'}`}
                        >
                          {statusUpdating && loadingStatusId === user.id ? <Loader2 size={16} className="animate-spin" /> : (user.is_active !== false ? <ToggleRight size={20} /> : <ToggleLeft size={20} />)}
                        </button>
                        <button
                          disabled={deletingRecord && loadingDeleteId === user.id}
                          onClick={() => onDelete(user.id)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.07] hover:bg-red-500 text-red-500 hover:text-white border border-white/5 transition-all shadow-xl hover:shadow-red-500/40"
                          title="Terminate Access"
                        >
                          {deletingRecord && loadingDeleteId === user.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST VIEW (Responsive Cards) */}
          <div className="lg:hidden divide-y divide-white/5">
            {users.map((user, index) => (
              <div key={user.id || index} className="p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-12 w-12 rounded-xl bg-slate-800 border-2 border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {(user.profile_image_path || user.metadata?.profile_image_path) ? (
                      <img src={user.profile_image_path || user.metadata.profile_image_path} className="h-full w-full object-cover" alt="" />
                    ) : (
                      <span className="text-lg font-black text-slate-500">{user.name?.charAt(0)}</span>
                    )}
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${user.is_active !== false ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-sm uppercase tracking-tight truncate">{user.name}</p>
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <Mail size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <Phone size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400">{user.mobile || user.phone || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user.is_active !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/20 text-slate-500'}`}>
                    {user.is_active !== false ? 'Active' : 'Suspended'}
                  </span>
                  <div className="flex gap-1.5">
                    <button onClick={() => onEdit(user)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400"><Edit2 size={14}/></button>
                    <button onClick={() => onOpenSubscription(user)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-400"><CreditCard size={14}/></button>
                    <button onClick={() => onOpenAttendance(user)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400"><Calendar size={14}/></button>
                    <button onClick={() => onDelete(user.id)} className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/20 text-red-500"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ULTRA VISIBLE PAGINATION HUB */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-8 bg-black/40 border-t border-white/10 backdrop-blur-2xl gap-4">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                <p className="text-[10px] md:text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Live Registry • Page {page}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
              <motion.button
                whileHover={page !== 1 ? { scale: 1.05, x: -5 } : {}}
                whileTap={page !== 1 ? { scale: 0.95 } : {}}
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="flex-1 sm:flex-none group flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl bg-white/10 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] border border-white/10 hover:border-indigo-400 transition-all shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Prev
              </motion.button>

              <div className="hidden sm:block h-10 w-[1px] bg-white/10 mx-2" />

              <motion.button
                whileHover={hasMore ? { scale: 1.05, x: 5 } : {}}
                whileTap={hasMore ? { scale: 0.95 } : {}}
                disabled={!hasMore}
                onClick={() => onPageChange(page + 1)}
                className="flex-1 sm:flex-none group flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] border border-indigo-400 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      ) : usersLoading ? (
        <div className="text-center py-32 bg-slate-900/60 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
          <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Syncing Registry...</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Accessing central database signatures</p>
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-900/60 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
          <div className="h-24 w-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Users size={48} className="text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">Void Detected in Registry</h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">The central repository returned zero authenticated signatures. Adjust sensors or verify credentials.</p>
        </div>
      )}
    </div>
  );
};
