import { 
  createWaitlistEntrySupabase, 
  findWaitlistEntryByContactSupabase,
  listWaitlistSupabase 
} from "../repository/waitlist.supabase";
import { WaitlistCreateInput, WaitlistFormatted } from "@/commons/models/waitlist";
import { HttpStatusEnum } from "@/commons/enums/http";

export async function joinWaitlistApi(input: WaitlistCreateInput) {
  const trimmedName = input.name?.trim();
  const trimmedPhone = input.phone?.trim() || null;
  const trimmedEmail = input.email?.trim() || null;

  if (!trimmedName || trimmedName.length < 2) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Por favor, informe seu nome para entrar na Lista de Espera.",
      data: null,
    };
  }

  if (!trimmedPhone && !trimmedEmail) {
    return {
      status: HttpStatusEnum.BadRequest,
      message: "Por favor, informe seu WhatsApp ou E-mail para que possamos avisar você.",
      data: null,
    };
  }

  // Verifica se já está cadastrada na lista
  const { data: existing } = await findWaitlistEntryByContactSupabase({
    phone: trimmedPhone,
    email: trimmedEmail,
  });

  if (existing) {
    return {
      status: HttpStatusEnum.Ok,
      message: "Você já está cadastrada na nossa Lista de Espera VIP! Avisaremos você com prioridade assim que o Beta Público for liberado.",
      data: {
        id: existing.id,
        name: existing.name,
        phone: existing.phone,
        email: existing.email,
        origin: existing.origin,
        status: existing.status,
        createdAt: existing.created_at,
      } as WaitlistFormatted,
    };
  }

  const { data, error } = await createWaitlistEntrySupabase({
    name: trimmedName,
    phone: trimmedPhone,
    email: trimmedEmail,
    origin: input.origin || "landing_pricing",
    notes: input.notes,
  });

  if (error || !data) {
    return {
      status: HttpStatusEnum.InternalServerError,
      message: "Não foi possível salvar seus dados na Lista de Espera. Tente novamente em instantes.",
      data: null,
    };
  }

  const formatted: WaitlistFormatted = {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    origin: data.origin,
    status: data.status,
    createdAt: data.created_at,
  };

  return {
    status: HttpStatusEnum.Created,
    message: "Prontinho! Seu nome foi adicionado à Lista de Espera VIP da Luluzinha.",
    data: formatted,
  };
}

export async function getWaitlistApi() {
  const { data, error } = await listWaitlistSupabase();

  if (error || !data) {
    return {
      status: HttpStatusEnum.InternalServerError,
      message: "Erro ao buscar lista de espera.",
      data: [],
    };
  }

  const formatted: WaitlistFormatted[] = data.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email,
    origin: item.origin,
    status: item.status,
    createdAt: item.created_at,
  }));

  return {
    status: HttpStatusEnum.Ok,
    message: "Lista de espera recuperada com sucesso.",
    data: formatted,
  };
}
