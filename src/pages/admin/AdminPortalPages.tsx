import { useEffect, useMemo, useState } from "react";
import { useGymStore } from "../../store/gymStore";
import { expiringUsers, payments } from "../../data/mockData";
import {
  EmptyState,
  GlassCard,
  GlowButton,
  Modal,
  SectionTitle,
  Skeleton,
  StatusBadge,
  Table,
} from "../../components/ui/primitives";
import { Edit2, Search, Trash2 } from "lucide-react";
import AdminDashboard from "../AdminDashboard";
import { UserManagement } from "../../components/admin/UserManagement";
import { AttendanceManagement } from "../../components/admin/AttendanceManagement";
import { adminSubscriptionService, type PlanResponse } from "../../services/adminSubscriptionService";
import { toast } from "../../store/toastStore";

export function AdminPortalPages({ page }: { page: string }) {
  const {
    offers,
    appConfig,
    publicPageConfig,
    designThemes,
    currentDesignTheme,
    addOffer,
    updateOffer,
    deleteOffer,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateAppConfig,
    updatePublicPageConfig,
    setDesignTheme,
  } = useGymStore();

  const [plans, setPlans] = useState<PlanResponse[]>([]);
  const [plansMeta, setPlansMeta] = useState({
    page_no: 1,
    total_count: 0,
    page_size: 10,
    has_next: false,
    has_previous: false
  });
  const [planSearch, setPlanSearch] = useState("");
  const [plansLoading, setPlansLoading] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<
    "All" | "Paid" | "Pending"
  >("All");
  const [paymentUser, setPaymentUser] = useState("All");
  const [paymentDate, setPaymentDate] = useState("");
  const [editPlan, setEditPlan] = useState<string | null>(null);
  const [editOffer, setEditOffer] = useState<number | null>(null);

  // Settings page state
  const [settingsTab, setSettingsTab] = useState<"app" | "pages" | "design">(
    "app",
  );
  const [configForm, setConfigForm] = useState({
    name: appConfig.name,
    logo: appConfig.logo,
    description: appConfig.description,
    contactEmail: appConfig.contactEmail,
    contactPhone: appConfig.contactPhone,
    contactAddress: appConfig.contactAddress,
    locations: appConfig.locations || [],
    timezone: appConfig.timezone || "UTC+0",
    currency: appConfig.currency || "USD",
    language: appConfig.language || "English",
    facebook: appConfig.socialLinks.facebook,
    instagram: appConfig.socialLinks.instagram,
    twitter: appConfig.socialLinks.twitter,
  });
  const [publicConfigForm, setPublicConfigForm] = useState(publicPageConfig);

  // Modal states
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: any;
  } | null>(null);

  // Form states
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    price: "",
    duration_in_months: "1",
  });
  const [offerForm, setOfferForm] = useState({
    name: "",
    description: "",
    validFrom: "",
    validTo: "",
  });
  const [offerSearch, setOfferSearch] = useState("");

  // Product states
  const [productSearch, setProductSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Supplements",
    price: "",
    stock: "",
    image: "",
    description: ""
  });

  // Plan Fetching
  const fetchPlans = async (p = plansMeta.page_no, search = planSearch) => {
    setPlansLoading(true);
    try {
      const res = await adminSubscriptionService.getPlans({ page: p, search });
      if (res && res.data) {
        setPlans(res.data);
        setPlansMeta({
          page_no: res.page_no,
          total_count: res.total_count,
          page_size: res.page_size,
          has_next: res.has_next,
          has_previous: res.has_previous
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    if (page === "subscriptions") {
      fetchPlans(1);
    }
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === "subscriptions") fetchPlans(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [planSearch]);

  // Sync config form with store changes
  useEffect(() => {
    setConfigForm({
      name: appConfig.name,
      logo: appConfig.logo,
      description: appConfig.description,
      contactEmail: appConfig.contactEmail,
      contactPhone: appConfig.contactPhone,
      contactAddress: appConfig.contactAddress,
      locations: appConfig.locations || [],
      timezone: appConfig.timezone || "UTC+0",
      currency: appConfig.currency || "USD",
      language: appConfig.language || "English",
      facebook: appConfig.socialLinks.facebook,
      instagram: appConfig.socialLinks.instagram,
      twitter: appConfig.socialLinks.twitter,
    });
  }, [appConfig]);

  const filteredRows = useMemo(
    () =>
      payments
        .filter((p) =>
          paymentStatus === "All" ? true : p.status === paymentStatus,
        )
        .filter((p) => (paymentUser === "All" ? true : p.user === paymentUser))
        .filter((p) => (paymentDate ? p.date === paymentDate : true))
        .map((p) => [
          p.id,
          p.user,
          p.date,
          p.amount,
          <StatusBadge key={p.id} status={p.status as "Paid" | "Pending"} />,
        ]),
    [paymentDate, paymentStatus, paymentUser],
  );

  if (page === "dashboard") return <AdminDashboard />;

  if (page === "users") return <UserManagement />;

  if (page === "attendance") return <AttendanceManagement />;

  if (page === "subscriptions") {
    const lastPage = Math.ceil(plansMeta.total_count / plansMeta.page_size) || 1;

    return (
      <GlassCard>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <SectionTitle
            title="Subscription Management"
            subtitle="Manage gym membership plans and pricing strategies."
          />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search plans..."
                value={planSearch}
                onChange={(e) => setPlanSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-indigo-500 transition"
              />
            </div>
            <GlowButton
              onClick={() => {
                setPlanForm({ name: "", description: "", price: "", duration_in_months: "1" });
                setEditPlan(null);
                setPlanModalOpen(true);
              }}
            >
              Create Plan
            </GlowButton>
          </div>
        </div>

        {plansLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : plans.length > 0 ? (
          <>
            <Table
              headers={["Plan Details", "Pricing", "Duration", "Description", "Actions"]}
              rows={plans.map((p) => [
                <span className="font-bold text-white uppercase tracking-tight" key={p.id}>{p.name}</span>,
                <span className="text-emerald-400 font-black" key={`${p.id}-price`}>${p.price}</span>,
                <span className="text-indigo-300 font-bold" key={`${p.id}-dur`}>{p.duration_in_months} Months</span>,
                <span className="text-slate-400 text-xs truncate max-w-xs block" key={`${p.id}-desc`}>{p.description}</span>,
                <div key={`${p.id}-actions`} className="flex gap-4">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-125"
                    onClick={() => {
                      setPlanForm({
                        name: p.name,
                        description: p.description,
                        price: p.price.toString(),
                        duration_in_months: p.duration_in_months.toString(),
                      });
                      setEditPlan(p.id);
                      setPlanModalOpen(true);
                    }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 transition-transform hover:scale-125"
                    onClick={() => {
                      setDeleteTarget({ type: "plan", id: p.id });
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>,
              ])}
            />

            {lastPage > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  disabled={!plansMeta.has_previous}
                  onClick={() => fetchPlans(plansMeta.page_no - 1)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                >
                  Prev
                </button>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Page {plansMeta.page_no} of {lastPage}
                </span>
                <button
                  disabled={!plansMeta.has_next}
                  onClick={() => fetchPlans(plansMeta.page_no + 1)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Protocol Vacuum"
            hint={planSearch ? `No membership strategies found for "${planSearch}"` : "Initialize your first membership tier to start recruiting."}
          />
        )}

        {/* Plan Modal */}
        <Modal
          open={planModalOpen}
          onClose={() => setPlanModalOpen(false)}
          title={editPlan ? "Edit Strategy" : "Define Strategy"}
          footer={
            <>
              <GlowButton
                className="bg-gray-600"
                onClick={() => setPlanModalOpen(false)}
              >
                Abort
              </GlowButton>
              <GlowButton
                onClick={async () => {
                  const payload = {
                    name: planForm.name,
                    description: planForm.description,
                    price: Number(planForm.price),
                    duration_in_months: Number(planForm.duration_in_months),
                  };

                  if (editPlan) {
                    await adminSubscriptionService.updatePlan(editPlan, payload);
                  } else {
                    await adminSubscriptionService.createPlan(payload);
                  }
                  fetchPlans(1);
                  setPlanModalOpen(false);
                }}
              >
                Execute
              </GlowButton>
            </>
          }
        >
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Designation</label>
              <input
                className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
                placeholder="e.g. Hyper-Performance"
                value={planForm.name}
                onChange={(e) =>
                  setPlanForm({ ...planForm, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategic Valuation ($)</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
                  placeholder="0"
                  type="number"
                  value={planForm.price}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration (Months)</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
                  placeholder="1"
                  type="number"
                  value={planForm.duration_in_months}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, duration_in_months: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Description</label>
              <textarea
                className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition resize-none h-32 font-medium"
                placeholder="Detail the inclusions of this tier..."
                value={planForm.description}
                onChange={(e) =>
                  setPlanForm({ ...planForm, description: e.target.value })
                }
              />
            </div>
          </div>
        </Modal>

        {/* Delete Modal for Plans */}
        <Modal
          open={deleteModalOpen && deleteTarget?.type === "plan"}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Strategic Deletion"
          footer={
            <>
              <GlowButton
                className="bg-gray-600"
                onClick={() => setDeleteModalOpen(false)}
              >
                Abort
              </GlowButton>
              <GlowButton
                onClick={async () => {
                  if (deleteTarget && deleteTarget.type === "plan") {
                    await adminSubscriptionService.deletePlan(deleteTarget.id);
                    fetchPlans(plansMeta.page_no);
                  }
                  setDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
              >
                Confirm Delete
              </GlowButton>
            </>
          }
        >
          <div className="text-sm text-slate-300 text-center py-4">
            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <p className="font-bold text-white mb-2">Are you sure you want to delete this plan?</p>
            <p className="text-xs">This action will permanently terminate this membership strategy from the system.</p>
          </div>
        </Modal>
      </GlassCard>
    );
  }

  if (page === "offers") {
    const filteredOffers = offers.filter(o =>
      (o.name || o.code)?.toLowerCase().includes(offerSearch.toLowerCase()) ||
      o.description?.toLowerCase().includes(offerSearch.toLowerCase())
    );

    return (
      <GlassCard>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <SectionTitle title="Offers Management" subtitle="Manage promo codes and seasonal discounts." />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search offers..."
                value={offerSearch}
                onChange={(e) => setOfferSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <GlowButton
              onClick={() => {
                setOfferForm({ name: "", description: "", validFrom: "", validTo: "" });
                setEditOffer(null);
                setOfferModalOpen(true);
              }}
            >
              Create Offer
            </GlowButton>
          </div>
        </div>

        <Table
          headers={["Offer Name", "Description", "Valid From", "Valid To", "Action"]}
          rows={filteredOffers.map((o) => [
            <span className="font-bold text-white" key={o.id}>{o.name || o.code}</span>,
            <span className="text-slate-400 max-w-xs truncate block" key={`${o.id}-desc`}>{o.description}</span>,
            o.validFrom || o.validity,
            o.validTo || "-",
            <div key={`${o.id}-actions`} className="flex gap-4 justify-center">
              <button
                className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-125"
                onClick={() => {
                  setOfferForm({
                    name: o.name || o.code,
                    description: o.description || "",
                    validFrom: o.validFrom || o.validity,
                    validTo: o.validTo || "",
                  });
                  setEditOffer(o.id);
                  setOfferModalOpen(true);
                }}
              >
                <Edit2 size={18} />
              </button>
              <button
                className="text-red-400 hover:text-red-300 transition-transform hover:scale-125"
                onClick={() => {
                  setDeleteTarget({ type: "offer", id: o.id });
                  setDeleteModalOpen(true);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>,
          ])}
        />

        {/* Offer Modal */}
        <Modal
          open={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
          title={editOffer ? "Edit Offer" : "Create Offer"}
          footer={
            <>
              <GlowButton
                className="bg-gray-600"
                onClick={() => setOfferModalOpen(false)}
              >
                Cancel
              </GlowButton>
              <GlowButton
                onClick={() => {
                  if (editOffer) {
                    updateOffer(editOffer, {
                      name: offerForm.name,
                      description: offerForm.description,
                      validFrom: offerForm.validFrom,
                      validTo: offerForm.validTo,
                    });
                  } else {
                    addOffer({
                      name: offerForm.name,
                      description: offerForm.description,
                      validFrom: offerForm.validFrom,
                      validTo: offerForm.validTo,
                    });
                  }
                  setOfferModalOpen(false);
                }}
              >
                Apply
              </GlowButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Offer Name</label>
              <input
                className="w-full rounded-lg bg-white/10 border border-white/10 p-2 text-white focus:border-indigo-500 outline-none"
                placeholder="e.g. Summer 50"
                value={offerForm.name}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Description</label>
              <textarea
                className="w-full rounded-lg bg-white/10 border border-white/10 p-2 text-white focus:border-indigo-500 outline-none resize-none"
                placeholder="Describe the offer details..."
                rows={3}
                value={offerForm.description}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Valid From</label>
                <input
                  className="w-full rounded-lg bg-white/10 border border-white/10 p-2 text-white focus:border-indigo-500 outline-none"
                  type="date"
                  value={offerForm.validFrom}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, validFrom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Valid To</label>
                <input
                  className="w-full rounded-lg bg-white/10 border border-white/10 p-2 text-white focus:border-indigo-500 outline-none"
                  type="date"
                  value={offerForm.validTo}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, validTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </Modal>

        {/* Delete Modal for Offers */}
        <Modal
          open={deleteModalOpen && deleteTarget?.type === "offer"}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
          footer={
            <>
              <GlowButton
                className="bg-gray-600"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </GlowButton>
              <GlowButton
                onClick={() => {
                  if (deleteTarget && deleteTarget.type === "offer")
                    deleteOffer(deleteTarget.id);
                  setDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
              >
                Apply
              </GlowButton>
            </>
          }
        >
          <div className="text-sm text-slate-300">
            <p>
              Are you sure you want to delete this offer? This action cannot be
              undone.
            </p>
          </div>
        </Modal>
      </GlassCard>
    );
  }

  if (page === "products") {
    const filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );

    return (
      <GlassCard>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <SectionTitle
            title="Inventory Management"
            subtitle="Manage gym merchandise, supplements, and equipment stock."
          />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-indigo-500 transition"
              />
            </div>
            <GlowButton
              onClick={() => {
                setProductForm({ name: "", category: "Supplements", price: "", stock: "", image: "", description: "" });
                setEditProduct(null);
                setProductModalOpen(true);
              }}
            >
              Add Product
            </GlowButton>
          </div>
        </div>

        <Table
          headers={["Product Info", "Category", "Price", "Stock", "Actions"]}
          rows={filteredProducts.map((p) => [
            <div key={p.id} className="flex items-center gap-3 text-left">
              <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-white/10" />
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-tight uppercase text-xs">{p.name}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{p.description}</span>
              </div>
            </div>,
            <span key={`${p.id}-cat`} className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.category}</span>,
            <span key={`${p.id}-price`} className="text-emerald-400 font-bold">${p.price}</span>,
            <div key={`${p.id}-stock`} className="flex flex-col items-center gap-1">
              <span className={`text-xs font-bold ${p.stock < 10 ? 'text-red-400' : 'text-indigo-300'}`}>{p.stock}</span>
              {p.stock < 10 && <span className="text-[8px] font-black uppercase text-red-500/80 animate-pulse">Low Stock</span>}
            </div>,
            <div key={`${p.id}-actions`} className="flex gap-4">
              <button
                className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-125"
                onClick={() => {
                  setProductForm({
                    name: p.name,
                    category: p.category,
                    price: p.price.toString(),
                    stock: p.stock.toString(),
                    image: p.image,
                    description: p.description
                  });
                  setEditProduct(p.id);
                  setProductModalOpen(true);
                }}
              >
                <Edit2 size={18} />
              </button>
              <button
                className="text-red-400 hover:text-red-300 transition-transform hover:scale-125"
                onClick={() => {
                  setDeleteTarget({ type: "product", id: p.id });
                  setDeleteModalOpen(true);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>,
          ])}
        />

        {/* Product Modal */}
        <Modal
          open={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          title={editProduct ? "Modify Inventory" : "Register Product"}
          footer={
            <>
              <GlowButton className="bg-gray-600" onClick={() => setProductModalOpen(false)}>Abort</GlowButton>
              <GlowButton
                onClick={() => {
                  const payload = {
                    name: productForm.name,
                    category: productForm.category,
                    price: Number(productForm.price),
                    stock: Number(productForm.stock),
                    image: productForm.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=400",
                    description: productForm.description
                  };
                  if (editProduct) updateProduct(editProduct, payload);
                  else addProduct(payload);
                  setProductModalOpen(false);
                }}
              >
                Sync Inventory
              </GlowButton>
            </>
          }
        >
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product Designation</label>
              <input
                className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Classification</label>
                <select
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                >
                  <option>Supplements</option>
                  <option>Apparel</option>
                  <option>Equipment</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price ($)</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
                  type="number"
                  placeholder="0.00"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stock Level</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold"
                  type="number"
                  placeholder="0"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Image URL</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition font-bold text-xs"
                  placeholder="https://..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detailed Specifications</label>
              <textarea
                className="w-full rounded-xl bg-slate-950 border border-white/10 p-4 text-white focus:border-indigo-500 outline-none transition resize-none h-24 font-medium"
                placeholder="Describe product details..."
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </div>
          </div>
        </Modal>

        {/* Delete Modal for Products */}
        <Modal
          open={deleteModalOpen && deleteTarget?.type === "product"}
          onClose={() => setDeleteModalOpen(false)}
          title="Archive Protocol"
          footer={
            <>
              <GlowButton className="bg-gray-600" onClick={() => setDeleteModalOpen(false)}>Abort</GlowButton>
              <GlowButton
                onClick={() => {
                  if (deleteTarget && deleteTarget.type === "product") deleteProduct(deleteTarget.id);
                  setDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
              >
                Confirm Termination
              </GlowButton>
            </>
          }
        >
          <div className="text-sm text-slate-300 text-center py-4">
            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <p className="font-bold text-white mb-2">Terminate Product Listing?</p>
            <p className="text-xs">This will permanently remove the item from the active inventory catalog.</p>
          </div>
        </Modal>
      </GlassCard>
    );
  }

  if (page === "payments") {
    return (
      <GlassCard>
        <SectionTitle
          title="Payments"
          subtitle="Transaction history with date, status, and user filters."
        />
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            className="rounded bg-white/10 p-2"
            value={paymentStatus}
            onChange={(e) =>
              setPaymentStatus(e.target.value as "All" | "Paid" | "Pending")
            }
          >
            <option>All</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
          <select
            className="rounded bg-white/10 p-2"
            value={paymentUser}
            onChange={(e) => setPaymentUser(e.target.value)}
          >
            <option>All</option>
            {[...new Set(payments.map((p) => p.user))].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <input
            className="rounded bg-white/10 p-2"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>
        {filteredRows.length ? (
          <Table
            headers={["Transaction", "User", "Date", "Amount", "Status"]}
            rows={filteredRows}
          />
        ) : (
          <EmptyState
            title="No transactions found"
            hint="Try changing filters."
          />
        )}
      </GlassCard>
    );
  }

  if (page === "settings") {
    return (
      <GlassCard>
        <SectionTitle
          title="Settings"
          subtitle="Configure your app, public pages, and design themes."
        />

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-white/10 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-8 min-w-max pb-px">
            {[
              { id: "app", label: "App Config", icon: "⚙️" },
              { id: "pages", label: "Public Pages", icon: "📄" },
              { id: "design", label: "Design Themes", icon: "🎨" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSettingsTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-medium transition-colors ${settingsTab === tab.id
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-white"
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* App Config Tab */}
          {settingsTab === "app" && (
            <>
              {/* App Branding */}
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  App Branding
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      App Name
                    </label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={configForm.name}
                      onChange={(e) =>
                        setConfigForm({ ...configForm, name: e.target.value })
                      }
                      placeholder="Enter app name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Logo URL
                    </label>
                    <div className="space-y-2">
                      <input
                        className="w-full rounded bg-white/10 p-2 text-white"
                        value={configForm.logo}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, logo: e.target.value })
                        }
                        placeholder="Enter logo URL or path"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="flex-1 text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-cyan-600 file:px-2 file:py-1 file:text-white file:hover:bg-cyan-700"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setConfigForm({
                                  ...configForm,
                                  logo: e.target?.result as string,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="text-xs text-slate-400">
                          or choose file
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded bg-white/10 p-2 text-white"
                    rows={3}
                    value={configForm.description}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter app description"
                  />
                </div>
              </div>

              {/* Branding */}
              <div className="rounded-lg bg-white/5 p-4 space-y-4">
                <h4 className="text-lg font-semibold text-white">App Branding</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      App Name
                    </label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                      value={configForm.name}
                      onChange={(e) =>
                        setConfigForm({ ...configForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Logo URL
                    </label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                      value={configForm.logo}
                      onChange={(e) =>
                        setConfigForm({ ...configForm, logo: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                    rows={3}
                    value={configForm.description}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Regional Settings */}
              <div className="rounded-lg bg-white/5 p-4 space-y-4">
                <h4 className="text-lg font-semibold text-white">Regional Settings</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
                    <select
                      className="w-full rounded bg-slate-800 p-2 text-white border border-white/10"
                      value={configForm.timezone}
                      onChange={(e) => setConfigForm({ ...configForm, timezone: e.target.value })}
                    >
                      <option>UTC+0</option>
                      <option>UTC+1</option>
                      <option>UTC-5</option>
                      <option>UTC+5:30</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
                    <select
                      className="w-full rounded bg-slate-800 p-2 text-white border border-white/10"
                      value={configForm.currency}
                      onChange={(e) => setConfigForm({ ...configForm, currency: e.target.value })}
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                    <select
                      className="w-full rounded bg-slate-800 p-2 text-white border border-white/10"
                      value={configForm.language}
                      onChange={(e) => setConfigForm({ ...configForm, language: e.target.value })}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Locations Management */}
              <div className="rounded-lg bg-white/5 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Locations Management</h4>
                  <GlowButton
                    className="px-3 py-1 text-xs"
                    onClick={() => setConfigForm({
                      ...configForm,
                      locations: [...configForm.locations, { id: Date.now().toString(), name: "New Branch", address: "", phone: "" }]
                    })}
                  >
                    + Add Location
                  </GlowButton>
                </div>
                <div className="space-y-4">
                  {configForm.locations.map((loc, idx) => (
                    <div key={loc.id} className="p-3 border border-white/5 rounded-xl bg-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          className="bg-transparent border-none text-white font-bold focus:ring-0 w-full"
                          value={loc.name}
                          onChange={(e) => {
                            const newLocs = [...configForm.locations];
                            newLocs[idx].name = e.target.value;
                            setConfigForm({ ...configForm, locations: newLocs });
                          }}
                        />
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            const newLocs = configForm.locations.filter((_, i) => i !== idx);
                            setConfigForm({ ...configForm, locations: newLocs });
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          placeholder="Address"
                          className="w-full rounded bg-white/5 p-2 text-sm text-white"
                          value={loc.address}
                          onChange={(e) => {
                            const newLocs = [...configForm.locations];
                            newLocs[idx].address = e.target.value;
                            setConfigForm({ ...configForm, locations: newLocs });
                          }}
                        />
                        <input
                          placeholder="Phone"
                          className="w-full rounded bg-white/5 p-2 text-sm text-white"
                          value={loc.phone}
                          onChange={(e) => {
                            const newLocs = [...configForm.locations];
                            newLocs[idx].phone = e.target.value;
                            setConfigForm({ ...configForm, locations: newLocs });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links & Contact */}
              <div className="rounded-lg bg-white/5 p-4 space-y-4">
                <h4 className="text-lg font-semibold text-white">Contact & Social</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                      value={configForm.contactEmail}
                      onChange={(e) => setConfigForm({ ...configForm, contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                      value={configForm.contactPhone}
                      onChange={(e) => setConfigForm({ ...configForm, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Facebook</label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                      value={configForm.facebook}
                      onChange={(e) => setConfigForm({ ...configForm, facebook: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Instagram</label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                      value={configForm.instagram}
                      onChange={(e) => setConfigForm({ ...configForm, instagram: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Twitter</label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
                      value={configForm.twitter}
                      onChange={(e) => setConfigForm({ ...configForm, twitter: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <GlowButton
                  onClick={() => {
                    updateAppConfig({
                      name: configForm.name,
                      logo: configForm.logo,
                      description: configForm.description,
                      contactEmail: configForm.contactEmail,
                      contactPhone: configForm.contactPhone,
                      contactAddress: configForm.contactAddress,
                      locations: configForm.locations,
                      timezone: configForm.timezone,
                      currency: configForm.currency,
                      language: configForm.language,
                      socialLinks: {
                        facebook: configForm.facebook,
                        instagram: configForm.instagram,
                        twitter: configForm.twitter,
                      },
                    });
                    toast.success("Global configuration synchronized!");
                  }}
                >
                  Save Global Settings
                </GlowButton>
              </div>
            </>
          )}

          {/* Public Pages Config Tab */}
          {settingsTab === "pages" && (
            <div className="space-y-8">
              {/* --- HOME SECTION --- */}
              <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-6">
                <SectionTitle title="Home / Hero Section" subtitle="The first thing visitors see on your portal" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Title</label>
                      <input className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={publicConfigForm.home.heroTitle} onChange={(e) => setPublicConfigForm({ ...publicConfigForm, home: { ...publicConfigForm.home, heroTitle: e.target.value } })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtitle</label>
                      <textarea rows={3} className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={publicConfigForm.home.heroSubtitle} onChange={(e) => setPublicConfigForm({ ...publicConfigForm, home: { ...publicConfigForm.home, heroSubtitle: e.target.value } })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hero Image URL</label>
                    <div className="space-y-2">
                      <input className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={publicConfigForm.home.heroImage} onChange={(e) => setPublicConfigForm({ ...publicConfigForm, home: { ...publicConfigForm.home, heroImage: e.target.value } })} />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="flex-1 text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-white file:hover:bg-indigo-700"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setPublicConfigForm({
                                  ...publicConfigForm,
                                  home: {
                                    ...publicConfigForm.home,
                                    heroImage: e.target?.result as string,
                                  },
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="text-xs text-slate-400">or upload file</span>
                      </div>
                    </div>
                    <div className="aspect-video mt-3 rounded-xl bg-slate-900 overflow-hidden border border-white/5 relative group">
                      <img src={publicConfigForm.home.heroImage} alt="Hero Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-tighter">Live Preview</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Home Features Array */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-black text-indigo-400 uppercase tracking-wider">Floating Features</h5>
                    <GlowButton className="px-3 py-1 text-[10px]" onClick={() => setPublicConfigForm({ ...publicConfigForm, home: { ...publicConfigForm.home, features: [...publicConfigForm.home.features, { title: "New Feature", description: "", image: "" }] } })}>
                      + Add Feature
                    </GlowButton>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {publicConfigForm.home.features.map((feat, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input className="bg-transparent border-none text-white font-bold text-xs focus:ring-0 w-full" value={feat.title} onChange={(e) => {
                            const newFeats = [...publicConfigForm.home.features];
                            newFeats[idx].title = e.target.value;
                            setPublicConfigForm({ ...publicConfigForm, home: { ...publicConfigForm.home, features: newFeats } });
                          }} />
                          <button className="text-red-400/50 hover:text-red-400 shrink-0" onClick={() => {
                            const newFeats = publicConfigForm.home.features.filter((_, i) => i !== idx);
                            setPublicConfigForm({ ...publicConfigForm, home: { ...publicConfigForm.home, features: newFeats } });
                          }}><Trash2 size={14} /></button>
                        </div>
                        <textarea className="w-full rounded-lg bg-black/20 p-2 text-[10px] text-slate-300 border-none" rows={2} placeholder="Feature description..." value={feat.description} onChange={(e) => {
                          const newFeats = [...publicConfigForm.home.features];
                          newFeats[idx].description = e.target.value;
                          setPublicConfigForm({ ...publicConfigForm, home: { ...publicConfigForm.home, features: newFeats } });
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- ABOUT SECTION --- */}
              <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-6">
                <SectionTitle title="About Section" subtitle="Share your gym's story and achievements" />
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Heading</label>
                      <input className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={publicConfigForm.about.title} onChange={(e) => setPublicConfigForm({ ...publicConfigForm, about: { ...publicConfigForm.about, title: e.target.value } })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Narrative</label>
                      <textarea rows={5} className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={publicConfigForm.about.description} onChange={(e) => setPublicConfigForm({ ...publicConfigForm, about: { ...publicConfigForm.about, description: e.target.value } })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">About Image</label>
                      <div className="space-y-2">
                        <input className="w-full rounded-xl bg-white/10 p-2 text-xs text-white border border-white/5" value={publicConfigForm.about.image} onChange={(e) => setPublicConfigForm({ ...publicConfigForm, about: { ...publicConfigForm.about, image: e.target.value } })} />
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="flex-1 text-[10px] text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-white"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  setPublicConfigForm({
                                    ...publicConfigForm,
                                    about: {
                                      ...publicConfigForm.about,
                                      image: e.target?.result as string,
                                    },
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Metric Counters (Stats)</h5>
                      <button className="text-indigo-400 hover:text-indigo-300 text-[10px] font-black uppercase" onClick={() => setPublicConfigForm({ ...publicConfigForm, about: { ...publicConfigForm.about, stats: [...publicConfigForm.about.stats, { label: "Stat", value: "0" }] } })}>+ Add Stat</button>
                    </div>
                    <div className="space-y-2">
                      {publicConfigForm.about.stats.map((stat, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input className="flex-1 rounded-lg bg-white/5 border border-white/5 p-2 text-xs text-white" value={stat.label} onChange={(e) => {
                            const newStats = [...publicConfigForm.about.stats];
                            newStats[idx].label = e.target.value;
                            setPublicConfigForm({ ...publicConfigForm, about: { ...publicConfigForm.about, stats: newStats } });
                          }} />
                          <input className="w-24 rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2 text-xs text-indigo-400 font-bold" value={stat.value} onChange={(e) => {
                            const newStats = [...publicConfigForm.about.stats];
                            newStats[idx].value = e.target.value;
                            setPublicConfigForm({ ...publicConfigForm, about: { ...publicConfigForm.about, stats: newStats } });
                          }} />
                          <button className="text-red-400/50" onClick={() => {
                            const newStats = publicConfigForm.about.stats.filter((_, i) => i !== idx);
                            setPublicConfigForm({ ...publicConfigForm, about: { ...publicConfigForm.about, stats: newStats } });
                          }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SERVICES SECTION --- */}
              <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <SectionTitle title="Services Offering" subtitle="Highlight your specialized fitness modules" />
                  <GlowButton className="px-4 py-2 text-xs" onClick={() => setPublicConfigForm({ ...publicConfigForm, services: { ...publicConfigForm.services, services: [...publicConfigForm.services.services, { name: "New Service", description: "", image: "" }] } })}>
                    + Define New Service
                  </GlowButton>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {publicConfigForm.services.services.map((svc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <input className="bg-transparent border-none text-white font-black uppercase text-sm focus:ring-0 w-full" value={svc.name} onChange={(e) => {
                          const newSvcs = [...publicConfigForm.services.services];
                          newSvcs[idx].name = e.target.value;
                          setPublicConfigForm({ ...publicConfigForm, services: { ...publicConfigForm.services, services: newSvcs } });
                        }} />
                        <button className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                          const newSvcs = publicConfigForm.services.services.filter((_, i) => i !== idx);
                          setPublicConfigForm({ ...publicConfigForm, services: { ...publicConfigForm.services, services: newSvcs } });
                        }}><Trash2 size={16} /></button>
                      </div>
                      <textarea className="w-full rounded-xl bg-black/20 p-3 text-xs text-slate-400 border-none" rows={2} value={svc.description} onChange={(e) => {
                        const newSvcs = [...publicConfigForm.services.services];
                        newSvcs[idx].description = e.target.value;
                        setPublicConfigForm({ ...publicConfigForm, services: { ...publicConfigForm.services, services: newSvcs } });
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* --- TESTIMONIALS & FAQS --- */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Testimonials */}
                <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">Testimonials</h4>
                    <button className="text-cyan-400 text-[10px] font-black uppercase hover:underline" onClick={() => setPublicConfigForm({ ...publicConfigForm, testimonials: { ...publicConfigForm.testimonials, testimonials: [...publicConfigForm.testimonials.testimonials, { name: "User", role: "Member", content: "", avatar: "" }] } })}>+ Add Story</button>
                  </div>
                  <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {publicConfigForm.testimonials.testimonials.map((test, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 group">
                        <div className="flex items-center justify-between">
                          <input className="bg-transparent border-none text-xs font-bold text-white p-0 focus:ring-0" value={test.name} onChange={(e) => {
                            const newT = [...publicConfigForm.testimonials.testimonials];
                            newT[idx].name = e.target.value;
                            setPublicConfigForm({ ...publicConfigForm, testimonials: { ...publicConfigForm.testimonials, testimonials: newT } });
                          }} />
                          <button className="text-red-400/50 hover:text-red-400" onClick={() => {
                            const newT = publicConfigForm.testimonials.testimonials.filter((_, i) => i !== idx);
                            setPublicConfigForm({ ...publicConfigForm, testimonials: { ...publicConfigForm.testimonials, testimonials: newT } });
                          }}><Trash2 size={12} /></button>
                        </div>
                        <textarea className="w-full bg-transparent border-none text-[10px] text-slate-400 p-0 focus:ring-0 italic" rows={2} value={test.content} onChange={(e) => {
                          const newT = [...publicConfigForm.testimonials.testimonials];
                          newT[idx].content = e.target.value;
                          setPublicConfigForm({ ...publicConfigForm, testimonials: { ...publicConfigForm.testimonials, testimonials: newT } });
                        }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">Global FAQs</h4>
                    <button className="text-cyan-400 text-[10px] font-black uppercase hover:underline" onClick={() => setPublicConfigForm({ ...publicConfigForm, faqs: [...publicConfigForm.faqs, { question: "New Question", answer: "" }] })}>+ Add FAQ</button>
                  </div>
                  <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {publicConfigForm.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                        <input className="w-full bg-transparent border-none text-xs font-black text-indigo-400 p-0 focus:ring-0" value={faq.question} onChange={(e) => {
                          const newF = [...publicConfigForm.faqs];
                          newF[idx].question = e.target.value;
                          setPublicConfigForm({ ...publicConfigForm, faqs: newF });
                        }} />
                        <textarea className="w-full bg-transparent border-none text-[10px] text-slate-400 p-0 focus:ring-0 leading-relaxed" rows={2} value={faq.answer} onChange={(e) => {
                          const newF = [...publicConfigForm.faqs];
                          newF[idx].answer = e.target.value;
                          setPublicConfigForm({ ...publicConfigForm, faqs: newF });
                        }} />
                        <div className="flex justify-end">
                          <button className="text-red-400/30 hover:text-red-400 transition-colors" onClick={() => {
                            const newF = publicConfigForm.faqs.filter((_, i) => i !== idx);
                            setPublicConfigForm({ ...publicConfigForm, faqs: newF });
                          }}><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Global Commit Button */}
              <div className="flex justify-end pt-4">
                <GlowButton className="px-12 py-3" onClick={() => {
                  updatePublicPageConfig(publicConfigForm);
                  toast.success("Public Portal synchronized successfully!");
                }}>
                  Sync Public Database
                </GlowButton>
              </div>
            </div>
          )}

          {/* Design Themes Tab */}
          {settingsTab === "design" && (
            <div className="space-y-6">
              <div className="text-sm text-slate-300">
                Select a design theme to instantly change the appearance of your
                public portal.
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {designThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`rounded-lg border-2 p-4 transition-all cursor-pointer ${currentDesignTheme === theme.id
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    onClick={() => setDesignTheme(theme.id)}
                  >
                    <div className="mb-3 aspect-video rounded bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                      <span className="text-2xl">
                        {theme.name === "Modern & Clean"
                          ? "🎨"
                          : theme.name === "Vibrant & Energetic"
                            ? "⚡"
                            : "🏛️"}
                      </span>
                    </div>
                    <h5 className="font-semibold text-white mb-1">
                      {theme.name}
                    </h5>
                    <p className="text-sm text-slate-300 mb-3">
                      {theme.description}
                    </p>
                    <div className="flex gap-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                    {currentDesignTheme === theme.id && (
                      <div className="text-xs text-cyan-400 font-medium">
                        Currently Active
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  Current Theme Details
                </h4>
                {(() => {
                  const activeTheme = designThemes.find(
                    (t) => t.id === currentDesignTheme,
                  );
                  return activeTheme ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-white mb-2">Colors</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded border border-white/20"
                              style={{
                                backgroundColor: activeTheme.colors.primary,
                              }}
                            />
                            <span className="text-sm text-slate-300">
                              Primary: {activeTheme.colors.primary}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded border border-white/20"
                              style={{
                                backgroundColor: activeTheme.colors.secondary,
                              }}
                            />
                            <span className="text-sm text-slate-300">
                              Secondary: {activeTheme.colors.secondary}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded border border-white/20"
                              style={{
                                backgroundColor: activeTheme.colors.accent,
                              }}
                            />
                            <span className="text-sm text-slate-300">
                              Accent: {activeTheme.colors.accent}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-2">Styles</h5>
                        <div className="space-y-2 text-sm text-slate-300">
                          <div>
                            Button Style: {activeTheme.styles.buttonStyle}
                          </div>
                          <div>Layout: {activeTheme.styles.layout}</div>
                          <div>Typography: {activeTheme.styles.typography}</div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    );
  }

  if (page === "notifications") {
    return (
      <GlassCard>
        <SectionTitle
          title="Notifications"
          subtitle="Expiring subscriptions and reminders."
        />
        {expiringUsers.map((u) => (
          <div
            key={u.name}
            className="mb-2 flex items-center justify-between rounded-lg bg-white/5 p-3"
          >
            <span>
              {u.name} expires in {u.daysLeft} day(s)
            </span>
            <GlowButton className="px-3 py-1 text-xs">
              Trigger Reminder
            </GlowButton>
          </div>
        ))}
      </GlassCard>
    );
  }

  return <EmptyState title="Loading" hint="Select a section to continue." />;
}
