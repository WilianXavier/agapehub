import { DonorHeader } from "@/components/DonorHeader";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function ExplorePage() {
  return (
    <>
      <DonorHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <PagePlaceholder
          title="Vitrine de Campanhas"
          description="Explore campanhas ativas de igrejas e organizações religiosas. Descubra causas, projetos sociais e missões para apoiar."
          icon="🌟"
          tags={["Descoberta", "Filtros", "Categorias", "Destaque", "Recentes"]}
        />
      </main>
    </>
  );
}
