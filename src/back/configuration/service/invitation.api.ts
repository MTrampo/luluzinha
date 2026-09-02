import { ApiResponse } from "@/commons/lib/http/responses";
import { getInvitationByTokenSupabase, consumeInvitationSupabase, createInvitationSupabase } from "../repository/invitation.supabase";
import { getPlanConfigBySlugSupabase } from "../repository/plan.supabase";
import { invitationFormatter, PlanInvitationFormatted } from "@/commons/models/invitation";
import { planFormatter } from "@/commons/models/plan";


export async function validateInvitationTokenApi(token: string) {
  if (!token || typeof token !== 'string') {
    return ApiResponse.BadRequest({
      message: "Código de convite inválido ou ausente."
    });
  }

  const { data: invitation, error } = await getInvitationByTokenSupabase(token);

  if (error || !invitation) {
    return ApiResponse.NotFound({
      message: "Este convite não foi encontrado."
    });
  }

  // Buscar plano vinculado
  const { data: planData } = await getPlanConfigBySlugSupabase(invitation.plan_slug);
  const planFormatted = planData ? planFormatter(planData) : null;
  const formatted = invitationFormatter(invitation, planFormatted);

  if (!formatted.isActive || formatted.usedCount >= formatted.maxUses) {
    return ApiResponse.BadRequest({
      message: "Este convite VIP já foi utilizado por outra Luluzinha ou expirou.",
      error: "convite_indisponivel"
    });
  }

  if (formatted.isExpired) {
    return ApiResponse.BadRequest({
      message: "Este convite VIP expirou após o prazo limite de 24 horas.",
      error: "convite_expirado"
    });
  }

  if (!planData || !planData.is_active) {
    return ApiResponse.BadRequest({
      message: "O plano vinculado a este convite não está ativo no momento.",
      error: "plano_inativo"
    });
  }

  return ApiResponse.Ok<PlanInvitationFormatted>({
    message: "Convite válido com sucesso.",
    data: formatted
  });
}

export async function consumeInvitationApi(invitationId: string, userId: string) {
  const { data, error } = await consumeInvitationSupabase(invitationId, userId);

  if (error || !data) {
    return ApiResponse.InternalError({
      message: "Falha ao registrar uso do convite.",
      error: error?.message
    });
  }

  return ApiResponse.Ok<PlanInvitationFormatted>({
    message: "Convite consumido com sucesso.",
    data: invitationFormatter(data)
  });
}

export async function generateInvitationApi(params: {
  planSlug?: string;
  recipientName?: string;
  recipientEmail?: string;
  expiresInHours?: number;
}) {
  const planSlug = params.planSlug || 'alpha-parceira';
  // Gerar token aleatório amigável e seguro: alp_ + 8 caracteres alfanuméricos
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const token = `alp_${randomSuffix}`;

  const { data, error } = await createInvitationSupabase({
    token,
    planSlug,
    recipientName: params.recipientName,
    recipientEmail: params.recipientEmail,
    expiresInHours: params.expiresInHours ?? 24, // 24 horas (1 dia)
  });

  if (error || !data) {
    return ApiResponse.InternalError({
      message: "Erro ao criar convite.",
      error: error?.message
    });
  }


  return ApiResponse.Created({
    message: "Convite criado com sucesso.",
    data: invitationFormatter(data)
  });
}
