import React, { useState, useEffect } from "react";
import { SectionTitle, Modal } from "../../ui/primitives";
import { Trash2, Save, Video, Image as ImageIcon, Eye, Download, UploadCloud } from "lucide-react";
import { toast } from "../../../store/toastStore";
import { adminPublicPagesService, type FAQ, type Testimonial, type PublicBannerType, type PublicBanner, type BannerConfig } from "../../../services/adminPublicPagesService";

const BANNER_CONFIGS: Record<PublicBannerType, BannerConfig> = {
  common: { type: "common", maxCount: 3, maxSizeMB: 1, allowedTypes: ["image/png", "image/jpg", "image/jpeg"], label: "Home Banners", icon: "🏠" },
  inspirational: { type: "inspirational", maxCount: 5, maxSizeMB: 1, allowedTypes: ["image/png", "image/jpg", "image/jpeg"], label: "Before/After", icon: "💪" },
  trainers: { type: "trainers", maxCount: 5, maxSizeMB: 1, allowedTypes: ["image/png", "image/jpg", "image/jpeg"], label: "Trainers", icon: "👨‍🏫" },
  offers: { type: "offers", maxCount: 3, maxSizeMB: 1, allowedTypes: ["image/png", "image/jpg", "image/jpeg"], label: "Offers", icon: "🏷️" },
  about: { type: "about", maxCount: 3, maxSizeMB: 1, allowedTypes: ["image/png", "image/jpg", "image/jpeg"], label: "About Us", icon: "📖" },
  testimonials: { type: "testimonials", maxCount: 1, maxSizeMB: 50, allowedTypes: ["video/mp4", "video/webm"], label: "Testimonials Video", icon: "🎬" },
};

