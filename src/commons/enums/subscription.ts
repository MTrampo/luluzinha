export enum MercadoPagoStatusEnum {
  Pending = 'pending',       // Criada, mas o usuário ainda não pagou
  Authorized = 'authorized', // Pagamento aprovado e assinatura ativa
  Paused = 'paused',         // Suspensão temporária (pelo usuário ou falha de cartão)
  Cancelled = 'cancelled',   // Cancelada definitivamente
  Rejected = 'rejected',     // Pagamento recusado
}