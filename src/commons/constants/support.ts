import { getRequiredEnv } from "./env";

export const whatsappNumber = getRequiredEnv("NEXT_PUBLIC_SUPPORT_WHATSAPP");
export const SUPPORT_WHATSAPP_NUMBER = whatsappNumber;

