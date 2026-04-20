import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { GlassCard, SectionTitle, LoadingSpinner, CommonButton } from "../../components/ui/primitives";
import {
  Search,
  Grid,
  List,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  UserCheck,
  FileText,
  Upload,
  File,
  HardDrive,
  Mail,
  Phone,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useGet, useMutation } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/url";
import { toast } from "../../store/toastStore";
import { Modal, Table as PrimitiveTable } from "../../components/ui/primitives";

type ViewType = "grid" | "list";
type UserRole = "admin" | "trainee" | "employee";
type ModalStep =
  | "role"
  | "details"
  | "personalInfo"
  | "healthInfo"
  | "membershipDetails"
  | "preferences";

interface PersonalInfo {
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
}

interface HealthInfo {
  medicalConditions: string;
  injuries: string;
  allergies: string;
}

interface MembershipDetails {
  planType: string;
  joiningDate: string;
  trainerAssigned: string;
}

interface PreferencesInfo {
  workoutTime: string;
  notificationPreference: string;
}

interface UserFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  role: UserRole;
  profilePhoto?: string;
  personalInfo?: PersonalInfo;
  healthInfo?: HealthInfo;
  membershipDetails?: MembershipDetails;
  preferences?: PreferencesInfo;
}

export function UserManagement() {
  // --- API State & Hooks ---
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Search sanitation: Don't send empty search params
  const queryParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  if (searchQuery.trim()) {
    queryParams.append("search", searchQuery.trim());
  }

  // Fetch Users
  const { loading: usersLoading, refetch: refetchUsers } = useGet(
    `${API_ENDPOINTS.ADMIN.USERS}?${queryParams.toString()}`,
    {
      onSuccess: (res) => {
        const newUsers = res.data || [];
        if (page === 1) {
          setAllUsers(newUsers);
        } else {
          setAllUsers((prev) => [...prev, ...newUsers]);
        }
        setHasMore(newUsers.length === perPage);
      },
    }
  );

  // Fetch Roles
  const { data: rolesData } = useGet(API_ENDPOINTS.ADMIN.ROLES);
  const roles = rolesData?.data || ["admin", "trainer", "user"];

  // Mutations
  const { mutate: createUser, loading: creating } = useMutation("post", {
    onSuccess: () => {
      setModalOpen(false);
      setPage(1);
      refetchUsers();
    }
  });

  const { mutate: editUser, loading: editing } = useMutation("patch", {
    onSuccess: () => {
      setModalOpen(false);
      setPage(1);
      refetchUsers();
    }
  });

  const { mutate: uploadFile } = useMutation("upload");

  const { mutate: performDelete } = useMutation("delete", {
    onSuccess: () => {
      setDeleteModalOpen(false);
      refetchUsers();
    }
  });

  // State management
  // View State management
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>("role");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Document Modal State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedUserForDocs, setSelectedUserForDocs] = useState<any>(null);
  const [docUploading, setDocUploading] = useState<string | null>(null); // 'profile' | 'id' | 'others'

  // Attendance Modal State
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedUserForAttendance, setSelectedUserForAttendance] = useState<any>(null);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback((node: HTMLDivElement) => {
    if (usersLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && viewType === "grid") {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [usersLoading, hasMore, viewType]);

  // Reset page on search
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    role: "trainee",
    profilePhoto: "",
    personalInfo: {
      age: "",
      gender: "",
      height: "",
      weight: "",
      fitnessGoal: "General Fitness",
    },
    healthInfo: {
      medicalConditions: "",
      injuries: "",
      allergies: "",
    },
    membershipDetails: {
      planType: "",
      joiningDate: new Date().toISOString().split("T")[0],
      trainerAssigned: "",
    },
    preferences: {
      workoutTime: "Morning",
      notificationPreference: "Email",
    },
  });

  // Filter and search users
  const filteredUsers = allUsers;

  const handleAddNew = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      role: "trainee",
      profilePhoto: "",
      personalInfo: {
        age: "",
        gender: "",
        height: "",
        weight: "",
        fitnessGoal: "General Fitness",
      },
      healthInfo: {
        medicalConditions: "",
        injuries: "",
        allergies: "",
      },
      membershipDetails: {
        planType: "",
        joiningDate: new Date().toISOString().split("T")[0],
        trainerAssigned: "",
      },
      preferences: {
        workoutTime: "Morning",
        notificationPreference: "Email",
      },
    });
    setPhotoPreview("");
    setEditingUserId(null);
    setModalStep("role");
    setModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      phone: user.phone || "",
      email: user.email,
      address: user.address || "",
      role: user.role || "trainee",
      profilePhoto: user.profilePhoto || "",
      personalInfo: user.personalInfo || {
        age: "",
        gender: "",
        height: "",
        weight: "",
        fitnessGoal: "General Fitness",
      },
      healthInfo: user.healthInfo || {
        medicalConditions: "",
        injuries: "",
        allergies: "",
      },
      membershipDetails: user.membershipDetails || {
        planType: "",
        joiningDate: new Date().toISOString().split("T")[0],
        trainerAssigned: "",
      },
      preferences: user.preferences || {
        workoutTime: "Morning",
        notificationPreference: "Email",
      },
    });
    setPhotoPreview(user.profilePhoto || "");
    setEditingUserId(user.id);
    setModalStep("details");
    setModalOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotoPreview(base64);
        setFormData({ ...formData, profilePhoto: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (modalStep === "role") {
      if (!formData.name || !formData.phone || !formData.email || !formData.role) {
        toast.error("Please fill in all required fields");
        return;
      }
      setModalStep("details");
      return;
    }

    if (modalStep === "details") {
      if (!formData.address) {
        toast.error("Please provide an address");
        return;
      }
      // Admins finish after details section
      if (formData.role === "admin") {
        handleSaveUser();
      } else {
        setModalStep("personalInfo");
      }
      return;
    }

    if (modalStep === "personalInfo") {
      setModalStep("healthInfo");
      return;
    }

    if (modalStep === "healthInfo") {
      setModalStep("membershipDetails");
      return;
    }

    if (modalStep === "membershipDetails") {
      setModalStep("preferences");
      return;
    }
  };

  const handleBackStep = () => {
    switch (modalStep) {
      case "details":
        setModalStep("role");
        break;
      case "personalInfo":
        setModalStep("details");
        break;
      case "healthInfo":
        setModalStep("personalInfo");
        break;
      case "membershipDetails":
        setModalStep("healthInfo");
        break;
      case "preferences":
        setModalStep("membershipDetails");
        break;
    }
  };

  const handleSaveUser = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.address
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      username: formData.email.split('@')[0],
      mobile: formData.phone,
      name: formData.name,
      email: formData.email,
      address: formData.address,
      role: formData.role,
      metadata: {
        height: Number(formData.personalInfo?.height || 0),
        weight: Number(formData.personalInfo?.weight || 0),
        gender: formData.personalInfo?.gender || "Male",
        dob: 0, // Placeholder
        profile_image_path: "",
        identity_proof_image_path: "",
        other_docs_path: []
      },
      joining_date: Math.floor(new Date(formData.membershipDetails?.joiningDate || "").getTime() / 1000),
      trainer_id: "00000000-0000-0000-0000-000000000000",
      plan_id: "00000000-0000-0000-0000-000000000000",
      duration_in_months: 12,
      amount: 0
    };

    if (editingUserId) {
      editUser(API_ENDPOINTS.ADMIN.USER_EDIT(editingUserId), payload);
    } else {
      createUser(API_ENDPOINTS.ADMIN.USER_CREATE, payload);
    }

    setModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    // Assuming delete endpoint follows /api/admin/user_roles/users/{id}
    performDelete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
    setDeleteTarget(null);
  };

  const getModalTitle = () => {
    if (modalStep === "personalInfo") return "Personal Information";
    if (modalStep === "healthInfo") return "Health Information";
    if (modalStep === "membershipDetails") return "Membership Details";
    if (modalStep === "preferences") return "Preferences";
    if (modalStep === "details")
      return formData.role === "admin"
        ? "Personal Details"
        : "Personal Details";
    return editingUserId ? "Edit User" : "Add User";
  };

  const getStepNumber = () => {
    const totalSteps = formData.role === "admin" ? "2" : "6";
    switch (modalStep) {
      case "role": return `1/${totalSteps}`;
      case "details": return `2/${totalSteps}`;
      case "personalInfo": return `3/${totalSteps}`;
      case "healthInfo": return `4/${totalSteps}`;
      case "membershipDetails": return `5/${totalSteps}`;
      case "preferences": return `6/${totalSteps}`;
      default: return `1/${totalSteps}`;
    }
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="mb-6">
        <SectionTitle
          title="User Management"
          subtitle="Manage gym members, trainers, and employees"
        />
      </div>

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        {/* Left: View Toggle */}
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
          <button
            onClick={() => setViewType("grid")}
            className={`p-2 rounded transition ${viewType === "grid" ? "bg-indigo-500/30 text-indigo-300" : "text-slate-400 hover:text-white"}`}
            title="Grid view"
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`p-2 rounded transition ${viewType === "list" ? "bg-indigo-500/30 text-indigo-300" : "text-slate-400 hover:text-white"}`}
            title="List view"
          >
            <List size={20} />
          </button>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-sm dark:shadow-none"
            />
          </div>
        </div>

        {/* Right: Add Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-orange-400 hover:from-indigo-600 hover:to-orange-500 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          Add User
        </motion.button>
      </div>

      {/* Grid View */}
      {viewType === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-8">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: any, index) => (
              <motion.div
                key={user.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
                ref={index === filteredUsers.length - 1 ? lastUserElementRef : null}
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
                        onClick={() => {
                          setSelectedUserForDocs(user);
                          setDocModalOpen(true);
                        }}
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
                        onClick={() => handleEdit(user)}
                        className="flex-1 h-10 flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl transition border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUserForAttendance(user);
                          setAttendanceModalOpen(true);
                        }}
                        className="flex-1 h-10 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-xl transition border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Calendar size={12} /> Log
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDeleteTarget(user.id);
                          setDeleteModalOpen(true);
                        }}
                        className="h-10 w-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 size={16} />
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
      )}

      {/* List View */}
      {viewType === "list" && (
        <div className="mb-6">
          {filteredUsers.length > 0 ? (
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
                  {allUsers.map((user) => (
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
                            onClick={() => handleEdit(user)}
                            className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-110"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserForAttendance(user);
                              setAttendanceModalOpen(true);
                            }}
                            className="text-emerald-400 hover:text-emerald-300 transition-transform hover:scale-110"
                            title="Attendance"
                          >
                            <Calendar size={18} />
                          </button>
                          <button
                            className={`${user.is_active !== false ? "text-amber-400" : "text-slate-500"} hover:scale-110 transition-transform`}
                            title={user.is_active !== false ? "Deactivate" : "Activate"}
                          >
                            {user.is_active !== false ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserForDocs(user);
                              setDocModalOpen(true);
                            }}
                            className="text-slate-400 hover:text-indigo-400 transition-transform hover:scale-110"
                            title="Documents"
                          >
                            <FileText size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(user.id);
                              setDeleteModalOpen(true);
                            }}
                            className="text-red-400 hover:text-red-300 transition-transform hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Footer for List View */}
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <p className="text-sm text-slate-400">Page {page}</p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded bg-white/10 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    disabled={!hasMore}
                    onClick={() => setPage(p => p + 1)}
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
      )}

      {/* Enhanced User Modal */}
      {createPortal(
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center pt-10 md:pt-20 pb-10 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${modalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: modalOpen ? 1 : 0 }}
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{
              scale: modalOpen ? 1 : 0.9,
              opacity: modalOpen ? 1 : 0,
              y: modalOpen ? 0 : 30,
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[9999] w-full max-w-2xl mx-4 bg-slate-950/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-fit backdrop-blur-xl mb-10"
          >
            {/* Header */}
            <div className="relative border-b border-white/15 bg-slate-900 flex-shrink-0 rounded-t-2xl overflow-hidden">
              {/* Centered Step Indicator (Non-Absolute for reliability) */}
              <div className="py-2 bg-gradient-to-r from-indigo-600 to-orange-400 flex justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                  Step {getStepNumber()}
                </span>
              </div>

              <div className="flex items-center justify-between p-8">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {getModalTitle()}
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Registration Wizard
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition text-slate-300 hover:text-white border border-white/10"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Step 1: Role Selection */}
              {modalStep === "role" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Name <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Phone Number <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Email <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Role <span className="text-orange-400">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as UserRole,
                        })
                      }
                      disabled={editingUserId !== null}
                      className={`w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition ${editingUserId ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      {roles.map((r: any) => {
                        const roleName = typeof r === 'string' ? r : r.role;
                        const roleKey = typeof r === 'string' ? r : (r.id || r.role_id);
                        return (
                          <option key={roleKey} value={roleName} className="bg-slate-900 text-white capitalize">
                            {roleName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Details */}
              {modalStep === "details" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Address <span className="text-orange-400">*</span>
                    </label>
                    <textarea
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">Documents Policy</p>
                        <p className="text-xs text-slate-400 font-medium">Profile photo and ID proofs are now managed via the "Document Vault" icon on the user card.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Personal Info */}
              {modalStep === "personalInfo" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="Age"
                        value={formData.personalInfo?.age || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              age: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Gender
                      </label>
                      <select
                        value={formData.personalInfo?.gender || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              gender: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                      >
                        <option value="" className="bg-slate-900 text-white">
                          Select Gender
                        </option>
                        <option value="Male" className="bg-slate-900 text-white">
                          Male
                        </option>
                        <option
                          value="Female"
                          className="bg-slate-900 text-white"
                        >
                          Female
                        </option>
                        <option value="Other" className="bg-slate-900 text-white">
                          Other
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="Height"
                        value={formData.personalInfo?.height || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              height: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        placeholder="Weight"
                        value={formData.personalInfo?.weight || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo!,
                              weight: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Fitness Goal
                    </label>
                    <select
                      value={formData.personalInfo?.fitnessGoal || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          personalInfo: {
                            ...formData.personalInfo!,
                            fitnessGoal: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    >
                      <option
                        value="Fat Loss"
                        className="bg-slate-900 text-white"
                      >
                        Fat Loss
                      </option>
                      <option
                        value="Muscle Gain"
                        className="bg-slate-900 text-white"
                      >
                        Muscle Gain
                      </option>
                      <option
                        value="General Fitness"
                        className="bg-slate-900 text-white"
                      >
                        General Fitness
                      </option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Health Info */}
              {modalStep === "healthInfo" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Medical Conditions (Optional)
                    </label>
                    <textarea
                      placeholder="e.g., Diabetes, Hypertension"
                      value={formData.healthInfo?.medicalConditions || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo!,
                            medicalConditions: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Injuries (Optional)
                    </label>
                    <textarea
                      placeholder="e.g., Knee pain, Back injury"
                      value={formData.healthInfo?.injuries || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo!,
                            injuries: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Allergies (Optional)
                    </label>
                    <textarea
                      placeholder="e.g., Peanuts, Latex"
                      value={formData.healthInfo?.allergies || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          healthInfo: {
                            ...formData.healthInfo!,
                            allergies: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition resize-none"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 5: Membership Details */}
              {modalStep === "membershipDetails" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Plan Type
                    </label>
                    <select
                      value={formData.membershipDetails?.planType || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          membershipDetails: {
                            ...formData.membershipDetails!,
                            planType: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    >
                      <option value="" className="bg-slate-900 text-white">
                        Select Plan
                      </option>
                      <option value="Starter" className="bg-slate-900 text-white">
                        Starter
                      </option>
                      <option
                        value="Performance"
                        className="bg-slate-900 text-white"
                      >
                        Performance
                      </option>
                      <option value="Elite" className="bg-slate-900 text-white">
                        Elite
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={formData.membershipDetails?.joiningDate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          membershipDetails: {
                            ...formData.membershipDetails!,
                            joiningDate: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Trainer Assigned
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., John Trainer"
                      value={formData.membershipDetails?.trainerAssigned || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          membershipDetails: {
                            ...formData.membershipDetails!,
                            trainerAssigned: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 6: Preferences */}
              {modalStep === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Workout Time
                    </label>
                    <select
                      value={formData.preferences?.workoutTime || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences!,
                            workoutTime: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    >
                      <option value="Morning" className="bg-slate-900 text-white">
                        Morning
                      </option>
                      <option value="Evening" className="bg-slate-900 text-white">
                        Evening
                      </option>
                      <option value="Both" className="bg-slate-900 text-white">
                        Both
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Notification Preference
                    </label>
                    <select
                      value={formData.preferences?.notificationPreference || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: {
                            ...formData.preferences!,
                            notificationPreference: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50 transition"
                    >
                      <option value="Email" className="bg-slate-900 text-white">
                        Email
                      </option>
                      <option value="SMS" className="bg-slate-900 text-white">
                        SMS
                      </option>
                      <option value="Push" className="bg-slate-900 text-white">
                        Push Notification
                      </option>
                      <option value="None" className="bg-slate-900 text-white">
                        None
                      </option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-6 border-t border-white/15 bg-white/5 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
              >
                Cancel
              </motion.button>

              {modalStep !== "role" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackStep}
                  className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Back
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={
                  modalStep === "preferences" ||
                    (modalStep === "details" && formData.role === "admin")
                    ? handleSaveUser
                    : handleNextStep
                }
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-orange-400 hover:from-indigo-600 hover:to-orange-500 text-white font-medium rounded-lg transition"
              >
                {modalStep === "preferences"
                  ? editingUserId
                    ? "Update User"
                    : "Create User"
                  : modalStep === "details" && formData.role === "admin"
                    ? editingUserId
                      ? "Update User"
                      : "Create User"
                    : "Next"}
              </motion.button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Delete Modal */}
      {deleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setDeleteModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-br from-slate-900/98 to-slate-800/98 border border-white/20 rounded-2xl shadow-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-2">
              Confirm Delete
            </h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeleteModalOpen(false)}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteTarget && handleDeleteUser(deleteTarget)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Attendance History Modal */}
      <Modal
        open={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        title={`Attendance History - ${selectedUserForAttendance?.name}`}
        footer={
          <CommonButton onClick={() => setAttendanceModalOpen(false)}>
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
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-2">
              <Plus size={14} /> Add Manuel Entry
            </button>
          </div>
        </div>
      </Modal>

      {/* Document Vault Modal */}
      <Modal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title={`Document Vault - ${selectedUserForDocs?.name}`}
        footer={<CommonButton onClick={() => setDocModalOpen(false)}>Finished</CommonButton>}
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
                  {selectedUserForDocs?.profilePhoto ? (
                    <img src={selectedUserForDocs.profilePhoto} className="h-full w-full object-cover" alt="Profile" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-600 font-black text-2xl uppercase">
                      {selectedUserForDocs?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  <Upload size={20} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDocUploading('profile');
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        // In real app, call uploadFile api here
                        toast.success("Profile photo uploaded successfully");
                        setDocUploading(null);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
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
          </div>

          {/* Others / Attachments Section */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <HardDrive size={16} />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Miscellaneous Docs</h4>
              </div>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-black/20 hover:border-indigo-500/50 cursor-pointer group transition">
              <div className="flex items-center gap-3">
                <File size={18} className="text-slate-500 group-hover:text-indigo-400" />
                <span className="text-xs font-bold text-slate-300">Attach medical clearances, waivers...</span>
              </div>
              <Plus size={16} className="text-slate-500" />
              <input type="file" multiple className="hidden" />
            </label>

            <p className="mt-3 text-[10px] text-slate-500 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All uploads are encrypted and securely stored.
            </p>
          </div>
        </div>
      </Modal>
    </GlassCard>
  );
}
