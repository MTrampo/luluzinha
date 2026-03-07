import { MercadoPagoConfig, PreApproval, PreApprovalPlan } from 'mercadopago';

export const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export const clientPreAproval = new PreApproval(client);
export const clientPreApprovalPlan = new PreApprovalPlan(client);

export const secret = process.env.MP_WEBHOOK_SECRET;