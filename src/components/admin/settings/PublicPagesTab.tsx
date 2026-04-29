import { useState, useEffect } from "react";
import { GlowButton, SectionTitle } from "../../ui/primitives";
import { Trash2, Save } from "lucide-react";
import { useGymStore } from "../../../store/gymStore";
import { toast } from "../../../store/toastStore";
import { adminPublicPagesService, type FAQ, type Testimonial } from "../../../services/adminPublicPagesService";

export function PublicPagesTab() {
  const { publicPageConfig, updatePublicPageConfig } = useGymStore();
  const [form, setForm] = useState(publicPageConfig);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const faqRes = await adminPublicPagesService.getFAQs();
      if (faqRes?.data) setFaqs(faqRes.data);
      
      const testRes = await adminPublicPagesService.getTestimonials();
      if (testRes?.data) setTestimonials(testRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = () => {
    updatePublicPageConfig(form);
    toast.success("Public Portal synchronized successfully!");
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
      {/* Home Section */}
      <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-6">
        <SectionTitle title="Home / Hero Section" subtitle="The first thing visitors see on your portal" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Title</label>
              <input className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={form.home.heroTitle} onChange={(e) => setForm({ ...form, home: { ...form.home, heroTitle: e.target.value } })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtitle</label>
              <textarea rows={3} className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={form.home.heroSubtitle} onChange={(e) => setForm({ ...form, home: { ...form.home, heroSubtitle: e.target.value } })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hero Image URL</label>
            <div className="space-y-2">
              <input className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={form.home.heroImage} onChange={(e) => setForm({ ...form, home: { ...form.home, heroImage: e.target.value } })} />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="flex-1 text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-white file:hover:bg-indigo-700"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setForm({ ...form, home: { ...form.home, heroImage: ev.target?.result as string } });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-black text-indigo-400 uppercase tracking-wider">Floating Features</h5>
            <GlowButton className="px-3 py-1 text-[10px]" onClick={() => setForm({ ...form, home: { ...form.home, features: [...form.home.features, { title: "New Feature", description: "", image: "" }] } })}>
              + Add Feature
            </GlowButton>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {form.home.features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <input className="bg-transparent border-none text-white font-bold text-xs focus:ring-0 w-full" value={feat.title} onChange={(e) => {
                    const newFeats = [...form.home.features];
                    newFeats[idx].title = e.target.value;
                    setForm({ ...form, home: { ...form.home, features: newFeats } });
                  }} />
                  <button className="text-red-400/50 hover:text-red-400 shrink-0" onClick={() => {
                    const newFeats = form.home.features.filter((_, i) => i !== idx);
                    setForm({ ...form, home: { ...form.home, features: newFeats } });
                  }}><Trash2 size={14} /></button>
                </div>
                <textarea className="w-full rounded-lg bg-black/20 p-2 text-[10px] text-slate-300 border-none" rows={2} placeholder="Description..." value={feat.description} onChange={(e) => {
                  const newFeats = [...form.home.features];
                  newFeats[idx].description = e.target.value;
                  setForm({ ...form, home: { ...form.home, features: newFeats } });
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-6">
        <SectionTitle title="About Section" subtitle="Share your gym's story and achievements" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Heading</label>
              <input className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={form.about.title} onChange={(e) => setForm({ ...form, about: { ...form.about, title: e.target.value } })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Narrative</label>
              <textarea rows={5} className="w-full rounded-xl bg-white/10 p-3 text-white border border-white/5" value={form.about.description} onChange={(e) => setForm({ ...form, about: { ...form.about, description: e.target.value } })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">About Image</label>
              <input className="w-full rounded-xl bg-white/10 p-2 text-xs text-white border border-white/5 mb-2" value={form.about.image} onChange={(e) => setForm({ ...form, about: { ...form.about, image: e.target.value } })} />
              <input
                type="file"
                accept="image/*"
                className="flex-1 text-[10px] text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-white"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setForm({ ...form, about: { ...form.about, image: ev.target?.result as string } });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Metric Counters</h5>
              <button className="text-indigo-400 hover:text-indigo-300 text-[10px] font-black uppercase" onClick={() => setForm({ ...form, about: { ...form.about, stats: [...form.about.stats, { label: "Stat", value: "0" }] } })}>+ Add Stat</button>
            </div>
            <div className="space-y-2">
              {form.about.stats.map((stat, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input className="flex-1 rounded-lg bg-white/5 border border-white/5 p-2 text-xs text-white" value={stat.label} onChange={(e) => {
                    const newStats = [...form.about.stats];
                    newStats[idx].label = e.target.value;
                    setForm({ ...form, about: { ...form.about, stats: newStats } });
                  }} />
                  <input className="w-24 rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2 text-xs text-indigo-400 font-bold" value={stat.value} onChange={(e) => {
                    const newStats = [...form.about.stats];
                    newStats[idx].value = e.target.value;
                    setForm({ ...form, about: { ...form.about, stats: newStats } });
                  }} />
                  <button className="text-red-400/50 hover:text-red-400" onClick={() => {
                    const newStats = form.about.stats.filter((_, i) => i !== idx);
                    setForm({ ...form, about: { ...form.about, stats: newStats } });
                  }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="rounded-2xl bg-white/5 p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle title="Services Offering" subtitle="Highlight your specialized fitness modules" />
          <GlowButton className="px-4 py-2 text-xs" onClick={() => setForm({ ...form, services: { ...form.services, services: [...form.services.services, { name: "New Service", description: "", image: "" }] } })}>
            + Define New Service
          </GlowButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {form.services.services.map((svc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <input className="bg-transparent border-none text-white font-black uppercase text-sm focus:ring-0 w-full" value={svc.name} onChange={(e) => {
                  const newSvcs = [...form.services.services];
                  newSvcs[idx].name = e.target.value;
                  setForm({ ...form, services: { ...form.services, services: newSvcs } });
                }} />
                <button className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                  const newSvcs = form.services.services.filter((_, i) => i !== idx);
                  setForm({ ...form, services: { ...form.services, services: newSvcs } });
                }}><Trash2 size={16} /></button>
              </div>
              <textarea className="w-full rounded-xl bg-black/20 p-3 text-xs text-slate-400 border-none" rows={2} value={svc.description} onChange={(e) => {
                const newSvcs = [...form.services.services];
                newSvcs[idx].description = e.target.value;
                setForm({ ...form, services: { ...form.services, services: newSvcs } });
              }} />
            </div>
          ))}
        </div>
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

      <div className="flex justify-end pt-4">
        <GlowButton className="px-12 py-3" onClick={handleSave}>
          Sync Public Database
        </GlowButton>
      </div>
    </div>
  );
}
