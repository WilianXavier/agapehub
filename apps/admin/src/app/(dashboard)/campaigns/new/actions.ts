"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { campaignSchema, type CreateCampaignState } from "./schema";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCampaign(
  _prev: CreateCampaignState,
  formData: FormData
): Promise<CreateCampaignState> {
  const raw = Object.fromEntries(formData.entries());

  const parsed = campaignSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      errors: Object.fromEntries(
        Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""])
      ) as CreateCampaignState["errors"],
      values: raw as CreateCampaignState["values"],
    };
  }

  const { title, description, goalAmount, type, startsAt, endsAt, coverUrl, organizationId, publish } =
    parsed.data;

  const baseSlug = toSlug(title);
  const existing = await db.campaign.findFirst({
    where: { organizationId, slug: baseSlug },
  });
  const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

  try {
    await db.campaign.create({
      data: {
        title,
        description,
        goalAmount,
        type,
        status: publish === "active" ? "ACTIVE" : "DRAFT",
        slug,
        coverUrl,
        organizationId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
      },
    });
  } catch {
    return { errors: { _form: "Erro ao salvar no banco. Tente novamente." } };
  }

  redirect("/campaigns");
}
