import { useState } from "react";
import { useGymStore } from "../../store/gymStore";
import { useTranslation } from "react-i18next";
import {
  GlassCard,
  GlowButton,
  SectionTitle,
  Skeleton,
  Table,
  EmptyState,
  LoadingOverlay
} from "../../components/ui/primitives";
import { Search, Edit2, Trash2 } from "lucide-react";
import { adminSubscriptionService } from "../../services/adminSubscriptionService";
import { getCurrencySymbol } from "../../utils/currency";
import { toast } from "../../store/toastStore";
import { DeleteConfirmationModal } from "../../components/common/DeleteConfirmationModal";
import { SubscriptionPlanModal } from "../../components/admin/subscriptions/SubscriptionPlanModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys";

const getDurationLabel = (months: number) => {
  if (!months) return "1 Month";
  if (months === 1) return "1 Month";
  if (months === 3) return "3 Months";
  if (months === 6) return "6 Months";
  if (months === 12) return "1 Year";
  return `${months} Months`;
};

export function AdminSubscriptions() {
  const { t } = useTranslation();
  const { appConfig } = useGymStore();
  const queryClient = useQueryClient();
  const currency = appConfig?.currency || "INR";
  const currencySymbol = getCurrencySymbol(currency);

  const [plansMeta, setPlansMeta] = useState({
    page_no: 1,
    page_size: 10,
  });
  const [planSearch, setPlanSearch] = useState("");
  const [editPlan, setEditPlan] = useState<string | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: any } | null>(null);

  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    actual_price: "",
    price: "",
    duration_in_months: "1",
  });

  // 🛡️ FETCH PLANS QUERY
  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: queryKeys.admin.subscriptions({ page: plansMeta.page_no, search: planSearch }),
    queryFn: () => adminSubscriptionService.getPlans({
      count: plansMeta.page_size,
      offset: (plansMeta.page_no - 1) * plansMeta.page_size,
      search: planSearch
    }),
  });

  // 🛡️ SAVE PLAN MUTATION
  const saveMutation = useMutation({
    mutationFn: (payload: any) => 
      editPlan 
        ? adminSubscriptionService.updatePlan(editPlan, payload)
        : adminSubscriptionService.createPlan(payload),
    onSuccess: () => {
      toast.success(editPlan ? "Subscription plan updated successfully" : "New subscription plan created");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.subscriptions({}) });
      setPlanModalOpen(false);
    },
    onError: () => toast.error("Failed to save subscription plan. Please check all fields.")
  });

  // 🛡️ DELETE PLAN MUTATION
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminSubscriptionService.deletePlan(id),
    onSuccess: () => {
      toast.success("Subscription plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.subscriptions({}) });
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Deletion failed. This plan may be active for some users.");
    }
  });

  const plans = plansData?.data || [];
  const totalCount = plansData?.total_count || 0;
  const lastPage = Math.ceil(totalCount / plansMeta.page_size) || 1;

  return (
    <GlassCard>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <SectionTitle
          title={t("subscriptions")}
          subtitle={t("subscriptionsSubtitle") || "Manage gym membership plans and pricing strategies."}
        />
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={t("search") || "Search plans..."}
              value={planSearch}
              onChange={(e) => setPlanSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-indigo-500 transition"
            />
          </div>
          <GlowButton
            className="w-full md:w-auto justify-center"
            onClick={() => {
              setPlanForm({ name: "", description: "", actual_price: "", price: "", duration_in_months: "1" });
              setEditPlan(null);
              setPlanModalOpen(true);
            }}
          >
            {t("createPlan") || "Create Plan"}
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
            columns={[
              { key: "name", label: t("planDetails"), render: (p) => <span className="font-bold text-white uppercase tracking-tight">{p.name}</span> },
              { key: "actual_price", label: t("actualPrice"), render: (p) => <span className="text-slate-400 line-through text-xs">{currencySymbol}{p.actual_price}</span> },
              { key: "price", label: t("valuation"), render: (p) => <span className="text-emerald-400 font-black">{currencySymbol}{p.price}</span> },
              { key: "duration", label: t("duration"), render: (p) => <span className="text-indigo-300 font-bold">{getDurationLabel(p.duration_in_months)}</span> },
              { key: "description", label: t("description"), render: (p) => <span className="text-slate-400 text-xs truncate max-w-xs block">{p.description}</span> },
              { 
                key: "actions", 
                label: t("actions"), 
                render: (p) => (
                  <div className="flex gap-4">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-125"
                      onClick={() => {
                        setPlanForm({
                          name: p.name,
                          description: p.description,
                          actual_price: p.actual_price?.toString() || "",
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
                  </div>
                ) 
              },
            ]}
            data={plans}
          />

          {lastPage > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={plansMeta.page_no === 1}
                onClick={() => setPlansMeta({ ...plansMeta, page_no: plansMeta.page_no - 1 })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-30"
              >
                {t("prev")}
              </button>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {t("pageOf", { current: plansMeta.page_no, total: lastPage })}
              </span>
              <button
                disabled={plansMeta.page_no >= lastPage}
                onClick={() => setPlansMeta({ ...plansMeta, page_no: plansMeta.page_no + 1 })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-30"
              >
                {t("next")}
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={t("protocolVacuum")}
          hint={planSearch ? t("noMembershipStrategyMatch", { search: planSearch }) : t("initMembershipTier")}
        />
      )}

      <SubscriptionPlanModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        editPlanId={editPlan}
        planForm={planForm}
        setPlanForm={setPlanForm}
        currencySymbol={currencySymbol}
        onSuccess={() => {}}
        onSave={(payload) => saveMutation.mutate(payload)}
        isSaving={saveMutation.isPending}
      />

      {/* Delete Modal for Plans */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen && deleteTarget?.type === "plan"}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (deleteTarget && deleteTarget.type === "plan") {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        title={t("strategyTermination")}
        description={t("strategyTerminationDesc")}
        confirmLabel={t("submit")}
      />
      {/* FULL SCREEN LOADING OVERLAY */}
      <LoadingOverlay show={deleteMutation.isPending || saveMutation.isPending} label={t("processingRequest") || "Processing Request..."} />
    </GlassCard>
  );
}