function BannerItem({ banner, config, onDelete, onPreview }: { banner: PublicBanner; config: BannerConfig; onDelete: () => void; onPreview: () => void }) {
  const isVideo = config.type === "testimonials";
  
  return (
    <div className="relative group aspect-video rounded-xl overflow-hidden bg-slate-800 border border-white/10">
      {isVideo ? (
        <video src={banner.file_path} className="w-full h-full object-cover" />
      ) : (
        <img src={banner.file_path} alt={config.label} className="w-full h-full object-cover" />
      )}
      
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={onPreview}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          title="Preview"
        >
          <Eye size={18} />
        </button>
        <a
          href={banner.file_path}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          title="Download"
        >
          <Download size={18} />
        </a>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-[10px] text-white/70 truncate">
          {new Date(banner.created_date * 1000).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function BannerSection({ config, banners, onUpload, onDelete }: { config: BannerConfig; banners: PublicBanner[]; onUpload: (file: File) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [uploading, setUploading] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<PublicBanner | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canAddMore = banners.length < config.maxCount;
  const isVideo = config.type === "testimonials";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExt = config.allowedTypes.map(t => t.split("/")[1]);
    if (!config.allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${allowedExt.join(", ")}`);
      return;
    }

    if (file.size > config.maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max size: ${config.maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
      toast.success(`${config.label} uploaded successfully!`);
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h4 className="text-base font-black text-white uppercase tracking-tight">{config.label}</h4>
              <p className="text-[10px] text-slate-500">{banners.length} / {config.maxCount} uploaded</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {isVideo ? "Video" : "Image"} • {config.maxSizeMB}MB • {config.allowedTypes.map(t => t.split("/")[1].toUpperCase()).join(", ")}
            </span>
          </div>
        </div>
        
        {banners.length === 0 && !canAddMore && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
              <ImageIcon size={32} className="text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">No {config.label.toLowerCase()} uploaded yet</p>
          </div>
        )}

        <div className={`grid gap-4 ${isVideo ? "grid-cols-1 max-w-md" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"}`}>
          {banners.map((banner) => (
            <BannerItem
              key={banner.id}
              banner={banner}
              config={config}
              onDelete={() => onDelete(banner.id)}
              onPreview={() => setPreviewBanner(banner)}
            />
          ))}
          
          {canAddMore && (
            <label className={`relative ${isVideo ? "aspect-video" : "aspect-square"} rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5 group`}>
              <input ref={fileInputRef} type="file" accept={config.allowedTypes.join(",")} className="hidden" onChange={handleFileChange} disabled={uploading} />
              
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-indigo-400 font-medium">Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-2 group-hover:bg-indigo-500/20 transition-colors">
                    {isVideo ? (
                      <Video size={24} className="text-indigo-400" />
                    ) : (
                      <UploadCloud size={24} className="text-indigo-400" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Click to upload</span>
                  <span className="text-[10px] text-slate-600">Max {config.maxSizeMB}MB</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        open={!!previewBanner}
        onClose={() => setPreviewBanner(null)}
        title={previewBanner ? config.label : ""}
        maxWidth="max-w-3xl"
      >
        {previewBanner && (
          <div className="space-y-4">
            {previewBanner.type === "testimonials" ? (
              <video src={previewBanner.file_path} className="w-full rounded-xl" controls />
            ) : (
              <img src={previewBanner.file_path} alt={config.label} className="w-full rounded-xl" />
            )}
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Created: {new Date(previewBanner.created_date * 1000).toLocaleString()}</span>
              <a href={previewBanner.file_path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                <Download size={14} /> Open Full Size
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export function PublicPagesTab() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [banners, setBanners] = useState<Record<PublicBannerType, PublicBanner[]>>({
    common: [], inspirational: [], trainers: [], offers: [], about: [], testimonials: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const faqRes = await adminPublicPagesService.getFAQs();
      if (faqRes?.data) setFaqs(faqRes.data);
      
      const testRes = await adminPublicPagesService.getTestimonials();
      if (testRes?.data) setTestimonials(testRes.data);

      const bannerTypes: PublicBannerType[] = ["common", "inspirational", "trainers", "offers", "about", "testimonials"];
      const bannerResults: Record<PublicBannerType, PublicBanner[]> = {} as any;
      
      for (const type of bannerTypes) {
        try {
          const res = await adminPublicPagesService.getBannersByType(type);
          bannerResults[type] = res?.data || [];
        } catch {
          bannerResults[type] = [];
        }
      }
      setBanners(bannerResults);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadBanner = (type: PublicBannerType) => async (file: File) => {
    try {
      await adminPublicPagesService.uploadBanner(file, type);
      toast.success(`${BANNER_CONFIGS[type].label} uploaded!`);
      const res = await adminPublicPagesService.getBannersByType(type);
      setBanners((prev) => ({ ...prev, [type]: res?.data || [] }));
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleDeleteBanner = (type: PublicBannerType) => async (id: string) => {
    try {
      await adminPublicPagesService.deleteBanner(id);
      toast.success("Deleted successfully");
      setBanners((prev) => ({ ...prev, [type]: prev[type].filter((b) => b.id !== id) }));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSaveFaq = async (idx: number) => {
    const faq = faqs[idx];
    try {
      if (faq.id) {
        await adminPublicPagesService.updateFAQ(faq.id, { question: faq.question, answer: faq.answer });
        toast.success("FAQ updated successfully!");
      } else {
        const res = await adminPublicPagesService.createFAQ({ question: faq.question, answer: faq.answer });
        const newFaqs = [...faqs];
        newFaqs[idx] = res.data;
        setFaqs(newFaqs);
        toast.success("FAQ created successfully!");
      }
    } catch (err) {
      toast.error("Failed to save FAQ.");
    }
  };

  const handleDeleteFaq = async (idx: number) => {
    const faq = faqs[idx];
    try {
      if (faq.id) {
        await adminPublicPagesService.deleteFAQ(faq.id);
      }
      const newFaqs = faqs.filter((_, i) => i !== idx);
      setFaqs(newFaqs);
      toast.success("FAQ deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete FAQ.");
    }
  };

  const handleSaveTestimonial = async (idx: number) => {
    const test = testimonials[idx];
    try {
      if (test.id) {
        await adminPublicPagesService.updateTestimonial(test.id, { name: test.name, note: test.note });
        toast.success("Testimonial updated successfully!");
      } else {
        const res = await adminPublicPagesService.createTestimonial({ name: test.name, note: test.note });
        const newT = [...testimonials];
        newT[idx] = res.data;
        setTestimonials(newT);
        toast.success("Testimonial created successfully!");
      }
    } catch (err) {
      toast.error("Failed to save Testimonial.");
    }
  };

  const handleDeleteTestimonial = async (idx: number) => {
    const test = testimonials[idx];
    try {
      if (test.id) {
        await adminPublicPagesService.deleteTestimonial(test.id);
      }
      const newT = testimonials.filter((_, i) => i !== idx);
      setTestimonials(newT);
      toast.success("Testimonial deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete Testimonial.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Public Banners */}
      <div className="space-y-6">
        <SectionTitle title="Public Banners" subtitle="Upload images/videos for public pages" />
        
        <BannerSection
          config={BANNER_CONFIGS.common}
          banners={banners.common}
          onUpload={handleUploadBanner("common")}
          onDelete={handleDeleteBanner("common")}
        />
        <BannerSection
          config={BANNER_CONFIGS.inspirational}
          banners={banners.inspirational}
          onUpload={handleUploadBanner("inspirational")}
          onDelete={handleDeleteBanner("inspirational")}
        />
        <BannerSection
          config={BANNER_CONFIGS.trainers}
          banners={banners.trainers}
          onUpload={handleUploadBanner("trainers")}
          onDelete={handleDeleteBanner("trainers")}
        />
        <BannerSection
          config={BANNER_CONFIGS.offers}
          banners={banners.offers}
          onUpload={handleUploadBanner("offers")}
          onDelete={handleDeleteBanner("offers")}
        />
        <BannerSection
          config={BANNER_CONFIGS.about}
          banners={banners.about}
          onUpload={handleUploadBanner("about")}
          onDelete={handleDeleteBanner("about")}
        />
        <BannerSection
          config={BANNER_CONFIGS.testimonials}
          banners={banners.testimonials}
          onUpload={handleUploadBanner("testimonials")}
          onDelete={handleDeleteBanner("testimonials")}
        />
      </div>

      {/* Testimonials & FAQs */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-white uppercase tracking-tighter">Testimonials</h4>
            <button className="text-indigo-400 text-[10px] font-black uppercase hover:underline" onClick={() => setTestimonials([...testimonials, { name: "New User", note: "" }])}>+ Add Story</button>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {testimonials.map((test, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <input className="bg-transparent border-none text-xs font-bold text-white p-0 focus:ring-0" value={test.name} onChange={(e) => {
                    const newT = [...testimonials];
                    newT[idx].name = e.target.value;
                    setTestimonials(newT);
                  }} />
                  <div className="flex gap-2">
                    <button className="text-green-400/50 hover:text-green-400 transition-colors" onClick={() => handleSaveTestimonial(idx)}><Save size={14} /></button>
                    <button className="text-red-400/50 hover:text-red-400 transition-colors" onClick={() => handleDeleteTestimonial(idx)}><Trash2 size={14} /></button>
                  </div>
                </div>
                <textarea className="w-full bg-transparent border-none text-[10px] text-slate-400 p-0 focus:ring-0 italic" rows={2} value={test.note} onChange={(e) => {
                  const newT = [...testimonials];
                  newT[idx].note = e.target.value;
                  setTestimonials(newT);
                }} placeholder="Testimonial content..." />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-white uppercase tracking-tighter">Global FAQs</h4>
            <button className="text-indigo-400 text-[10px] font-black uppercase hover:underline" onClick={() => setFaqs([...faqs, { question: "New Question", answer: "" }])}>+ Add FAQ</button>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                <input className="w-full bg-transparent border-none text-xs font-black text-indigo-400 p-0 focus:ring-0" value={faq.question} onChange={(e) => {
                  const newF = [...faqs];
                  newF[idx].question = e.target.value;
                  setFaqs(newF);
                }} />
                <textarea className="w-full bg-transparent border-none text-[10px] text-slate-400 p-0 focus:ring-0 leading-relaxed" rows={2} value={faq.answer} onChange={(e) => {
                  const newF = [...faqs];
                  newF[idx].answer = e.target.value;
                  setFaqs(newF);
                }} />
                <div className="flex justify-end gap-3">
                  <button className="text-green-400/30 hover:text-green-400 transition-colors" onClick={() => handleSaveFaq(idx)}><Save size={14} /></button>
                  <button className="text-red-400/30 hover:text-red-400 transition-colors" onClick={() => handleDeleteFaq(idx)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
