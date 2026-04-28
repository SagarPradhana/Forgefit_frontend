import { useGymStore } from "../../../store/gymStore";

export function DesignThemesTab() {
  const { designThemes, currentDesignTheme, setDesignTheme } = useGymStore();

  const activeTheme = designThemes.find((t) => t.id === currentDesignTheme);

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-300">
        Select a design theme to instantly change the appearance of your public portal.
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {designThemes.map((theme) => (
          <div
            key={theme.id}
            className={`rounded-lg border-2 p-4 transition-all cursor-pointer ${
              currentDesignTheme === theme.id
                ? "border-indigo-400 bg-indigo-400/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
            onClick={() => setDesignTheme(theme.id)}
          >
            <div className="mb-3 aspect-video rounded bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
              <span className="text-2xl">
                {theme.name === "Modern & Clean" ? "🎨" : theme.name === "Vibrant & Energetic" ? "⚡" : "🏛️"}
              </span>
            </div>
            <h5 className="font-semibold text-white mb-1">{theme.name}</h5>
            <p className="text-sm text-slate-300 mb-3">{theme.description}</p>
            <div className="flex gap-2 mb-3">
              <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.primary }} />
              <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.secondary }} />
              <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.accent }} />
            </div>
            {currentDesignTheme === theme.id && (
              <div className="text-xs text-indigo-400 font-medium">Currently Active</div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white/5 p-4">
        <h4 className="mb-3 text-lg font-semibold text-white">Current Theme Details</h4>
        {activeTheme ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-white mb-2">Colors</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: activeTheme.colors.primary }} />
                  <span className="text-sm text-slate-300">Primary: {activeTheme.colors.primary}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: activeTheme.colors.secondary }} />
                  <span className="text-sm text-slate-300">Secondary: {activeTheme.colors.secondary}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: activeTheme.colors.accent }} />
                  <span className="text-sm text-slate-300">Accent: {activeTheme.colors.accent}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-white mb-2">Styles</h5>
              <div className="space-y-2 text-sm text-slate-300">
                <div>Button Style: {activeTheme.styles.buttonStyle}</div>
                <div>Layout: {activeTheme.styles.layout}</div>
                <div>Typography: {activeTheme.styles.typography}</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
