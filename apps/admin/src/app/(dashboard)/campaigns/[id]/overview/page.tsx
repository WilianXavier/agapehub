import { PagePlaceholder } from "@/components/PagePlaceholder";

export default async function CampaignOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="Monitoramento da Campanha"
      description={`Burn-up chart, doações em tempo real, ranking de doadores e análise de conversão da campanha #${id}.`}
      icon="📊"
      tags={["Burn-up", "Tempo Real", "Conversão", "Ranking"]}
    />
  );
}
