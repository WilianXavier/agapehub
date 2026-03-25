import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function FinancialDashboardPage() {
  return (
    <PagePlaceholder
      title="Cockpit Financeiro"
      description="Saldo disponível, histórico de transações, relatórios de doações por campanha, gráficos de receita e projeções."
      icon="💰"
      tags={["Saldo", "Transações", "Relatórios", "Projeções"]}
    />
  );
}
