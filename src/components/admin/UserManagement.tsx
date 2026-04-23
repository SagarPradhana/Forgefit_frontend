import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GlassCard, SectionTitle } from "../../components/ui/primitives";
import { Search, Grid, List, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useGet, useMutation } from "../../hooks/useApi";
import { API_ENDPOINTS } from "../../utils/url";
import { toast } from "../../store/toastStore";
import { api } from "../../utils/httputils";

// Sub-components
import { UserModal } from "./users/UserModal";
import { UserListView } from "./users/UserListView";
import { DocumentModal } from "./users/DocumentModal";
import { AttendanceModal } from "./users/AttendanceModal";
import { DeleteUserModal } from "./users/DeleteUserModal";
import { SubscriptionModal } from "./users/SubscriptionModal";
import { PasswordResetModal } from "./users/PasswordResetModal";

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

  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedUserForAttendance, setSelectedUserForAttendance] = useState<any>(null);

  // Subscription Modal State
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedUserForSubscription, setSelectedUserForSubscription] = useState<any>(null);

  // Password Reset Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<any>(null);

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // --- API Fetching ---
  const usersApiUrl = useMemo(() => {
    const currentPage = Number(page) || 1;
    const currentCount = Number(perPage) || 10;
    const params = new URLSearchParams({
      offset: String((currentPage - 1) * currentCount),
      count: String(currentCount),
    });
    if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
    return `${API_ENDPOINTS.ADMIN.USERS}?${params.toString()}`;
  }, [page, perPage, debouncedSearch]);

  const { loading: usersLoading, refetch: refetchUsers } = useGet(
    usersApiUrl,
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
  const roles = useMemo<string[]>(() => {
    if (!rolesData?.data) return ["admin", "trainer", "user"];
    // Extract unique roles from data
    const unique = Array.from(new Set(rolesData.data.map((r: any) => r.role))) as string[];
    return unique.length > 0 ? unique : ["admin", "trainer", "user"];
  }, [rolesData]);

  const { data: plansData } = useGet(API_ENDPOINTS.ADMIN.PLANS);
  const plans = plansData?.data || [];

  const { data: trainersData } = useGet(API_ENDPOINTS.ADMIN.TRAINER_LIST);
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
    username: "",
    mobile: "",
    name: "",
    email: "",
    address: "",
    role: "user",
    joining_date: Math.floor(Date.now() / 1000),
    metadata: {
      height: 0,
      weight: 0,
      dob: Math.floor(Date.now() / 1000),
      gender: "male",
      language: "en",
      theme: "dark",
      fitness_goal: "fitness",
      medical_conditions: "",
      injuries: "",
      allergies: "",
      workout_time: "morning",
      emergency_contact: "",
    },
    trainer_id: "",
    subscription_id: "",
    duration_in_months: 1,
    amount: 0,
    profilePhoto: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync selected user when data refreshes
  useEffect(() => {
    if (selectedUserForDocs) {
      const updatedUser = allUsers.find((u) => u.id === selectedUserForDocs.id);
      if (updatedUser) setSelectedUserForDocs(updatedUser);
    }
  }, [allUsers, selectedUserForDocs?.id]);

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
      username: "",
      mobile: "",
      name: "",
      email: "",
      address: "",
      role: "user",
      joining_date: Math.floor(Date.now() / 1000),
      metadata: {
        height: 0,
        weight: 0,
        dob: Math.floor(Date.now() / 1000),
        gender: "male",
        language: "en",
        theme: "dark",
        fitness_goal: "fitness",
        medical_conditions: "",
        injuries: "",
        allergies: "",
        workout_time: "morning",
        emergency_contact: "",
      },
      trainer_id: "",
      subscription_id: "",
      duration_in_months: 1,
      amount: 0,
      profilePhoto: ""
    });
    setPhotoPreview("");
    setEditingUserId(null);
    setModalStep("role");
    setModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setFormData({
      username: user.username || "",
      mobile: user.mobile || user.phone || "",
      name: user.name,
      email: user.email,
      address: user.address || "",
      role: user.role || "user",
      joining_date: user.joining_date || Math.floor(Date.now() / 1000),
      metadata: {
        height: user.metadata?.height || 0,
        weight: user.metadata?.weight || 0,
        dob: user.metadata?.dob || Math.floor(Date.now() / 1000),
        gender: user.metadata?.gender || "male",
        language: user.metadata?.language || "en",
        theme: user.metadata?.theme || "dark",
        fitness_goal: user.metadata?.fitness_goal || "fitness",
        medical_conditions: user.metadata?.medical_conditions || "",
        injuries: user.metadata?.injuries || "",
        allergies: user.metadata?.allergies || "",
        workout_time: user.metadata?.workout_time || "morning",
        emergency_contact: user.metadata?.emergency_contact || "",
      },
      trainer_id: user.trainer_id || "",
      subscription_id: user.subscription_id || "",
      duration_in_months: user.duration_in_months || 1,
      amount: user.amount || 0,
      profilePhoto: user.profile_image_path || user.metadata?.profile_image_path || "",
    });
    setPhotoPreview(user.profile_image_path || user.metadata?.profile_image_path || "");
    setEditingUserId(user.id);
    setModalStep("role");
    setModalOpen(true);
    setShowPassword(false);
  };

  const handleNextStep = () => {
    if (modalStep === "role") {
      if (!formData.username || !formData.name || !formData.mobile || !formData.email) {
        toast.error("Please fill in all mandatory account details");
        return;
      }
      setModalStep("details");
      return;
    }
    if (modalStep === "details") {
      if (!formData.address) {
        toast.error("Address is required");
        return;
      }
      setModalStep("metadata");
      return;
    }
    if (modalStep === "metadata") {
      setModalStep("membership");
      return;
    }
  };

  const handleBackStep = () => {
    const steps: ModalStep[] = ["role", "details", "metadata", "membership"];
    const currentIndex = steps.indexOf(modalStep);
    if (currentIndex > 0) setModalStep(steps[currentIndex - 1]);
  };

  const handleSaveUser = () => {
    // API Payload cleanup
    const { profilePhoto, ...rawPayload } = formData;
    
    // Explicitly nullify empty UUID strings to prevent backend parsing errors
    const payload = {
      ...rawPayload,
      trainer_id: rawPayload.trainer_id?.trim() === "" ? null : rawPayload.trainer_id,
      subscription_id: rawPayload.subscription_id?.trim() === "" ? null : rawPayload.subscription_id,
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

  const handleDownloadIDCard = async (user: any) => {
    try {
      const filename = `${user.name.replace(/\s+/g, "_")}_ID_Card.pdf`;
      toast.info(`Generating ID Card for ${user.name}...`);
      await api.download(API_ENDPOINTS.USER.DOWNLOAD_IDCARD(user.id), filename);
      toast.success("ID Card downloaded successfully");
    } catch (error) {
      toast.error("Failed to download ID card");
    }
  };

  const handleDeleteUser = (userId: string) => {
    setLoadingDeleteId(userId);
    deleteUserRecord(API_ENDPOINTS.ADMIN.USER_DELETE(userId));
    setDeleteTarget(null);
  };

  const getModalTitle = () => {
    if (modalStep === "metadata") return "Health & Vitals";
    if (modalStep === "membership") return "Plan Selection";
    if (modalStep === "details") return "Assignment Details";
    return editingUserId ? "Update User Profile" : "Create New User";
  };

  const getStepNumber = () => {
    const stepMap: Record<ModalStep, string> = {
      role: "1", details: "2", metadata: "3", membership: "4"
    };
    return `${stepMap[modalStep]}/4`;
  };

  const isFinalStep = modalStep === "membership";
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
              id="admin-master-user-search-query-field"
              name="admin-master-user-search-query-field"
              type="text"
              autoComplete="new-password"
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
        onOpenSubscription={(user) => { setSelectedUserForSubscription(user); setSubscriptionModalOpen(true); }}
        onResetPassword={(user) => { setSelectedUserForReset(user); setResetModalOpen(true); }}
        onDownloadIDCard={handleDownloadIDCard}
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
        onRefresh={refetchUsers}
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

      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        selectedUser={selectedUserForSubscription}
      />

      <PasswordResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        userId={selectedUserForReset?.id}
        userName={selectedUserForReset?.name}
      />
    </GlassCard>
  );
}
