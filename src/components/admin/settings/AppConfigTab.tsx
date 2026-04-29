import { useState, useEffect } from "react";
import { GlowButton } from "../../ui/primitives";
import { toast } from "../../../store/toastStore";
import { adminAppConfigService, type AppConfigData } from "../../../services/adminAppConfigService";

const formatHoursToTime = (hours: number): string => {
  if (!hours || isNaN(hours)) return "00:00";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const parseTimeToHours = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  return Number((h + (m / 60)).toFixed(2));
};

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
  const [languages, setLanguages] = useState<Record<string, string>>({});
  const [timezones, setTimezones] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchConfig();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const langRes = await adminAppConfigService.getLanguages();
      if (langRes?.data) {
        setLanguages(langRes.data);
      } else if (langRes && typeof langRes === 'object') {
        setLanguages(langRes);
      }

      const tzRes = await adminAppConfigService.getTimezones();
      if (tzRes?.data && !tzRes["Africa/Abidjan"]) {
        setTimezones(tzRes.data);
      } else if (tzRes && typeof tzRes === 'object') {
        setTimezones(tzRes);
      }
    } catch (e) {
      console.error("Failed to fetch dropdown data:", e);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await adminAppConfigService.getConfig();
      // API returns config fields at root level (brand_name, logo_image_path, etc.)
      // data[] is empty — the config object IS the response itself
      const cfg = (res?.brand_name !== undefined)
        ? res                        // root-level response (actual API shape)
        : (res?.data?.[0] ?? null);  // fallback: nested in data[]

      if (cfg) {
        setConfig({
          id: cfg.id,
          brand_name: cfg.brand_name || "",
          logo_image_path: cfg.logo_image_path || "",
          gym_in_out_limit_in_hrs: Number(cfg.gym_in_out_limit_in_hrs) || 0,
          theme_name: cfg.theme_name || "",
          description: cfg.description || "",
          timezone: cfg.timezone || "",
          currency: cfg.currency || "",
          language: cfg.language || "",
          country: cfg.country || "",
          email: cfg.email || "",
          phone: cfg.phone || "",
          whatsapp: cfg.whatsapp || "",
          facebook_url: cfg.facebook_url || "",
          instagram_url: cfg.instagram_url || "",
          twitter_url: cfg.twitter_url || "",
          linkedin_url: cfg.linkedin_url || "",
          tiktok_url: cfg.tiktok_url || "",
          youtube_url: cfg.youtube_url || "",
          website_url: cfg.website_url || "",
        });
        if (cfg.logo_image_path) setLogoPreview(cfg.logo_image_path);
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
            <label className="block text-sm font-medium text-slate-300 mb-1">Gym In/Out Limit (HH:MM)</label>
            <input
              type="time"
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10"
              style={{ colorScheme: "dark" }}
              value={formatHoursToTime(config.gym_in_out_limit_in_hrs)}
              onChange={(e) => setConfig({ ...config, gym_in_out_limit_in_hrs: parseTimeToHours(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
            <select
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10 [&>option]:bg-slate-900"
              value={config.timezone || ""}
              onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
            >
              <option value="">Select Timezone</option>
              {Object.keys(timezones).map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
            <select
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10 [&>option]:bg-slate-900"
              value={config.currency || ""}
              onChange={(e) => setConfig({ ...config, currency: e.target.value })}
            >
              <option value="">Select Currency</option>
              {["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
            <select
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10 [&>option]:bg-slate-900"
              value={config.language || ""}
              onChange={(e) => setConfig({ ...config, language: e.target.value })}
            >
              <option value="">Select Language</option>
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name as string}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Country</label>
            <select
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10 [&>option]:bg-slate-900"
              value={config.country || ""}
              onChange={(e) => setConfig({ ...config, country: e.target.value })}
            >
              <option value="">Select Country</option>
              {["United States", "United Kingdom", "India", "Australia", "Canada", "Germany", "France", "Japan", "China", "Brazil", "South Africa"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Theme Name</label>
            <select
              className="w-full rounded bg-white/10 p-2 text-white border border-white/10 [&>option]:bg-slate-900"
              value={config.theme_name || ""}
              onChange={(e) => setConfig({ ...config, theme_name: e.target.value })}
            >
              <option value="">Select Theme</option>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
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
