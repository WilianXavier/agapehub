import { DonorHeader } from "@/components/DonorHeader";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function OrgProfilePage({ params }: { params: { org_slug: string } }) {
  return (
    <>
      <DonorHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <PagePlaceholder
          title="Perfil da Organização"
          description={`Página pública de @${params.org_slug}: missão, campanhas ativas, total arrecadado e formas de apoio.`}
          icon="🏛️"
          tags={["Perfil", "Campanhas", "Missão", "Compartilhar"]}
        />
      </main>
    </>
  );
}
