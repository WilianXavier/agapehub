import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function NewCampaignPage() {
  return (
    <PagePlaceholder
      title="Criar Campanha"
      description="Wizard passo-a-passo para criação de uma nova campanha de doações: nome, meta, prazo, método de pagamento e página pública."
      icon="✨"
      tags={["Wizard", "Meta", "Prazo", "Pix", "Cartão"]}
    />
  );
}
