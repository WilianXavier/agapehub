import { DonorHeader } from "@/components/DonorHeader";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function MyImpactPage() {
  return (
    <>
      <DonorHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <PagePlaceholder
          title="Painel de Impacto"
          description="Visualize o impacto acumulado das suas doações: total doado, campanhas apoiadas, vidas impactadas e histórico de conquistas."
          icon="🌍"
          tags={["Impacto", "Conquistas", "Estatísticas", "Compartilhar"]}
        />
      </main>
    </>
  );
}
