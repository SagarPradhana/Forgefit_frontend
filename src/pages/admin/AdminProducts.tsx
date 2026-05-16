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
  Pagination,
  LoadingOverlay
} from "../../components/ui/primitives";
import { Search, Edit2, Trash2 } from "lucide-react";
import { adminProductService } from "../../services/adminProductService";
import { getCurrencySymbol } from "../../utils/currency";
import { toast } from "../../store/toastStore";
import { DeleteConfirmationModal } from "../../components/common/DeleteConfirmationModal";
import { ProductModal } from "../../components/admin/products/ProductModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../constants/queryKeys";

export function AdminProducts() {
  const { t } = useTranslation();
  const { appConfig } = useGymStore();
  const queryClient = useQueryClient();
  const currencySymbol = getCurrencySymbol(appConfig?.currency || "INR");

  const [productsMeta, setProductsMeta] = useState({
    page_no: 1,
    page_size: 10,
  });
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("All");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: any } | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    category: "Supplements",
    price: "",
    stock: "",
    unit: "kg",
    image: "",
    description: ""
  });

  // 🛡️ FETCH PRODUCTS QUERY
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: queryKeys.admin.products({ page: productsMeta.page_no, search: productSearch, category: productCategory }),
    queryFn: () => adminProductService.getProducts({
      count: productsMeta.page_size,
      offset: (productsMeta.page_no - 1) * productsMeta.page_size,
      search: productSearch,
      category: productCategory !== "All" ? productCategory : undefined
    }),
  });

  // 🛡️ SAVE PRODUCT MUTATION
  const saveMutation = useMutation({
    mutationFn: (payload: any) => 
      editProduct 
        ? adminProductService.updateProduct(editProduct, payload)
        : adminProductService.createProduct(payload),
    onSuccess: () => {
      toast.success(editProduct ? "Product updated successfully" : "Product created and added to catalog");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products({}) });
      setProductModalOpen(false);
    },
    onError: () => toast.error("Failed to save product. Please check all fields.")
  });

  // 🛡️ DELETE PRODUCT MUTATION
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminProductService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products({}) });
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete product");
    }
  });

  const fetchedProducts = productsData?.data || [];
  const totalCount = productsData?.total_count || productsData?.count || 0;
  const lastPage = Math.ceil(totalCount / productsMeta.page_size) || 1;

  return (
    <GlassCard>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <SectionTitle
          title={t("products")}
          subtitle={t("productsSubtitle") || "Manage gym merchandise, supplements, and equipment stock."}
        />
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={t("search") || "Search products..."}
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-indigo-500 transition"
            />
          </div>
          <select
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 transition cursor-pointer"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          >
            <option value="All" className="bg-slate-900">{t("allCategories") || "All Categories"}</option>
            <option value="Supplements" className="bg-slate-900">Supplements</option>
            <option value="Apparel" className="bg-slate-900">Apparel</option>
            <option value="Equipment" className="bg-slate-900">Equipment</option>
            <option value="Accessories" className="bg-slate-900">Accessories</option>
          </select>
          <GlowButton
            className="w-full md:w-auto justify-center"
            onClick={() => {
              setProductForm({ name: "", category: "Supplements", price: "", stock: "", unit: "kg", image: "", description: "" });
              setEditProduct(null);
              setProductModalOpen(true);
            }}
          >
            {t("addProduct") || "Add Product"}
          </GlowButton>
        </div>
      </div>

      {productsLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : fetchedProducts.length > 0 ? (
        <>
          <Table
            columns={[
              { 
                key: "info", 
                label: "Product Info", 
                render: (p) => (
                  <div className="flex items-center gap-3 text-left">
                    <img src={p.image_url || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=400"} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-white/10" />
                    <div className="flex flex-col">
                      <span className="font-bold text-white tracking-tight uppercase text-xs">{p.name}</span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{p.description}</span>
                    </div>
                  </div>
                ) 
              },
              { key: "category", label: "Category", render: (p) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.category}</span> },
              { key: "price", label: "Price", render: (p) => <span className="text-emerald-400 font-bold">{currencySymbol}{p.price}</span> },
              { 
                key: "stock", 
                label: "Stock", 
                render: (p) => (
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-xs font-bold ${p.stock_count < 10 ? 'text-red-400' : 'text-indigo-300'}`}>{p.stock_count}</span>
                    {p.stock_count < 10 && <span className="text-[8px] font-black uppercase text-red-500/80 animate-pulse">{t("lowStock")}</span>}
                  </div>
                ) 
              },
              { 
                key: "actions", 
                label: "Actions", 
                render: (p) => (
                  <div className="flex gap-4">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 transition-transform hover:scale-125"
                      onClick={() => {
                        setProductForm({
                          name: p.name,
                          category: p.category,
                          price: p.price.toString(),
                          stock: p.stock_count.toString(),
                          unit: p.unit || "kg",
                          image: p.image_url || "",
                          description: p.description || ""
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
                  </div>
                ) 
              },
            ]}
            data={fetchedProducts}
          />

          <Pagination
            currentPage={productsMeta.page_no}
            totalPages={lastPage}
            hasPrev={productsMeta.page_no > 1}
            hasNext={productsMeta.page_no < lastPage}
            onPrev={() => setProductsMeta({ ...productsMeta, page_no: productsMeta.page_no - 1 })}
            onNext={() => setProductsMeta({ ...productsMeta, page_no: productsMeta.page_no + 1 })}
          />
        </>
      ) : (
        <EmptyState
          title={t("registryVoid")}
          hint={productSearch ? t("noEquipMatch", { search: productSearch }) : t("initInventory")}
        />
      )}

      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        editProductId={editProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        currencySymbol={currencySymbol}
        onSuccess={() => {}}
        onSave={(payload) => saveMutation.mutate(payload)}
        isSaving={saveMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen && deleteTarget?.type === "product"}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (deleteTarget && deleteTarget.type === "product") {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
        title={t("inventoryPurge")}
        description={t("inventoryPurgeDesc")}
        confirmLabel={t("submit")}
      />
      {/* FULL SCREEN LOADING OVERLAY */}
      <LoadingOverlay show={deleteMutation.isPending || saveMutation.isPending} label={t("processingRequest") || "Processing Request..."} />
    </GlassCard>
  );
}
