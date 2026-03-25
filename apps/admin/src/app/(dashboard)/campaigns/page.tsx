import { PagePlaceholder } from "@/components/PagePlaceholder";
import Link from "next/link";

export default function CampaignsPage() {
  return (
    <div className="p-6 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
            <p className="text-gray-500 text-sm mt-1">Gestão de estados e campanhas da organização</p>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition-colors"
          >
            ＋ Nova campanha
          </Link>
        </div>
        <PagePlaceholder
          title="Gestão de Campanhas"
          description="Lista de campanhas com filtro por estado: rascunho, ativa, pausada, encerrada. Ações rápidas de publicar, pausar e arquivar."
          icon="📢"
          tags={["Rascunho", "Ativa", "Pausada", "Encerrada", "Filtros"]}
        />
      </div>
    </div>
  );
}
