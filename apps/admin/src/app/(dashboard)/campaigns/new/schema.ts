import { z } from "zod";

export const campaignSchema = z
  .object({
    title: z
      .string()
      .min(3, "Mínimo de 3 caracteres")
      .max(100, "Máximo de 100 caracteres"),
    description: z
      .string()
      .min(1, "Descrição é obrigatória"),
    goalAmount: z.coerce
      .number({ error: "Informe um valor válido" })
      .positive("A meta deve ser maior que R$ 0"),
    type: z.enum(["TITHE", "OFFER", "CAMPAIGN"]),
    startsAt: z.string().min(1, "Data de início é obrigatória"),
    endsAt: z.string().min(1, "Data de encerramento é obrigatória"),
    coverUrl: z.string().min(1, "Imagem de capa é obrigatória"),
    organizationId: z.string().min(1),
    publish: z.enum(["draft", "active"]).default("draft"),
  })
  .refine(
    (d) => new Date(d.endsAt) > new Date(d.startsAt),
    { message: "Data de encerramento deve ser posterior ao início", path: ["endsAt"] }
  );

export type CampaignSchemaInput = z.infer<typeof campaignSchema>;

export type CreateCampaignState = {
  errors?: Partial<Record<keyof CampaignSchemaInput | "_form", string>>;
  values?: Partial<CampaignSchemaInput>;
};
