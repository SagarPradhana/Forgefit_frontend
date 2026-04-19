import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages, ChevronDown } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* 🔥 BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition"
      >
        <Languages size={16} />
        <span className="text-sm">
          {currentLang?.flag} {currentLang?.name}
        </span>
        <ChevronDown
          size={14}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* 💎 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-white/10 shadow-xl z-50 overflow-visible">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition
                ${
                  i18n.language === lang.code
                    ? "bg-indigo-500/20 text-white"
                    : "text-slate-300 hover:bg-white/10"
                }
              `}
            >
              <span>{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
