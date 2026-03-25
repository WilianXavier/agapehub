import { DonorHeader } from "@/components/DonorHeader";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function MyDonationsPage() {
  return (
    <>
      <DonorHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <PagePlaceholder
          title="Central do Doador"
          description="Histórico completo de doações, recibos, campanhas apoiadas e gestão de doações recorrentes ativas."
          icon="💝"
          tags={["Histórico", "Recibos", "Recorrência", "Cancelar"]}
        />
      </main>
    </>
  );
}
