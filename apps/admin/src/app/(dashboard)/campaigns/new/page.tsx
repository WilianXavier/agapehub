import { db } from "@/lib/db";
import { CampaignWizard } from "@/components/campaigns/CampaignWizard";
import { redirect } from "next/navigation";

export default async function NewCampaignPage() {
  const org = await db.organization.findFirst();

  if (!org) redirect("/campaigns");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-fg mb-6">Nova Campanha</h1>
      <CampaignWizard organizationId={org.id} />
    </div>
  );
}
