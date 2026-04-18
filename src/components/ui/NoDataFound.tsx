import { Inbox } from "lucide-react";
import { CommonButton } from "./primitives";

export function NoDataFound({
  title = "No Data Found",
  subtitle = "There's nothing to display right now",
  onRetry,
}: {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      {/* ICON */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-slate-500/20 to-slate-400/20">
        <Inbox size={32} className="text-slate-400" />
      </div>

      {/* TEXT */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-6">{subtitle}</p>

      {/* RETRY BUTTON */}
      {onRetry && (
        <CommonButton variant="ghost" onClick={onRetry} className="px-6 py-2">
          Try Again
        </CommonButton>
      )}
    </div>
  );
}
