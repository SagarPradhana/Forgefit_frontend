import { useState, useEffect } from "react";
import { GlowButton } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";
import { adminAppConfigService, type AppConfigData } from "../../../services/adminAppConfigService";

export function AppConfigTab() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<AppConfigData>({
    brand_name: "",
    gym_in_out_limit_in_hrs: 0,
    theme_name: "",
    description: "",
    timezone: "",
    currency: "",
    language: "",
    country: "",
    email: "",
    phone: "",
    whatsapp: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",
    tiktok_url: "",
    youtube_url: "",
    website_url: "",
  });
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await adminAppConfigService.getConfig();
      if (res?.data && res.data.length > 0) {
        setConfig(res.data[0]);
        if (res.data[0].logo_image_path) {
          setLogoPreview(res.data[0].logo_image_path);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...config };
      delete payload.id;
      delete payload.logo_image_path;
      
      await adminAppConfigService.saveConfig(payload);
      toast.success("App configuration saved successfully!");
      fetchConfig();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save app configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await adminAppConfigService.uploadLogo(file);
      toast.success("Logo uploaded successfully!");
      fetchConfig();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload logo.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Branding */}
      <div className="rounded-lg bg-white/5 p-4 space-y-4">
        <h4 className="text-lg font-semibold text-white">App Branding</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Brand Name</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.brand_name || ""}
              onChange={(e) => setConfig({ ...config, brand_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Upload Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <div className="h-10 w-10 shrink-0 bg-white/10 rounded overflow-hidden">
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="flex-1 text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-indigo-600 file:px-2 file:py-1 file:text-white file:hover:bg-indigo-700"
                onChange={handleLogoUpload}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              rows={3}
              value={config.description || ""}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-lg bg-white/5 p-4 space-y-4">
        <h4 className="text-lg font-semibold text-white">Global Settings</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Gym In/Out Limit (Hrs)</label>
            <input
              type="number"
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.gym_in_out_limit_in_hrs || 0}
              onChange={(e) => setConfig({ ...config, gym_in_out_limit_in_hrs: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.timezone || ""}
              onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.currency || ""}
              onChange={(e) => setConfig({ ...config, currency: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.language || ""}
              onChange={(e) => setConfig({ ...config, language: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.country || ""}
              onChange={(e) => setConfig({ ...config, country: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Theme Name</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.theme_name || ""}
              onChange={(e) => setConfig({ ...config, theme_name: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Social & Contact */}
      <div className="rounded-lg bg-white/5 p-4 space-y-4">
        <h4 className="text-lg font-semibold text-white">Contact & Social Links</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.email || ""}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.phone || ""}
              onChange={(e) => setConfig({ ...config, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.whatsapp || ""}
              onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.website_url || ""}
              onChange={(e) => setConfig({ ...config, website_url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Facebook URL</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.facebook_url || ""}
              onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Instagram URL</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.instagram_url || ""}
              onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Twitter URL</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.twitter_url || ""}
              onChange={(e) => setConfig({ ...config, twitter_url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">LinkedIn URL</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.linkedin_url || ""}
              onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">TikTok URL</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.tiktok_url || ""}
              onChange={(e) => setConfig({ ...config, tiktok_url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">YouTube URL</label>
            <input
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              value={config.youtube_url || ""}
              onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <GlowButton onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save App Config"}
        </GlowButton>
      </div>
    </div>
  );
}
