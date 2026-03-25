import { DonorHeader } from "@/components/DonorHeader";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export default async function CampaignRankingPage({
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
          title="Leaderboard"
          description={`Ranking de doadores da campanha /${org_slug}/${camp_slug}. Top doadores, conquistas e gamificação social.`}
          icon="🏆"
          tags={["Ranking", "Gamificação", "Top Doadores", "Compartilhar"]}
        />
      </main>
    </>
  );
}
