import { PagePlaceholder } from "@/components/PagePlaceholder";

export default function WithdrawPage() {
  return (
    <PagePlaceholder
      title="Solicitação de Saque"
      description="Solicitar transferência do saldo disponível para conta bancária cadastrada. Histórico de saques e status de processamento."
      icon="🏦"
      tags={["Saque", "Conta Bancária", "TED", "PIX"]}
    />
  );
}
