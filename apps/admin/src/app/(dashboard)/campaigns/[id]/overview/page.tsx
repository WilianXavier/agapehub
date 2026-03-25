import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function CampaignOverviewPage({ params }: { params: { id: string } }) {
  return (
    <PagePlaceholder
      title="Monitoramento da Campanha"
      description={`Burn-up chart, doações em tempo real, ranking de doadores e análise de conversão da campanha #${params.id}.`}
      icon="📊"
      tags={["Burn-up", "Tempo Real", "Conversão", "Ranking"]}
    />
  );
}
