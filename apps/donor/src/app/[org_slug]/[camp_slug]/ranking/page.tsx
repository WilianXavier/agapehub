import { DonorHeader } from "@/components/DonorHeader";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function CampaignRankingPage({
  params,
}: {
  params: { org_slug: string; camp_slug: string };
}) {
  return (
    <>
      <DonorHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <PagePlaceholder
          title="Leaderboard"
          description={`Ranking de doadores da campanha /${params.org_slug}/${params.camp_slug}. Top doadores, conquistas e gamificação social.`}
          icon="🏆"
          tags={["Ranking", "Gamificação", "Top Doadores", "Compartilhar"]}
        />
      </main>
    </>
  );
}
