import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GlassCard, SectionTitle } from "../../ui/primitives";
import { AppConfigTab } from "./AppConfigTab";
import { LocationsTab } from "./LocationsTab";
import { PublicPagesTab } from "./PublicPagesTab";
import { DesignThemesTab } from "./DesignThemesTab";

export function AdminSettings() {
  const { t } = useTranslation();
  const [settingsTab, setSettingsTab] = useState<"app" | "locations" | "pages" | "design">("app");

  return (
    <GlassCard>
      <SectionTitle
        title={t("settings") || "Settings"}
        subtitle="Configure your app, locations, public pages, and design themes."
      />

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-white/10 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-8 min-w-max pb-px">
          {[
            { id: "app", label: "App Config", icon: "⚙️" },
            { id: "locations", label: "Locations", icon: "📍" },
            { id: "pages", label: "Public Pages", icon: "📄" },
            { id: "design", label: "Design Themes", icon: "🎨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                settingsTab === tab.id
                  ? "border-indigo-400 text-indigo-400"
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
        {settingsTab === "app" && <AppConfigTab />}
        {settingsTab === "locations" && <LocationsTab />}
        {settingsTab === "pages" && <PublicPagesTab />}
        {settingsTab === "design" && <DesignThemesTab />}
      </div>
    </GlassCard>
  );
}
