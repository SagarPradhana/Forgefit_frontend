import { GlassCard, SectionTitle, EmptyState } from "../../components/ui/primitives";

export function TrainerWorkouts() {
  return (
    <GlassCard className="p-8">
      <SectionTitle
        title="Workout Protocols"
        subtitle="Design and assign high-performance training routines."
      />
      <div className="mt-8">
        <EmptyState
          title="Protocol Vault Empty"
          hint="Start by defining your first training methodology for members."
        />
      </div>
    </GlassCard>
  );
}
