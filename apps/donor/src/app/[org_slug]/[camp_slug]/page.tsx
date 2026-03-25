import { DonorHeader } from "@/components/DonorHeader";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ org_slug: string; camp_slug: string }>;
}) {
  const { org_slug, camp_slug } = await params;
  return (
    <>
      <DonorHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <PagePlaceholder
          title="Detalhe da Campanha"
          description={`Campanha /${org_slug}/${camp_slug}: descrição, meta, progresso, galeria de fotos e botão de doação.`}
          icon="📣"
          tags={["Progresso", "Meta", "Doadores", "Galeria", "CTA"]}
        />
      </main>
    </>
  );
}
