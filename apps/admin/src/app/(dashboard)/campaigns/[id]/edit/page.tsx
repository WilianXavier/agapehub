import { PagePlaceholder } from "@/components/PagePlaceholder";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PagePlaceholder
      title="Editar Campanha"
      description={`Edição de configurações, meta, prazo e conteúdo da campanha #${id}.`}
      icon="✏️"
      tags={["Edição", "Meta", "Conteúdo", "Publicação"]}
    />
  );
}
