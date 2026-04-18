import { useEffect, useMemo, useState } from "react";
import { useGymStore } from "../../store/gymStore";
import { expiringUsers, payments, type Status } from "../../data/mockData";
import {
  EmptyState,
  GlassCard,
  GlowButton,
  Modal,
  SectionTitle,
  StatusBadge,
  Table,
} from "../../components/ui/primitives";
import AdminDashboard from "../AdminDashboard";

export function AdminPortalPages({ page }: { page: string }) {
  const {
    users,
    plans,
    offers,
    appConfig,
    publicPageConfig,
    designThemes,
    currentDesignTheme,
    addUser,
    updateUser,
    deleteUser,
    addPlan,
    updatePlan,
    deletePlan,
    addOffer,
    updateOffer,
    deleteOffer,
    featureFlags,
    toggleFlag,
    updateAppConfig,
    updatePublicPageConfig,
    setDesignTheme,
  } = useGymStore();
  const [selectedUser, setSelectedUser] = useState<number | null>(
    users[0]?.id ?? null,
  );
  const [paymentStatus, setPaymentStatus] = useState<
    "All" | "Paid" | "Pending"
  >("All");
  const [paymentUser, setPaymentUser] = useState("All");
  const [paymentDate, setPaymentDate] = useState("");
  const [editUser, setEditUser] = useState<number | null>(null);
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
    facebook: appConfig.socialLinks.facebook,
    instagram: appConfig.socialLinks.instagram,
    twitter: appConfig.socialLinks.twitter,
  });
  const [publicConfigForm, setPublicConfigForm] = useState(publicPageConfig);

  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: any;
  } | null>(null);

  // Form states
  const [userForm, setUserForm] = useState({ name: "", trainer: "", plan: "" });
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
  });
  const [offerForm, setOfferForm] = useState({
    code: "",
    discount: "",
    validity: "",
  });

  // Sync config form with store changes
  useEffect(() => {
    setConfigForm({
      name: appConfig.name,
      logo: appConfig.logo,
      description: appConfig.description,
      contactEmail: appConfig.contactEmail,
      contactPhone: appConfig.contactPhone,
      contactAddress: appConfig.contactAddress,
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

  if (page === "users")
    return (
      <GlassCard>
        <SectionTitle
          title="User Management"
          subtitle="Add, edit, delete users, assign plans and trainers."
        />
        <GlowButton
          className="mb-3"
          onClick={() => {
            setUserForm({ name: "", trainer: "", plan: "" });
            setEditUser(null);
            setUserModalOpen(true);
          }}
        >
          Add User
        </GlowButton>
        <Table
          headers={["Name", "Trainer", "Plan", "Status", "Actions"]}
          rows={users.map((u) => [
            u.name,
            u.trainer,
            u.plan,
            <StatusBadge key={`${u.id}s`} status={u.status as Status} />,
            <div key={u.id} className="flex gap-2">
              <button
                className="text-cyan-300"
                onClick={() => {
                  setUserForm({
                    name: u.name,
                    trainer: u.trainer,
                    plan: u.plan,
                  });
                  setEditUser(u.id);
                  setUserModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-red-300"
                onClick={() => {
                  setDeleteTarget({ type: "user", id: u.id });
                  setDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>,
          ])}
        />
        {selectedUser ? (
          <GlassCard className="mt-4">
            <p className="mb-2 text-sm text-slate-300">Full Profile</p>
            {users
              .filter((u) => u.id === selectedUser)
              .map((u) => (
                <p key={u.id} className="text-sm">
                  {u.name} | {u.email} | {u.phone} | Goal: {u.fitnessGoal} |
                  Trainer: {u.trainer}
                </p>
              ))}
          </GlassCard>
        ) : null}

        {/* User Modal */}
        <Modal
          open={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          title={editUser ? "Edit User" : "Add User"}
          footer={
            <>
              <GlowButton
                className="bg-gray-600"
                onClick={() => setUserModalOpen(false)}
              >
                Cancel
              </GlowButton>
              <GlowButton
                onClick={() => {
                  if (editUser) {
                    updateUser(editUser, {
                      name: userForm.name,
                      trainer: userForm.trainer,
                      plan: userForm.plan,
                    });
                  } else {
                    addUser({
                      name: userForm.name,
                      trainer: userForm.trainer,
                      plan: userForm.plan,
                      email: `${userForm.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
                      phone: "+1 555 900 000",
                      status: "Pending",
                      fitnessGoal: "General fitness",
                      bodyFat: "N/A",
                    });
                  }
                  setUserModalOpen(false);
                }}
              >
                Apply
              </GlowButton>
            </>
          }
        >
          <div className="space-y-4">
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
            />
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Trainer"
              value={userForm.trainer}
              onChange={(e) =>
                setUserForm({ ...userForm, trainer: e.target.value })
              }
            />
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Plan"
              value={userForm.plan}
              onChange={(e) =>
                setUserForm({ ...userForm, plan: e.target.value })
              }
            />
          </div>
        </Modal>

        {/* Delete Modal for Users */}
        <Modal
          open={deleteModalOpen && deleteTarget?.type === "user"}
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
                  if (deleteTarget && deleteTarget.type === "user")
                    deleteUser(deleteTarget.id);
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
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
          </div>
        </Modal>
      </GlassCard>
    );

  if (page === "subscriptions")
    return (
      <GlassCard>
        <SectionTitle
          title="Subscription Management"
          subtitle="CRUD for plans."
        />
        <GlowButton
          className="mb-3"
          onClick={() => {
            setPlanForm({ name: "", price: "", duration: "", features: "" });
            setEditPlan(null);
            setPlanModalOpen(true);
          }}
        >
          Create Plan
        </GlowButton>
        <Table
          headers={["Plan", "Price", "Duration", "Features", "Actions"]}
          rows={plans.map((p) => [
            p.name,
            `$${p.price}`,
            p.duration,
            p.features.join(", "),
            <div key={p.id} className="flex gap-2">
              <button
                className="text-cyan-300"
                onClick={() => {
                  setPlanForm({
                    name: p.name,
                    price: p.price.toString(),
                    duration: p.duration,
                    features: p.features.join(", "),
                  });
                  setEditPlan(p.id);
                  setPlanModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-red-300"
                onClick={() => {
                  setDeleteTarget({ type: "plan", id: p.id });
                  setDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>,
          ])}
        />

        {/* Plan Modal */}
        <Modal
          open={planModalOpen}
          onClose={() => setPlanModalOpen(false)}
          title={editPlan ? "Edit Plan" : "Create Plan"}
          footer={
            <>
              <GlowButton
                className="bg-gray-600"
                onClick={() => setPlanModalOpen(false)}
              >
                Cancel
              </GlowButton>
              <GlowButton
                onClick={() => {
                  const features = planForm.features
                    .split(",")
                    .map((x) => x.trim());
                  if (editPlan) {
                    updatePlan(editPlan, {
                      name: planForm.name,
                      price: Number(planForm.price),
                      duration: planForm.duration,
                      features,
                    });
                  } else {
                    addPlan({
                      name: planForm.name,
                      price: Number(planForm.price),
                      duration: planForm.duration,
                      features,
                    });
                  }
                  setPlanModalOpen(false);
                }}
              >
                Apply
              </GlowButton>
            </>
          }
        >
          <div className="space-y-4">
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Plan name"
              value={planForm.name}
              onChange={(e) =>
                setPlanForm({ ...planForm, name: e.target.value })
              }
            />
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Price"
              type="number"
              value={planForm.price}
              onChange={(e) =>
                setPlanForm({ ...planForm, price: e.target.value })
              }
            />
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Duration"
              value={planForm.duration}
              onChange={(e) =>
                setPlanForm({ ...planForm, duration: e.target.value })
              }
            />
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Feature1, Feature2"
              value={planForm.features}
              onChange={(e) =>
                setPlanForm({ ...planForm, features: e.target.value })
              }
            />
          </div>
        </Modal>

        {/* Delete Modal for Plans */}
        <Modal
          open={deleteModalOpen && deleteTarget?.type === "plan"}
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
                  if (deleteTarget && deleteTarget.type === "plan")
                    deletePlan(deleteTarget.id);
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
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </p>
          </div>
        </Modal>
      </GlassCard>
    );

  if (page === "offers")
    return (
      <GlassCard>
        <SectionTitle title="Offers Management" subtitle="Promo code CRUD." />
        <GlowButton
          className="mb-3"
          onClick={() => {
            setOfferForm({ code: "", discount: "", validity: "" });
            setEditOffer(null);
            setOfferModalOpen(true);
          }}
        >
          Create Offer
        </GlowButton>
        <Table
          headers={["Code", "Discount", "Validity", "Action"]}
          rows={offers.map((o) => [
            o.code,
            o.discount,
            o.validity,
            <div key={o.id} className="flex gap-2">
              <button
                className="text-cyan-300"
                onClick={() => {
                  setOfferForm({
                    code: o.code,
                    discount: o.discount,
                    validity: o.validity,
                  });
                  setEditOffer(o.id);
                  setOfferModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-red-300"
                onClick={() => {
                  setDeleteTarget({ type: "offer", id: o.id });
                  setDeleteModalOpen(true);
                }}
              >
                Delete
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
                      code: offerForm.code,
                      discount: offerForm.discount,
                      validity: offerForm.validity,
                    });
                  } else {
                    addOffer({
                      code: offerForm.code,
                      discount: offerForm.discount,
                      validity: offerForm.validity,
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
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Promo code"
              value={offerForm.code}
              onChange={(e) =>
                setOfferForm({ ...offerForm, code: e.target.value })
              }
            />
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="Discount %"
              value={offerForm.discount}
              onChange={(e) =>
                setOfferForm({ ...offerForm, discount: e.target.value })
              }
            />
            <input
              className="w-full rounded bg-white/10 p-2"
              placeholder="YYYY-MM-DD"
              type="date"
              value={offerForm.validity}
              onChange={(e) =>
                setOfferForm({ ...offerForm, validity: e.target.value })
              }
            />
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

  if (page === "payments") {
    return (
      <GlassCard>
        <SectionTitle
          title="Payments"
          subtitle="Transaction history with date, status, and user filters."
        />
        <div className="mb-3 grid gap-3 md:grid-cols-3">
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

  if (page === "features")
    return (
      <GlassCard>
        <SectionTitle
          title="User Configuration"
          subtitle="Feature control toggles per user."
        />
        {users.map((u) => (
          <div key={u.id} className="mb-3 rounded-lg bg-white/5 p-3">
            <p className="mb-2 font-medium">{u.name}</p>
            <div className="grid gap-2 md:grid-cols-3">
              <label className="flex items-center justify-between rounded border border-white/10 p-2 text-sm">
                Show products
                <input
                  type="checkbox"
                  checked={featureFlags[u.id]?.showProducts ?? true}
                  onChange={() => toggleFlag(u.id, "showProducts")}
                />
              </label>
              <label className="flex items-center justify-between rounded border border-white/10 p-2 text-sm">
                Allow upgrade
                <input
                  type="checkbox"
                  checked={featureFlags[u.id]?.allowUpgrade ?? true}
                  onChange={() => toggleFlag(u.id, "allowUpgrade")}
                />
              </label>
              <label className="flex items-center justify-between rounded border border-white/10 p-2 text-sm">
                Show offers
                <input
                  type="checkbox"
                  checked={featureFlags[u.id]?.showOffers ?? true}
                  onChange={() => toggleFlag(u.id, "showOffers")}
                />
              </label>
            </div>
          </div>
        ))}
      </GlassCard>
    );

  if (page === "settings")
    return (
      <GlassCard>
        <SectionTitle
          title="Settings"
          subtitle="Configure your app, public pages, and design themes."
        />

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-white/10">
          <nav className="flex space-x-8">
            {[
              { id: "app", label: "App Config", icon: "⚙️" },
              { id: "pages", label: "Public Pages", icon: "📄" },
              { id: "design", label: "Design Themes", icon: "🎨" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSettingsTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                  settingsTab === tab.id
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
                <div className="grid gap-4 md:grid-cols-2">
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

              {/* Contact Information */}
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  Contact Information
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={configForm.contactEmail}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={configForm.contactPhone}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Address
                  </label>
                  <textarea
                    className="w-full rounded bg-white/10 p-2 text-white"
                    rows={2}
                    value={configForm.contactAddress}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        contactAddress: e.target.value,
                      })
                    }
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  Social Media Links
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={configForm.facebook}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          facebook: e.target.value,
                        })
                      }
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={configForm.instagram}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          instagram: e.target.value,
                        })
                      }
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={configForm.twitter}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          twitter: e.target.value,
                        })
                      }
                      placeholder="https://twitter.com/yourpage"
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
                      socialLinks: {
                        facebook: configForm.facebook,
                        instagram: configForm.instagram,
                        twitter: configForm.twitter,
                      },
                    });
                  }}
                >
                  Save App Settings
                </GlowButton>
              </div>
            </>
          )}

          {/* Public Pages Config Tab */}
          {settingsTab === "pages" && (
            <>
              {/* Home Page */}
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  Home Page
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Hero Title
                    </label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={publicConfigForm.home.heroTitle}
                      onChange={(e) =>
                        setPublicConfigForm({
                          ...publicConfigForm,
                          home: {
                            ...publicConfigForm.home,
                            heroTitle: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Hero Subtitle
                    </label>
                    <textarea
                      className="w-full rounded bg-white/10 p-2 text-white"
                      rows={2}
                      value={publicConfigForm.home.heroSubtitle}
                      onChange={(e) =>
                        setPublicConfigForm({
                          ...publicConfigForm,
                          home: {
                            ...publicConfigForm.home,
                            heroSubtitle: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Hero Image URL
                    </label>
                    <div className="space-y-2">
                      <input
                        className="w-full rounded bg-white/10 p-2 text-white"
                        value={publicConfigForm.home.heroImage}
                        onChange={(e) =>
                          setPublicConfigForm({
                            ...publicConfigForm,
                            home: {
                              ...publicConfigForm.home,
                              heroImage: e.target.value,
                            },
                          })
                        }
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
                        <span className="text-xs text-slate-400">
                          or choose file
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Page */}
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  About Page
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Title
                    </label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={publicConfigForm.about.title}
                      onChange={(e) =>
                        setPublicConfigForm({
                          ...publicConfigForm,
                          about: {
                            ...publicConfigForm.about,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full rounded bg-white/10 p-2 text-white"
                      rows={3}
                      value={publicConfigForm.about.description}
                      onChange={(e) =>
                        setPublicConfigForm({
                          ...publicConfigForm,
                          about: {
                            ...publicConfigForm.about,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Image URL
                    </label>
                    <div className="space-y-2">
                      <input
                        className="w-full rounded bg-white/10 p-2 text-white"
                        value={publicConfigForm.about.image}
                        onChange={(e) =>
                          setPublicConfigForm({
                            ...publicConfigForm,
                            about: {
                              ...publicConfigForm.about,
                              image: e.target.value,
                            },
                          })
                        }
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
                        <span className="text-xs text-slate-400">
                          or choose file
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Page */}
              <div className="rounded-lg bg-white/5 p-4">
                <h4 className="mb-3 text-lg font-semibold text-white">
                  Services Page
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Title
                    </label>
                    <input
                      className="w-full rounded bg-white/10 p-2 text-white"
                      value={publicConfigForm.services.title}
                      onChange={(e) =>
                        setPublicConfigForm({
                          ...publicConfigForm,
                          services: {
                            ...publicConfigForm.services,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full rounded bg-white/10 p-2 text-white"
                      rows={2}
                      value={publicConfigForm.services.description}
                      onChange={(e) =>
                        setPublicConfigForm({
                          ...publicConfigForm,
                          services: {
                            ...publicConfigForm.services,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <GlowButton
                  onClick={() => {
                    updatePublicPageConfig(publicConfigForm);
                  }}
                >
                  Save Page Settings
                </GlowButton>
              </div>
            </>
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
                    className={`rounded-lg border-2 p-4 transition-all cursor-pointer ${
                      currentDesignTheme === theme.id
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
                    <div className="grid gap-4 md:grid-cols-2">
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

  if (page === "notifications")
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

  return <EmptyState title="Loading" hint="Select a section to continue." />;
}
