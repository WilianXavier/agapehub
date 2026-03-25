import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function GuestCheckoutPage({ params }: { params: { camp_uuid: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <PagePlaceholder
          title="Fazer Doação"
          description={`Checkout rápido para a campanha ${params.camp_uuid}. Pix, cartão de crédito e boleto. Sem necessidade de conta.`}
          icon="💳"
          tags={["Pix", "Cartão", "Guest", "Recorrência"]}
        />
      </div>
    </div>
  );
}
