import { GlassCard } from "../components/ui/primitives";

export function AttendanceCalendar({ data }: any) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Convert data into map for quick lookup
  const attendanceMap: Record<string, any> = {};
  data.forEach((d: any) => {
    const day = d.date.split("-")[2];
    attendanceMap[day] = d;
  });

  return (
    <GlassCard className="p-6">
      <h3 className="text-sm text-slate-400 mb-4">Monthly Attendance</h3>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = String(day).padStart(2, "0");
          const record = attendanceMap[key];

          return (
            <div
              key={day}
              className={`h-16 sm:h-20 p-1 sm:p-2 rounded-lg text-[9px] sm:text-xs flex flex-col justify-between
              ${
                record
                  ? "bg-gradient-to-r from-indigo-500/40 to-orange-400/40 text-white"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              {/* DAY NUMBER */}
              <span className="text-[10px] opacity-70">{day}</span>

              {/* TIMES */}
              {record ? (
                <div className="text-[10px] leading-tight">
                  <p>In: {record.checkIn}</p>
                  <p>Out: {record.checkOut}</p>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500">-</span>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
