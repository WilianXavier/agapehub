import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function HomePage() {
  return (
    <PagePlaceholder
      title="Hub de Gestão"
      description="Visão geral das campanhas, doações recentes, metas e KPIs da organização."
      icon="🏠"
      tags={["Dashboard", "KPIs", "Campanhas Ativas", "Doações Recentes"]}
    />
  );
}
