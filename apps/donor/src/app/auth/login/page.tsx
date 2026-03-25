import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function DonorLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-white">
      <div className="w-full max-w-sm">
        <PagePlaceholder
          title="Entrar via Magic Link"
          description="Acesse sua conta de doador com um link mágico enviado para seu e-mail. Sem senha para lembrar."
          icon="✉️"
          tags={["Magic Link", "E-mail", "Sem senha"]}
        />
      </div>
    </div>
  );
}
