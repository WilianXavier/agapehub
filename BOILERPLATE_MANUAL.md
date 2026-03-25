# BOILERPLATE MANUAL — ÁgapeHub

> **Objetivo:** Manual técnico oficial da plataforma ÁgapeHub. Documenta a arquitetura do monorepo, o fluxo de design, as etapas de build e todas as decisões técnicas tomadas ao longo do projeto.
>
> **Produto:** Plataforma de doações online para igrejas e organizações religiosas.
> **URLs:** `app.agapehub.com.br` (painel admin) · `doe.agapehub.com.br` (vitrine do doador)

---

## PRÉ-REQUISITOS

Instale antes de começar:

| Ferramenta | Versão mínima | Como instalar |
|---|---|---|
| **Node.js** | v20+ | [nodejs.org](https://nodejs.org) |
| **pnpm** | v9+ | `npm install -g pnpm` |
| **Git** | v2+ | [git-scm.com](https://git-scm.com) |
| **GitHub CLI** | v2+ | `brew install gh` ou [cli.github.com](https://cli.github.com) |
| **Vercel CLI** | latest | `npm install -g vercel` |

Verificar instalação:
```bash
node --version    # v20+
pnpm --version    # v9+
git --version     # v2+
gh --version      # v2+
vercel --version  # qualquer versão recente
```

Contas necessárias:
- [GitHub](https://github.com) — repositório (`WilianXavier/agapehub`)
- [Vercel](https://vercel.com) — dois projetos: `agapehub-admin` e `agapehub-donor`
- [Neon](https://neon.tech) — banco PostgreSQL serverless *(Etapa 1 — PRIORIDADE)*
- [Stripe](https://dashboard.stripe.com) — pagamentos *(Pendente — Etapa 5)*
- [Resend](https://resend.com) — e-mails transacionais *(Pendente — Etapa 2)*

---

## STATUS DAS ETAPAS

| Etapa | Descrição | Status |
|---|---|---|
| **0 — Infraestrutura** | Monorepo, GitHub, Vercel, dois apps no ar | ✅ Concluído |
| **1 — Banco de Dados** | Neon + Prisma, schema de campanhas | ✅ **Concluído** |
| **2 — Autenticação** | NextAuth v5, Magic Link, OAuth | ⏳ Pendente |
| **3 — Trial e Acesso** | Lógica de plano, banner trial | 🗺️ Roadmap |
| **4 — Paywall e Limites** | PaywallGate, limites por plano | 🗺️ Roadmap |
| **5 — Stripe** | Checkout, webhook, Customer Portal | ⏳ Pendente |
| **6 — Features P1** | CRUD campanhas, cockpit financeiro | 🟡 Em andamento |
| **7 — Landing Page** | `doe.agapehub.com.br/explore` | 🗺️ Roadmap |
| **8 — Storybook** | Design system completo e documentado | ✅ Base concluída |

---

## ETAPAS DE BUILD (ordem obrigatória)

### ETAPA 0 — INFRAESTRUTURA ✅

1. Monorepo criado com Turborepo + pnpm workspaces
2. Repositório: `github.com/WilianXavier/agapehub`
3. Dois projetos Vercel conectados ao branch `master`:
   - `agapehub-admin` → `apps/admin`
   - `agapehub-donor` → `apps/donor`
4. Deploy automático: cada `push master` → deploy em ambos
5. Design system base em `packages/ui` com Storybook
6. Tema visual: Figma Variables DS 2026.v1 → `tokens.css`

---

### ETAPA 1 — BANCO DE DADOS (Neon + Prisma) ✅ CONCLUÍDO

Criar o schema Prisma com as entidades iniciais do produto:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ── Organização (church / NGO) ─────────────────────────
model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  logoUrl   String?
  plan      Plan     @default(FREE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members    Member[]
  campaigns  Campaign[]
}

// ── Usuário da plataforma ──────────────────────────────
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())

  memberships Member[]
  // Auth.js padrão:
  accounts    Account[]
  sessions    Session[]
}

// ── Membro de uma organização ──────────────────────────
model Member {
  id             String       @id @default(cuid())
  role           MemberRole   @default(LEADER)
  organizationId String
  userId         String

  organization Organization @relation(fields: [organizationId], references: [id])
  user         User         @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
}

// ── Campanha de arrecadação ────────────────────────────
model Campaign {
  id             String         @id @default(cuid())
  slug           String
  title          String
  description    String?
  goalAmount     Decimal        @db.Decimal(12, 2)
  collectedAmount Decimal       @default(0) @db.Decimal(12, 2)
  type           CampaignType   @default(CAMPAIGN)
  status         CampaignStatus @default(DRAFT)
  startsAt       DateTime?
  endsAt         DateTime?
  coverUrl       String?
  organizationId String
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id])
  donations    Donation[]

  @@unique([organizationId, slug])
}

// ── Doação individual ─────────────────────────────────
model Donation {
  id         String        @id @default(cuid())
  amount     Decimal       @db.Decimal(12, 2)
  status     DonationStatus @default(PENDING)
  method     PaymentMethod  @default(PIX)
  recurring  Boolean        @default(false)
  donorName  String?
  donorEmail String?
  campaignId String
  createdAt  DateTime       @default(now())

  campaign Campaign @relation(fields: [campaignId], references: [id])
}

// ── Auth.js padrão ─────────────────────────────────────
model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
}

model Session {
  sessionToken String   @id
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}

// ── Enums ──────────────────────────────────────────────
enum Plan {
  FREE
  TRIAL
  PRO
}

enum MemberRole {
  ADMIN
  TREASURER
  LEADER
}

enum CampaignType {
  TITHE      // Dízimo
  OFFER      // Oferta
  CAMPAIGN   // Campanha específica
}

enum CampaignStatus {
  DRAFT
  ACTIVE
  PAUSED
  FINISHED
  ARCHIVED
}

enum DonationStatus {
  PENDING
  CONFIRMED
  FAILED
  REFUNDED
}

enum PaymentMethod {
  PIX
  CREDIT_CARD
  BOLETO
}
```

Configurar e rodar as migrations:
```bash
# 1. Instalar Prisma
pnpm add -D prisma --filter @agapehub/admin
pnpm add @prisma/client --filter @agapehub/admin

# 2. Criar schema e rodar migration
pnpm --filter @agapehub/admin exec prisma migrate dev --name init

# 3. Gerar o client
pnpm --filter @agapehub/admin exec prisma generate
```

> **Onde fica o Prisma?** No app `apps/admin`, pois é o único que escreve no banco.
> O app `apps/donor` consome apenas via API Routes do admin (ou futuramente via tRPC).

---

### ETAPA 2 — AUTENTICAÇÃO ⏳ Pendente

> **Não implemente ainda.** O mock de auth atual (`AuthContext`) é suficiente para desenvolver todas as features P1 (CRUD de campanhas). A autenticação real será adicionada quando tivermos o banco pronto e os primeiros CRUDs funcionando.

Quando chegar a hora:
- **Provedor:** NextAuth v5 (Auth.js)
- **Métodos:** Magic Link via Resend + Google OAuth
- **Proteção:** Middleware em `apps/admin/middleware.ts`
- **Mock atual:** `apps/admin/src/context/AuthContext.tsx` — login instantâneo como Admin / Tesoureiro / Líder

---

### ETAPA 3 — TRIAL E ACESSO 🗺️ Roadmap

> Implementar apenas após auth real estar funcionando.

Funções em `apps/admin/src/lib/subscription.ts`:
- `isTrialActive(user)` → `trialEndsAt > now && plan === TRIAL`
- `isSubscribed(user)` → `plan === PRO && stripeCurrentPeriodEnd > now`
- `hasAccess(user)` → `isTrialActive || isSubscribed`
- `daysLeftInTrial(user)` → dias restantes no trial

Fluxo planejado:
1. Primeiro login → `plan = TRIAL`, `trialEndsAt = now + 14 dias`
2. Trial ativo → acesso total + banner "X dias restantes"
3. Trial expirado → bloqueado → redirect `/pricing`
4. Pagamento → `plan = PRO` → acesso total
5. Cancelamento → acesso até fim do período pago

---

### ETAPA 4 — PAYWALL E LIMITES 🗺️ Roadmap

> Implementar após Etapa 3.

```ts
// Limites por plano (planejado)
const PLAN_LIMITS = {
  FREE:  { campaigns: 1,  members: 2,  donations: 50   },
  TRIAL: { campaigns: 99, members: 99, donations: 9999 },
  PRO:   { campaigns: 99, members: 99, donations: 9999 },
};
```

Componente `<PaywallGate>` que bloqueia a feature com CTA de upgrade.

---

### ETAPA 5 — STRIPE ⏳ Pendente

> Implementar após auth real.

- Checkout Session (subscription mensal)
- Customer Portal (gerenciar / cancelar)
- Webhooks: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted/updated`
- Página `/settings/billing`

**Nota importante:** O checkout Stripe **não define** `trial_period_days` em `subscription_data`. O usuário TRIAL pode fazer upgrade imediato passando o cartão e vira PRO na hora.

---

### ETAPA 6 — FEATURES P1 (após Etapa 1)

Ordem sugerida de implementação dos fluxos, um prompt por fluxo:

| Prioridade | Rota | Fluxo |
|---|---|---|
| P1 | `admin/campaigns/new` | Wizard de criação de campanha |
| P1 | `admin/campaigns` | Listagem e gestão de estados |
| P1 | `admin/campaigns/[id]/overview` | Monitoramento burn-up |
| P1 | `donor/[org_slug]/[camp_slug]` | Detalhe da campanha (público) |
| P1 | `donor/pay/[camp_uuid]` | Guest checkout (Pix primeiro) |
| P2 | `admin/financial/dashboard` | Cockpit financeiro |
| P2 | `admin/financial/withdraw` | Solicitação de saque |
| P2 | `donor/my/donations` | Central do doador |
| P3 | `admin/compliance/kyc` | Validação KYC |
| P3 | `donor/my/impact` | Painel de impacto |
| P3 | `donor/[org_slug]/[camp_slug]/ranking` | Leaderboard |

---

## STACK TÉCNICA

| Tecnologia | Função | Versão |
|---|---|---|
| **Next.js** | Framework full-stack (App Router) | 15 |
| **Turborepo** | Orquestrador do monorepo | latest |
| **pnpm** | Gerenciador de pacotes + workspaces | 9+ |
| **TypeScript** | Tipagem estrita | 5+ |
| **Tailwind CSS** | Estilização via CSS Variables + `@theme` | v4 |
| **Prisma** | ORM + migrations | ^6 *(Etapa 1)* |
| **Neon** | PostgreSQL serverless | — *(Etapa 1)* |
| **NextAuth v5** | Autenticação | *(Etapa 2)* |
| **Stripe** | Pagamentos e assinaturas | *(Etapa 5)* |
| **Resend** | E-mails transacionais | *(Etapa 2)* |
| **Storybook** | Documentação do Design System | 8+ |
| **Montserrat** | Tipografia (via `next/font/google`) | — |

---

## HOSPEDAGEM

| Serviço | Função | Tier |
|---|---|---|
| Vercel | Hosting dos dois apps | Free / Pro |
| Neon | PostgreSQL serverless | Free (0.5 GB) |
| GitHub | Repositório + CI implícito | Free |
| Resend | Magic Links e notificações | Free (3k/mês) |
| Stripe | Pagamentos | Test mode → Produção |

---

## ESTRUTURA DE PASTAS

```
agapehub/                          ← raiz do monorepo
├── apps/
│   ├── admin/                     ← app.agapehub.com.br
│   │   ├── prisma/
│   │   │   └── schema.prisma      ← Etapa 1
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (dashboard)/   ← rotas protegidas (layout com sidebar)
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── home/
│   │   │   │   │   ├── campaigns/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       ├── edit/page.tsx
│   │   │   │   │   │       └── overview/page.tsx
│   │   │   │   │   ├── financial/
│   │   │   │   │   │   ├── dashboard/page.tsx
│   │   │   │   │   │   └── withdraw/page.tsx
│   │   │   │   │   ├── compliance/
│   │   │   │   │   │   └── kyc/page.tsx
│   │   │   │   │   └── register/page.tsx
│   │   │   │   ├── login/page.tsx ← mock auth (substituir na Etapa 2)
│   │   │   │   ├── globals.css    ← @import tailwindcss + tokens.css
│   │   │   │   └── layout.tsx     ← Montserrat via next/font
│   │   │   ├── components/
│   │   │   │   └── PagePlaceholder.tsx
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx ← mock auth (remover na Etapa 2)
│   │   │   └── lib/
│   │   │       └── auth.ts         ← tipos de Role
│   │   ├── next.config.ts
│   │   ├── postcss.config.mjs      ← @tailwindcss/postcss
│   │   └── package.json
│   │
│   └── donor/                     ← doe.agapehub.com.br
│       ├── src/
│       │   ├── app/
│       │   │   ├── explore/page.tsx
│       │   │   ├── [org_slug]/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [camp_slug]/
│       │   │   │       ├── page.tsx
│       │   │   │       └── ranking/page.tsx
│       │   │   ├── pay/
│       │   │   │   └── [camp_uuid]/
│       │   │   │       ├── page.tsx
│       │   │   │       └── success/page.tsx
│       │   │   ├── auth/login/page.tsx
│       │   │   ├── my/
│       │   │   │   ├── donations/page.tsx
│       │   │   │   └── impact/page.tsx
│       │   │   ├── globals.css    ← @import tailwindcss + tokens.css
│       │   │   └── layout.tsx     ← Montserrat via next/font
│       │   └── components/
│       │       ├── DonorHeader.tsx
│       │       └── PagePlaceholder.tsx
│       ├── next.config.ts
│       ├── postcss.config.mjs
│       └── package.json
│
├── packages/
│   └── ui/                        ← Design System compartilhado
│       ├── .storybook/
│       │   ├── main.ts            ← viteFinal: @tailwindcss/vite
│       │   └── preview.ts         ← importa storybook.css + backgrounds
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button.tsx     ← variantes: primary, secondary, ghost, danger
│       │   │   ├── Button.stories.tsx
│       │   │   ├── Badge.tsx      ← 10 cores semânticas do DS
│       │   │   ├── Badge.stories.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Logo.tsx       ← SVG com var(--color-brand)
│       │   │   └── Logo.stories.tsx
│       │   ├── tokens.css         ← ⭐ FONTE DA VERDADE DOS TOKENS
│       │   ├── storybook.css      ← Google Fonts + tailwindcss + tokens
│       │   └── index.ts           ← exports públicos
│       └── package.json
│
├── turbo.json                     ← pipeline: build → lint → typecheck
├── pnpm-workspace.yaml
├── package.json                   ← packageManager: pnpm@9.x.x
└── BOILERPLATE_MANUAL.md          ← este arquivo
```

---

## FLUXO DE DESIGN — FIGMA → CÓDIGO

```
Figma DS 2026.v1
└── Variables (4 coleções principais)
    ├── Nível 1 — Radix Colors (Primitivos)     ← não usamos diretamente
    ├── Nível 2 — Org-colors (por organização)  ← paletas por cliente
    ├── Nível 3 — Ahub Theme (Semântica SaaS)   ← fonte da verdade ✅
    └── 004–010 — Sizing, Radius, Typography    ← dimensões e tipo ✅
          │
          ▼ (extração via Figma MCP)
packages/ui/src/tokens.css
└── @theme { ... }                              ← Tailwind v4 theme block
    ├── --color-brand / --color-brand-hover / --color-brand-subtle ...
    ├── --color-fg / --color-fg-2 / --color-fg-muted / --color-fg-disabled
    ├── --color-canvas / --color-surface / --color-surface-2 / --color-surface-inv
    ├── --color-border / --color-border-2 / --color-border-3
    ├── --color-success[-tint|-solid|-fg|-border]
    ├── --color-info[-tint|-solid|-fg|-border]
    ├── --color-warning[-tint|-solid|-fg|-border]
    ├── --color-error[-tint|-solid|-fg|-border]
    ├── --color-tithe / --color-offer / --color-campaign / --color-donors
    │     (cada um com -tint / -solid / -fg / -border)
    ├── --color-chart-1 ... --color-chart-8
    ├── --radius-xs / -sm / -md / -lg / -xl / -2xl / -full
    │     (responsive: mobile Compact → desktop Expand via @media lg)
    ├── --breakpoint-sm(360) / -md(768) / -lg(1024) / -xl(1440) / -2xl(1560)
    └── --font-sans: 'Montserrat', ui-sans-serif
          │
          ▼ (via @import em globals.css)
apps/admin/src/app/globals.css
apps/donor/src/app/globals.css
packages/ui/src/storybook.css
          │
          ▼ (Tailwind gera utilitários automaticamente)
bg-brand · text-fg-muted · border-border · rounded-md
bg-success-tint · text-error-fg · bg-tithe-tint · text-campaign ...
```

### Convenção de nomes de tokens

| Padrão | Gera utilitário Tailwind | Uso |
|---|---|---|
| `--color-brand` | `bg-brand`, `text-brand`, `border-brand` | Cor primária da plataforma |
| `--color-{status}-tint` | `bg-{status}-tint` | Background suave de feedback |
| `--color-{status}-solid` | `bg-{status}-solid` | Background sólido escuro |
| `--color-{status}-fg` | `text-{status}-fg` | Texto acessível para status |
| `--color-{status}-border` | `border-{status}-border` | Borda de feedback |
| `--color-fg-muted` | `text-fg-muted` | Texto secundário / placeholder |
| `--color-canvas` | `bg-canvas` | Fundo principal (branco off) |
| `--color-surface` | `bg-surface` | Fundo de página (cinza claro) |
| `--radius-md` | `rounded-md` | Raio responsivo (8px mobile → 12px desktop) |

### Como atualizar tokens do Figma

```bash
# 1. Abra o arquivo Figma no desktop
# 2. No Claude Code, use o Figma MCP:
#    mcp__figma__use_figma com o fileKey do DS
# 3. Execute o script de extração de variables
# 4. Atualize packages/ui/src/tokens.css
# 5. Commit: "chore: sync Figma tokens YYYY-MM-DD"
```

---

## COMANDOS

```bash
# ── Desenvolvimento ────────────────────────────────────────────────
pnpm dev                   # admin (:3000) + donor (:3001) em paralelo
pnpm --filter @agapehub/admin dev    # apenas admin
pnpm --filter @agapehub/donor dev    # apenas donor

# ── Design System ──────────────────────────────────────────────────
pnpm --filter @agapehub/ui storybook  # Storybook na porta :6006

# ── Build ──────────────────────────────────────────────────────────
pnpm build                            # build de todos os apps via Turbo
pnpm --filter @agapehub/admin build   # build apenas admin
pnpm --filter @agapehub/donor build   # build apenas donor

# ── Banco de dados (Etapa 1) ───────────────────────────────────────
pnpm --filter @agapehub/admin exec prisma migrate dev --name <nome>
pnpm --filter @agapehub/admin exec prisma generate
pnpm --filter @agapehub/admin exec prisma studio   # GUI local do banco

# ── Instalação ─────────────────────────────────────────────────────
pnpm install                          # instala todas as dependências
pnpm add <pkg> --filter @agapehub/admin   # add em app específico
pnpm add <pkg> --filter @agapehub/ui      # add no design system
```

---

## VARIÁVEIS DE AMBIENTE

### `apps/admin/.env.local`
```env
# ── Banco (Neon) ───────────── Etapa 1 (PRIORIDADE)
DATABASE_URL=postgresql://...

# ── Auth ───────────────────── Etapa 2 (Pendente)
AUTH_SECRET=              # openssl rand -base64 32
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_RESEND_KEY=

# ── Stripe ─────────────────── Etapa 5 (Pendente)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=

# ── App ────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DONOR_URL=http://localhost:3001
```

### `apps/donor/.env.local`
```env
# ── App ────────────────────────────────────────────
NEXT_PUBLIC_ADMIN_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## ARQUITETURA SaaS — MODELO DE NEGÓCIO

> Esta seção descreve o modelo completo. As etapas 3 e 4 são roadmap futuro.

### Quem são os clientes?

| Ator | App | Descrição |
|---|---|---|
| **Administrador** | Admin | Dono da organização. Cadastra, configura, saca. |
| **Tesoureiro** | Admin | Acesso financeiro. Acompanha e solicita saques. |
| **Líder** | Admin | Cria e monitora campanhas. |
| **Doador** | Donor | Descobre campanhas, doa, acompanha impacto. |

### Planos (Roadmap — Etapas 3–5)

| Plano | Limite campanhas | Limit membros | Valor |
|---|---|---|---|
| **FREE** | 1 ativa | 2 membros | Gratuito |
| **TRIAL** | Ilimitado | Ilimitado | 14 dias grátis |
| **PRO** | Ilimitado | Ilimitado | R$ X/mês |

### Fluxo de onboarding planejado

```
Cadastro →  TRIAL (14 dias, acesso total)
              ↓ trial ativo
           Banner "X dias restantes" + botão Upgrade
              ↓ trial expirado
           Bloqueado → /pricing → Checkout Stripe → PRO
              ↓ PRO ativo
           Acesso total | Portal Stripe (gerenciar/cancelar)
              ↓ cancelamento
           Acesso até fim do período pago → FREE
```

---

## DECISÕES TÉCNICAS

> Registro vivo. Toda decisão relevante deve ser documentada aqui.

1. **Monorepo Turborepo + pnpm workspaces** — Uma única raiz gerencia os dois apps e o design system. `turbo build` paraleliza e cacheia os builds.

2. **Dois apps separados (admin vs donor)** — Domínios distintos (`app.*` e `doe.*`), deploys independentes na Vercel, sem interferência de bundle.

3. **Tailwind v4 com `@theme`** — Sem `tailwind.config.ts`. A configuração é 100% CSS, via `@theme { }` no `tokens.css`. Cada variável CSS gera utilitários automaticamente (`--color-brand` → `bg-brand`, `text-brand`, `border-brand`).

4. **`@tailwindcss/postcss` nos apps** — PostCSS resolve `@import` com caminhos relativos (incluindo o import cross-package `../../../../packages/ui/src/tokens.css`).

5. **`@tailwindcss/vite` no Storybook** — Storybook usa Vite. O plugin é injetado via `viteFinal` em `main.ts`.

6. **Montserrat via `next/font/google`** — Carregamento otimizado pelo Next.js (sem layout shift). O `variable: '--font-sans'` sobrescreve o fallback do `@theme` com a URL da fonte hospedada.

7. **Tokens com padrão `{status}-{role}`** — Evita duplo prefixo (`bg-bg-success` era ruim). Padrão atual: `--color-success-tint`, `--color-success-fg`, `--color-success-solid`, `--color-success-border`.

8. **Mock Auth em `AuthContext`** — Login instantâneo sem provedor externo. Permite desenvolver todos os fluxos P1 sem travar na infraestrutura de auth. Substituir na Etapa 2.

9. **Prisma em `apps/admin` apenas** — O app donor não tem acesso direto ao banco. Consome dados via API Routes do admin. Futuramente, pode migrar para tRPC ou route handlers compartilhados.

10. **`packageManager` explícito em `package.json`** — Turborepo exige o campo `packageManager: "pnpm@x.x.x"` para resolver workspaces corretamente.

11. **Next.js 15: `params` como `Promise`** — Todas as páginas com rotas dinâmicas (`[id]`, `[org_slug]`, etc.) são `async function` e fazem `const { id } = await params`.

12. **Figma MCP para extração de tokens** — Usamos `mcp__figma__use_figma` com JavaScript da Plugin API para extrair todas as variáveis e resolver aliases recursivamente. O resultado é transformado manualmente em `tokens.css`.

13. **Breakpoints do Figma (não os do Tailwind padrão)** — `sm:360px md:768px lg:1024px xl:1440px 2xl:1560px`. Sobrescreve os defaults do Tailwind via `--breakpoint-*` em `@theme`.

14. **Radius responsivo via `@media`** — O `@theme` define os valores mobile (Compact). Um `@media (min-width: 1024px)` no mesmo arquivo sobrescreve para desktop (Expand), sem precisar de classes `lg:rounded-*`.

---

## REFERÊNCIAS

| Recurso | URL |
|---|---|
| Figma DS 2026.v1 | `figma.com/design/3EudfKiEKbV23qPkbZj3sA` |
| GitHub | `github.com/WilianXavier/agapehub` |
| Vercel Admin | `agapehub-admin-*.vercel.app` |
| Vercel Donor | `agapehub-donor-*.vercel.app` |
| Neon | `console.neon.tech` *(criar na Etapa 1)* |
| Tailwind v4 Docs | `tailwindcss.com/docs` |
| Next.js 15 Docs | `nextjs.org/docs` |
| Turborepo Docs | `turbo.build/repo/docs` |
| Prisma Docs | `prisma.io/docs` |
| Auth.js v5 | `authjs.dev` |
| Stripe API | `stripe.com/docs/api` |
