import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  return (
    <PagePlaceholder
      title="Editar Campanha"
      description={`Edição de configurações, meta, prazo e conteúdo da campanha #${params.id}.`}
      icon="✏️"
      tags={["Edição", "Meta", "Conteúdo", "Publicação"]}
    />
  );
}
