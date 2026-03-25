import Link from "next/link";
import { db } from "@/lib/db";
import { CampaignStatus, CampaignType } from "@prisma/client";

// ── Helpers ───────────────────────────────────────────────────────
const STATUS_LABEL: Record<CampaignStatus, string> = {
  DRAFT:    "Rascunho",
  ACTIVE:   "Ativa",
  PAUSED:   "Pausada",
  FINISHED: "Encerrada",
  ARCHIVED: "Arquivada",
};

const STATUS_COLOR: Record<CampaignStatus, string> = {
  DRAFT:    "bg-surface-3 text-fg-muted",
  ACTIVE:   "bg-success-tint text-success-fg",
  PAUSED:   "bg-warning-tint text-warning-fg",
  FINISHED: "bg-info-tint text-info-fg",
  ARCHIVED: "bg-surface-3 text-fg-muted",
};

const TYPE_LABEL: Record<CampaignType, string> = {
  CAMPAIGN: "Campanha",
  TITHE:    "Dízimo",
  OFFER:    "Oferta",
};

const TYPE_COLOR: Record<CampaignType, string> = {
  CAMPAIGN: "bg-campaign-tint text-campaign-fg",
  TITHE:    "bg-tithe-tint text-tithe-fg",
  OFFER:    "bg-offer-tint text-offer-fg",
};

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
}

// ── Componente de card ────────────────────────────────────────────
function CampaignCard({
  campaign,
}: {
  campaign: {
    id: string;
    title: string;
    type: CampaignType;
    status: CampaignStatus;
    goalAmount: number;
    collectedAmount: number;
    coverUrl: string | null;
    startsAt: Date | null;
    endsAt: Date | null;
    _count: { donations: number };
  };
}) {
  const pct = Math.min(
    100,
    campaign.goalAmount > 0
      ? Math.round((campaign.collectedAmount / campaign.goalAmount) * 100)
      : 0
  );

  const isBase64 = campaign.coverUrl?.startsWith("data:");

  return (
    <div className="bg-canvas border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
      {/* Capa */}
      <div className="h-36 bg-surface-2 relative overflow-hidden">
        {campaign.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={isBase64 ? campaign.coverUrl : campaign.coverUrl}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-fg-disabled">
            📢
          </div>
        )}
        {/* Badges sobre a imagem */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[campaign.status]}`}>
            {STATUS_LABEL[campaign.status]}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLOR[campaign.type]}`}>
            {TYPE_LABEL[campaign.type]}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="font-semibold text-fg text-sm leading-snug line-clamp-2 mb-3">
          {campaign.title}
        </h3>

        {/* Barra de progresso */}
        <div className="mb-3">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs text-fg-muted">{pct}% arrecadado</span>
            <span className="text-xs font-medium text-fg">{fmt(campaign.collectedAmount)}</span>
          </div>
          <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-fg-muted mt-1">
            Meta: {fmt(campaign.goalAmount)}
          </p>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-fg-muted">
            {campaign._count.donations} doação{campaign._count.donations !== 1 ? "ões" : ""}
          </span>
          {campaign.endsAt && (
            <span className="text-xs text-fg-muted">
              Até {new Date(campaign.endsAt).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
      </div>

      {/* Link sobreposto */}
      <Link href={`/campaigns/${campaign.id}`} className="absolute inset-0" aria-label={campaign.title} />
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────
export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const org = await db.organization.findFirst();

  const statusFilter = (["DRAFT", "ACTIVE", "PAUSED", "FINISHED", "ARCHIVED"] as CampaignStatus[]).includes(
    status?.toUpperCase() as CampaignStatus
  )
    ? (status!.toUpperCase() as CampaignStatus)
    : undefined;

  const campaigns = org
    ? await db.campaign.findMany({
        where: { organizationId: org.id, ...(statusFilter ? { status: statusFilter } : {}) },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { donations: true } } },
      })
    : [];

  const counts = org
    ? await db.campaign.groupBy({
        by: ["status"],
        where: { organizationId: org.id },
        _count: true,
      })
    : [];

  const countFor = (s: CampaignStatus) =>
    counts.find((c) => c.status === s)?._count ?? 0;
  const total = counts.reduce((a, c) => a + c._count, 0);

  const tabs: { label: string; value: string; count: number }[] = [
    { label: "Todas", value: "", count: total },
    { label: "Ativas", value: "active", count: countFor("ACTIVE") },
    { label: "Rascunhos", value: "draft", count: countFor("DRAFT") },
    { label: "Pausadas", value: "paused", count: countFor("PAUSED") },
    { label: "Encerradas", value: "finished", count: countFor("FINISHED") },
  ];

  return (
    <div className="p-6 pb-24 md:pb-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-fg">Campanhas</h1>
            <p className="text-sm text-fg-muted mt-0.5">
              {total} campanha{total !== 1 ? "s" : ""} · {org?.name ?? "—"}
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-fg-inv text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors"
          >
            + Nova campanha
          </Link>
        </div>

        {/* Tabs de filtro */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const active = (status ?? "") === tab.value;
            const href = tab.value ? `?status=${tab.value}` : "/campaigns";
            return (
              <Link
                key={tab.value}
                href={href}
                className={[
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-brand text-fg-inv"
                    : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                ].join(" ")}
              >
                {tab.label}
                <span
                  className={[
                    "text-xs px-1.5 py-0.5 rounded-full",
                    active ? "bg-white/20 text-fg-inv" : "bg-surface-3 text-fg-muted",
                  ].join(" ")}
                >
                  {tab.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Grid de cards */}
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-5xl mb-4">📢</p>
            <p className="text-fg font-semibold">Nenhuma campanha encontrada</p>
            <p className="text-fg-muted text-sm mt-1">
              {statusFilter ? "Tente outro filtro ou " : ""}
              <Link href="/campaigns/new" className="text-brand hover:underline">
                crie uma nova campanha
              </Link>
            </p>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={{
                  ...c,
                  goalAmount: Number(c.goalAmount),
                  collectedAmount: Number(c.collectedAmount),
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
