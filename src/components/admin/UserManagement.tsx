import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard, SectionTitle } from "../../components/ui/primitives";
import { Search, Grid, List, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useGet, useMutation } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/url";
import { toast } from "../../store/toastStore";

// Sub-components
import { UserModal } from "./users/UserModal";
import { UserListView } from "./users/UserListView";
import { DocumentModal } from "./users/DocumentModal";
import { AttendanceModal } from "./users/AttendanceModal";
import { DeleteUserModal } from "./users/DeleteUserModal";

// Types
import type { ViewType, ModalStep, UserFormData } from "./users/types";

export function UserManagement() {
  // --- States ---
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>("role");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingStatusId, setLoadingStatusId] = useState<string | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  console.log("photoPreview", photoPreview);

  // Document Modal State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedUserForDocs, setSelectedUserForDocs] = useState<any>(null);
  const [docUploading, setDocUploading] = useState<string | null>(null);

  // Attendance Modal State
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedUserForAttendance, setSelectedUserForAttendance] = useState<any>(null);

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // --- API Fetching ---
  const queryParams = new URLSearchParams({
    offset: String((page - 1) * perPage),
    count: String(perPage),
  });
  if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());

  const { loading: usersLoading, refetch: refetchUsers } = useGet(
    `${API_ENDPOINTS.ADMIN.USERS}?${queryParams.toString()}`,
    {
      onSuccess: (res) => {
        const newUsers = res.data || [];
        if (page === 1) setAllUsers(newUsers);
        else setAllUsers((prev) => [...prev, ...newUsers]);
        setHasMore(newUsers.length === perPage);
      },
    }
  );

  const { data: rolesData } = useGet(API_ENDPOINTS.ADMIN.ROLES);
  const roles = rolesData?.data || ["admin", "trainer", "user"];

  const { data: plansData } = useGet(API_ENDPOINTS.ADMIN.PLANS);
  const plans = plansData?.data || [];

  const { data: trainersData } = useGet(`${API_ENDPOINTS.ADMIN.USERS}?role=trainer`);
  const trainers = trainersData?.data || [];

  // --- Mutations ---
  const { mutate: createUser, loading: creating } = useMutation("post", {
    onSuccess: () => {
      setModalOpen(false);
      setPage(1);
      toast.success("User created successfully");
      refetchUsers();
    }
  });

  const { mutate: editUser, loading: editing } = useMutation("patch", {
    onSuccess: () => {
      setModalOpen(false);
      setPage(1);
      toast.success("User updated successfully");
      refetchUsers();
    }
  });

  const { mutate: patchStatus, loading: statusUpdating } = useMutation("patch", {
    onSuccess: () => {
      toast.success("User status updated successfully");
      setLoadingStatusId(null);
      refetchUsers();
    },
    onError: () => setLoadingStatusId(null)
  });

  const { mutate: deleteUserRecord, loading: deletingRecord } = useMutation("delete", {
    onSuccess: () => {
      toast.success("User deleted successfully from records");
      setDeleteModalOpen(false);
      setLoadingDeleteId(null);
      refetchUsers();
    },
    onError: () => setLoadingDeleteId(null)
  });

  const { mutate: deleteDocument, loading: docDeleting } = useMutation("delete", {
    onSuccess: () => {
      toast.success("Document permanently removed");
      refetchUsers();
    }
  });

  // --- Logic ---
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    role: roles?.[0]?.role,
    profilePhoto: "",
    password: "",
    personalInfo: {
      age: "", gender: "", height: "", weight: "", fitnessGoal: "General Fitness", dob: "",
    },
    healthInfo: {
      medicalConditions: "", injuries: "", allergies: "",
    },
    membershipDetails: {
      planType: "", joiningDate: new Date().toISOString().split("T")[0], trainerAssigned: "",
      planId: "", trainerId: "", durationInMonths: 12, amount: 0,
    },
    preferences: {
      workoutTime: "Morning", notificationPreference: "Email",
    },
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

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

  const handleAddNew = () => {
    setFormData({
      name: "", phone: "", email: "", address: "", role: roles?.[0]?.role, profilePhoto: "", password: "",
      personalInfo: { age: "", gender: "", height: "", weight: "", fitnessGoal: "General Fitness", dob: "" },
      healthInfo: { medicalConditions: "", injuries: "", allergies: "" },
      membershipDetails: {
        planType: "", joiningDate: new Date().toISOString().split("T")[0], trainerAssigned: "",
        planId: "", trainerId: "", durationInMonths: 12, amount: 0,
      },
      preferences: { workoutTime: "Morning", notificationPreference: "Email" },
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
      role: user.role || roles?.[0]?.role,
      profilePhoto: user.profilePhoto || "",
      password: "",
      personalInfo: user.personalInfo || {
        age: "", gender: "", height: "", weight: "", fitnessGoal: "General Fitness",
        dob: user.metadata?.dob ? new Date(user.metadata.dob * 1000).toISOString().split('T')[0] : "",
      },
      healthInfo: user.healthInfo || { medicalConditions: "", injuries: "", allergies: "" },
      membershipDetails: user.membershipDetails || {
        planType: user.plan_name || "",
        joiningDate: user.joining_date ? new Date(user.joining_date * 1000).toISOString().split('T')[0] : new Date().toISOString().split("T")[0],
        trainerAssigned: user.trainer_name || "",
        planId: user.plan_id || "",
        trainerId: user.trainer_id || "",
        durationInMonths: user.duration_in_months || 12,
        amount: user.amount || 0,
      },
      preferences: user.preferences || { workoutTime: "Morning", notificationPreference: "Email" },
    });
    setPhotoPreview(user.profilePhoto || "");
    setEditingUserId(user.id);
    setModalStep(user.role === "admin" ? "role" : "details");
    setModalOpen(true);
    setShowPassword(false);
  };

  const handleNextStep = () => {
    if (modalStep === "role") {
      if (!formData.name || !formData.phone || !formData.role) {
        toast.error("Please fill in all required fields (Name and Phone)");
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
      if (formData.role === "admin") handleSaveUser();
      else setModalStep("personalInfo");
      return;
    }
    if (modalStep === "personalInfo") setModalStep("healthInfo");
    else if (modalStep === "healthInfo") setModalStep("membershipDetails");
    else if (modalStep === "membershipDetails") setModalStep("preferences");
  };

  const handleBackStep = () => {
    const steps: ModalStep[] = ["role", "details", "personalInfo", "healthInfo", "membershipDetails", "preferences"];
    const currentIndex = steps.indexOf(modalStep);
    if (currentIndex > 0) setModalStep(steps[currentIndex - 1]);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.phone || !formData.role || !formData.address) {
      toast.error("Please fill in all mandatory fields");
      return;
    }

    const payload = {
      username: formData.email ? formData.email.split('@')[0] : formData.phone,
      mobile: formData.phone,
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      address: formData.address,
      role: formData.role,
      metadata: {
        height: Number(formData.personalInfo?.height || 0),
        weight: Number(formData.personalInfo?.weight || 0),
        gender: formData.personalInfo?.gender || "Male",
        dob: formData.personalInfo?.dob ? Math.floor(new Date(formData.personalInfo.dob).getTime() / 1000) : 0,
        profile_image_path: "",
        identity_proof_image_path: "",
        other_docs_path: []
      },
      joining_date: Math.floor(new Date(formData.membershipDetails?.joiningDate || "").getTime() / 1000),
      trainer_id: formData.membershipDetails?.trainerId || "00000000-0000-0000-0000-000000000000",
      plan_id: formData.membershipDetails?.planId || "00000000-0000-0000-0000-000000000000",
      duration_in_months: Number(formData.membershipDetails?.durationInMonths || 12),
      amount: Number(formData.membershipDetails?.amount || 0)
    };

    if (editingUserId) editUser(API_ENDPOINTS.ADMIN.USER_EDIT(editingUserId), payload);
    else createUser(API_ENDPOINTS.ADMIN.USER_CREATE, payload);
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    setLoadingStatusId(userId);
    patchStatus(API_ENDPOINTS.ADMIN.USER_STATUS(userId), { status: !currentStatus });
  };

  const handleDocDelete = (docType: string, docUrl: string) => {
    if (!selectedUserForDocs) return;
    const url = `${API_ENDPOINTS.ADMIN.USER_DOC_DELETE(selectedUserForDocs.id)}?doc_type=${docType}&doc_full_url=${encodeURIComponent(docUrl)}`;
    deleteDocument(url);
  };

  const handleDeleteUser = (userId: string) => {
    setLoadingDeleteId(userId);
    deleteUserRecord(API_ENDPOINTS.ADMIN.USER_DELETE(userId));
    setDeleteTarget(null);
    // Modal closes on success
  };

  const getModalTitle = () => {
    if (modalStep === "personalInfo") return "Personal Information";
    if (modalStep === "healthInfo") return "Health Information";
    if (modalStep === "membershipDetails") return "Membership Details";
    if (modalStep === "preferences") return "Preferences";
    if (modalStep === "details") return "Personal Details";
    return editingUserId ? "Edit User" : "Add User";
  };

  const getStepNumber = () => {
    const isAdmin = formData.role?.toLowerCase() === "admin";
    const totalSteps = isAdmin ? "2" : "6";
    const stepMap: Record<ModalStep, string> = {
      role: "1", details: "2", personalInfo: "3", healthInfo: "4", membershipDetails: "5", preferences: "6"
    };
    return `${stepMap[modalStep]}/${totalSteps}`;
  };

  const isFinalStep = (formData.role === "admin" && modalStep === "details") || modalStep === "preferences";
  const isAnyLoading = creating || editing || statusUpdating || deletingRecord || docDeleting || !!docUploading;

  return (
    <GlassCard>
      <div className="mb-6">
        <SectionTitle
          title="User Management"
          subtitle="Manage gym members, trainers, and employees"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
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

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-sm dark:shadow-none"
            />
          </div>
        </div>

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

      <UserListView
        viewType={viewType}
        users={allUsers}
        usersLoading={usersLoading}
        statusUpdating={!!loadingStatusId}
        deletingRecord={!!loadingDeleteId}
        loadingStatusId={loadingStatusId}
        loadingDeleteId={loadingDeleteId}
        page={page}
        hasMore={hasMore}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={(id) => { setDeleteTarget(id); setDeleteModalOpen(true); }}
        onToggleStatus={handleToggleStatus}
        onOpenDocs={(user) => { setSelectedUserForDocs(user); setDocModalOpen(true); }}
        onOpenAttendance={(user) => { setSelectedUserForAttendance(user); setAttendanceModalOpen(true); }}
        lastUserElementRef={lastUserElementRef}
      />

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        modalStep={modalStep}
        setModalStep={setModalStep}
        editingUserId={editingUserId}
        onSave={handleSaveUser}
        onNext={handleNextStep}
        onBack={handleBackStep}
        roles={roles}
        plans={plans}
        trainers={trainers}
        isAnyLoading={isAnyLoading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        getModalTitle={getModalTitle}
        getStepNumber={getStepNumber}
        isFinalStep={isFinalStep}
      />

      <DocumentModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        selectedUser={selectedUserForDocs}
        docUploading={docUploading}
        setDocUploading={setDocUploading}
        onDeleteDoc={handleDocDelete}
      />

      <AttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        selectedUser={selectedUserForAttendance}
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteTarget && handleDeleteUser(deleteTarget)}
      />
    </GlassCard>
  );
}
