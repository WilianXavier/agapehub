import { PagePlaceholder } from "@/components/PagePlaceholder";

export default async function PaymentSuccessPage({ params }: { params: Promise<{ camp_uuid: string }> }) {
  const { camp_uuid } = await params;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-white">
      <div className="w-full max-w-md">
        <PagePlaceholder
          title="Doação Confirmada!"
          description={`Sua doação à campanha ${camp_uuid} foi recebida com sucesso. Conheça a opção de doação recorrente e maximize seu impacto.`}
          icon="🎉"
          tags={["Upsell", "Recorrência", "Compartilhar", "Recibo"]}
        />
      </div>
    </div>
  );
}
