import { GlassCard, SectionTitle, EmptyState } from "../../components/ui/primitives";

export function TrainerDiets() {
  return (
    <GlassCard className="p-8">
      <SectionTitle
        title="Nutritional Strategies"
        subtitle="Optimize member recovery and performance with tailored diet plans."
      />
      <div className="mt-8">
        <EmptyState
          title="Nutrition Archive Empty"
          hint="Create a meal blueprint to fuel member progress."
        />
      </div>
    </GlassCard>
  );
}
