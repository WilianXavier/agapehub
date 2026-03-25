import { PrismaClient, CampaignType, CampaignStatus, DonationStatus, PaymentMethod, MemberRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...\n");

  // ── Limpar dados anteriores ─────────────────────────
  await prisma.donation.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.member.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  console.log("🗑  Dados anteriores removidos");

  // ── Usuários ────────────────────────────────────────
  const admin = await prisma.user.create({
    data: { name: "Wilian Xavier",   email: "admin@agapehub.com.br" },
  });
  const treasurer = await prisma.user.create({
    data: { name: "Maria Tesoureira", email: "tesoureiro@agapehub.com.br" },
  });
  const leader = await prisma.user.create({
    data: { name: "João Líder",       email: "lider@agapehub.com.br" },
  });
  console.log("👤 Usuários criados: 3");

  // ── Organizações ─────────────────────────────────────
  const agape = await prisma.organization.create({
    data: {
      name: "Igreja Assembleia Ágape",
      slug: "assembleia-agape",
      logoUrl: null,
      plan: "PRO",
      members: {
        create: [
          { userId: admin.id,      role: MemberRole.ADMIN      },
          { userId: treasurer.id,  role: MemberRole.TREASURER  },
          { userId: leader.id,     role: MemberRole.LEADER     },
        ],
      },
    },
  });

  const grace = await prisma.organization.create({
    data: {
      name: "Grace Life Church",
      slug: "grace-life-church",
      plan: "TRIAL",
      members: {
        create: [{ userId: admin.id, role: MemberRole.ADMIN }],
      },
    },
  });
  console.log("🏛  Organizações criadas: 2 (assembleia-agape, grace-life-church)");

  // ── Campanhas — Assembleia Ágape ─────────────────────
  const reformaCampanha = await prisma.campaign.create({
    data: {
      organizationId: agape.id,
      slug: "reforma-templo-2025",
      title: "Reforma do Templo 2025",
      description: "Arrecadação para reforma completa do salão principal: pintura, piso e ar-condicionado.",
      goalAmount: 85000,
      collectedAmount: 52340,
      type: CampaignType.CAMPAIGN,
      status: CampaignStatus.ACTIVE,
      startsAt: new Date("2025-01-01"),
      endsAt: new Date("2025-12-31"),
    },
  });

  const missoesCampanha = await prisma.campaign.create({
    data: {
      organizationId: agape.id,
      slug: "missoes-2025",
      title: "Missões Nordeste 2025",
      description: "Apoie a equipe missionária que vai ao sertão do Piauí neste segundo semestre.",
      goalAmount: 30000,
      collectedAmount: 12900,
      type: CampaignType.CAMPAIGN,
      status: CampaignStatus.ACTIVE,
      startsAt: new Date("2025-06-01"),
      endsAt: new Date("2025-11-30"),
    },
  });

  const dizimoMensal = await prisma.campaign.create({
    data: {
      organizationId: agape.id,
      slug: "dizimo-mensal",
      title: "Dízimo Mensal",
      description: "Canal de contribuição do dízimo mensal dos membros.",
      goalAmount: 20000,
      collectedAmount: 18750,
      type: CampaignType.TITHE,
      status: CampaignStatus.ACTIVE,
    },
  });

  const ofertaDominical = await prisma.campaign.create({
    data: {
      organizationId: agape.id,
      slug: "oferta-dominical",
      title: "Oferta Dominical",
      description: "Oferta dos cultos dominicais.",
      goalAmount: 8000,
      collectedAmount: 5200,
      type: CampaignType.OFFER,
      status: CampaignStatus.ACTIVE,
    },
  });

  const campanhaRascunho = await prisma.campaign.create({
    data: {
      organizationId: agape.id,
      slug: "novo-ministerio-jovens",
      title: "Novo Ministério de Jovens",
      description: "Estruturação do ministério jovem: equipamentos de som e instrumentos.",
      goalAmount: 15000,
      collectedAmount: 0,
      type: CampaignType.CAMPAIGN,
      status: CampaignStatus.DRAFT,
    },
  });
  console.log("📢 Campanhas Ágape criadas: 5 (4 ativas, 1 rascunho)");

  // ── Campanha — Grace Life ─────────────────────────────
  await prisma.campaign.create({
    data: {
      organizationId: grace.id,
      slug: "construcao-sede",
      title: "Construção da Sede Própria",
      description: "Campanha para adquirir e construir a primeira sede própria da Grace Life Church.",
      goalAmount: 250000,
      collectedAmount: 43800,
      type: CampaignType.CAMPAIGN,
      status: CampaignStatus.ACTIVE,
      startsAt: new Date("2025-03-01"),
      endsAt: new Date("2026-03-01"),
    },
  });
  console.log("📢 Campanha Grace Life criada: 1");

  // ── Doações — Reforma do Templo ───────────────────────
  const doacoesReforma = [
    { amount: 500,   method: PaymentMethod.PIX,         donorName: "Carlos Souza",    donorEmail: "carlos@email.com",   status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 1000,  method: PaymentMethod.PIX,         donorName: "Ana Paula Silva", donorEmail: "ana@email.com",      status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 250,   method: PaymentMethod.CREDIT_CARD, donorName: "Roberto Lima",    donorEmail: "roberto@email.com",  status: DonationStatus.CONFIRMED, recurring: true  },
    { amount: 5000,  method: PaymentMethod.PIX,         donorName: "Empresa Cristã Ltda", donorEmail: null,            status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 150,   method: PaymentMethod.PIX,         donorName: "Maria José",      donorEmail: null,                 status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 3500,  method: PaymentMethod.CREDIT_CARD, donorName: "Pastor Elias",    donorEmail: "elias@igr.com",     status: DonationStatus.CONFIRMED, recurring: true  },
    { amount: 200,   method: PaymentMethod.BOLETO,      donorName: "Fernanda Costa",  donorEmail: "fe@email.com",       status: DonationStatus.PENDING,   recurring: false },
    { amount: 800,   method: PaymentMethod.PIX,         donorName: "Doador Anônimo",  donorEmail: null,                 status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 100,   method: PaymentMethod.PIX,         donorName: null,              donorEmail: null,                 status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 2500,  method: PaymentMethod.PIX,         donorName: "Grupo de Oração", donorEmail: null,                 status: DonationStatus.CONFIRMED, recurring: false },
  ];
  for (const d of doacoesReforma) {
    await prisma.donation.create({ data: { campaignId: reformaCampanha.id, ...d } });
  }
  console.log("💸 Doações — Reforma do Templo: 10");

  // ── Doações — Missões ─────────────────────────────────
  const doacoesMissoes = [
    { amount: 300,  method: PaymentMethod.PIX,         donorName: "Bruna Matos",    status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 500,  method: PaymentMethod.CREDIT_CARD, donorName: "Pr. Renato",     status: DonationStatus.CONFIRMED, recurring: true  },
    { amount: 1200, method: PaymentMethod.PIX,         donorName: "Célula Norte",   status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 200,  method: PaymentMethod.PIX,         donorName: "Anônimo",        status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 150,  method: PaymentMethod.BOLETO,      donorName: "Tiago Ferreira", status: DonationStatus.PENDING,   recurring: false },
  ];
  for (const d of doacoesMissoes) {
    await prisma.donation.create({ data: { campaignId: missoesCampanha.id, donorEmail: null, ...d } });
  }
  console.log("💸 Doações — Missões: 5");

  // ── Doações — Dízimo ──────────────────────────────────
  const doacoesDizimo = [
    { amount: 800,  method: PaymentMethod.PIX,         donorName: "Membro A",  status: DonationStatus.CONFIRMED, recurring: true  },
    { amount: 600,  method: PaymentMethod.PIX,         donorName: "Membro B",  status: DonationStatus.CONFIRMED, recurring: true  },
    { amount: 1200, method: PaymentMethod.CREDIT_CARD, donorName: "Membro C",  status: DonationStatus.CONFIRMED, recurring: true  },
    { amount: 450,  method: PaymentMethod.PIX,         donorName: "Membro D",  status: DonationStatus.CONFIRMED, recurring: true  },
    { amount: 350,  method: PaymentMethod.PIX,         donorName: "Membro E",  status: DonationStatus.CONFIRMED, recurring: false },
  ];
  for (const d of doacoesDizimo) {
    await prisma.donation.create({ data: { campaignId: dizimoMensal.id, donorEmail: null, ...d } });
  }
  console.log("💸 Doações — Dízimo: 5");

  // ── Doações — Oferta Dominical ────────────────────────
  const doacoesOferta = [
    { amount: 120, method: PaymentMethod.PIX, donorName: null, status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 80,  method: PaymentMethod.PIX, donorName: null, status: DonationStatus.CONFIRMED, recurring: false },
    { amount: 200, method: PaymentMethod.PIX, donorName: null, status: DonationStatus.CONFIRMED, recurring: false },
  ];
  for (const d of doacoesOferta) {
    await prisma.donation.create({ data: { campaignId: ofertaDominical.id, donorEmail: null, ...d } });
  }
  console.log("💸 Doações — Oferta: 3");

  // ── Resumo ─────────────────────────────────────────────
  const totalOrgs  = await prisma.organization.count();
  const totalCamps = await prisma.campaign.count();
  const totalDoas  = await prisma.donation.count();

  console.log("\n✅ Seed concluído!");
  console.log(`   🏛  ${totalOrgs} organizações`);
  console.log(`   📢 ${totalCamps} campanhas`);
  console.log(`   💸 ${totalDoas} doações`);
  console.log("\n🔗 Acesse o banco: npx prisma studio");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
