import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages, ChevronDown } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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
    <div className="relative inline-block" ref={dropdownRef}>
      {/* 🔥 BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur hover:bg-white/15 transition text-white font-medium text-sm"
      >
        <Languages size={15} />
        <span className="text-sm font-bold">
          {currentLang?.flag} {currentLang?.name}
        </span>
        <ChevronDown
          size={13}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* 💎 DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-[1000] overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all
                ${
                  i18n.language === lang.code
                    ? "bg-indigo-600 text-white"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
