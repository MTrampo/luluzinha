'use client'

import { checkSlugAvailabilityAction, updateEstablishmentAction } from "@/actions/establishment";
import { createProfileUserAction } from "@/actions/auth";
import { useEstablishmentStore } from "@/store/use-establishment";
import { useProfileStore } from "@/store/use-profile";
import { HttpStatusEnum } from "@/commons/enums/http";
import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { slugify } from "@/commons/utils/format";
import { ESTABLISHMENT_AVAILABLE_ICONS } from "@/commons/constants/establishment";
import { cn } from "@/commons/lib/tw-merge";
import { FaCheck, FaArrowsRotate, FaArrowLeftLong } from "react-icons/fa6";
import { useStepper } from "../onboarding-steps";
import { onboardingEstablishmentFormSchema } from "@/commons/validations/establishment";
import { OnboardingEstablishmentFormInputs as EstablishmentFormInputs } from "@/commons/models/establishment";
import { FaCheckCircle } from "react-icons/fa";

export function EstablishmentStep() {
  const stepper = useStepper();
  const [isPending, startTransition] = useTransition();

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const activeEstablishment = useEstablishmentStore((state) => state.activeEstablishment);
  const setEstablishments = useEstablishmentStore((state) => state.setEstablishments);
  const setActiveEstablishment = useEstablishmentStore((state) => state.setActiveEstablishment);

  const profileMeta = stepper.metadata.get("profile") as { name: string } | undefined;
  const estMeta = stepper.metadata.get("establishment") as Partial<EstablishmentFormInputs> | undefined;

  const defaultName = estMeta?.name ?? (
    activeEstablishment?.name && activeEstablishment.name !== "Minha Bancada" && activeEstablishment.name !== "Meu Espaço"
      ? activeEstablishment.name
      : (profileMeta?.name ? profileMeta.name : "")
  );

  const defaultSlug = estMeta?.slug ?? (
    activeEstablishment?.slug && !activeEstablishment.slug.startsWith("bancada-temp-") && !activeEstablishment.slug.startsWith("espaco-temp-")
      ? activeEstablishment.slug
      : (profileMeta?.name ? slugify(`espaco-${profileMeta.name}`) : "")
  );

  const form = useForm<EstablishmentFormInputs>({
    resolver: zodResolver(onboardingEstablishmentFormSchema),
    defaultValues: {
      name: defaultName,
      slug: defaultSlug,
      avatarUrl: estMeta?.avatarUrl ?? activeEstablishment?.avatarUrl ?? 'FaPaintbrush',
      phone: estMeta?.phone ?? activeEstablishment?.phone ?? '',
      address: estMeta?.address ?? activeEstablishment?.address ?? ''
    }
  });

  const [slugIsChecking, setSlugIsChecking] = useState(false);
  const [slugError, setSlugError] = useState('');

  const handlePrevStep = () => {
    stepper.metadata.set("establishment", form.getValues());
    stepper.navigation.prev();
  };

  const formatPhone = (val: string) => {
    let clean = val.replace(/\D/g, "");
    if (clean.length > 11) clean = clean.slice(0, 11);

    let formatted = clean;
    if (clean.length > 0) {
      formatted = "(" + clean.slice(0, 2);
      if (clean.length > 2) {
        formatted += ") " + clean.slice(2, 7);
        if (clean.length > 7) {
          formatted += "-" + clean.slice(7);
        }
      }
    }
    return formatted;
  };

  const onSubmit = (data: EstablishmentFormInputs) => {
    if (!activeEstablishment?.id) {
      toast.error("Falha ao localizar seu estabelecimento temporário. Tente recarregar a página.");
      return;
    }

    const profileData = stepper.metadata.get("profile") as { name: string; avatarUrl: string } | undefined;
    if (!profileData?.name) {
      toast.error("Por favor, volte e defina seu nome e avatar primeiro.");
      return;
    }

    const finalSlug = slugify(data.slug);
    setSlugIsChecking(true);
    setSlugError('');

    startTransition(async () => {
      try {
        // 1. Validar se o slug é realmente único (apenas se for diferente do atual ou se alterado)
        if (finalSlug !== activeEstablishment.slug) {
          const checkResult = await checkSlugAvailabilityAction(finalSlug);
          if (checkResult.status !== 200 || !checkResult.data?.available) {
            setSlugError("Esse link já está em uso por outra Poderosa. Tente outro!");
            setSlugIsChecking(false);
            return;
          }
        }

        // 2. Salvar o perfil no Supabase
        const profileResponse = await createProfileUserAction(profileData.name, profileData.avatarUrl);
        if (profileResponse.status !== HttpStatusEnum.Ok) {
          toast.error(profileResponse.message || "Erro ao configurar seu perfil. Tente novamente.");
          setSlugIsChecking(false);
          return;
        }

        // 3. Salvar os dados da bancada no Supabase
        const phoneClean = data.phone?.replace(/\D/g, "") || null;
        const response = await updateEstablishmentAction(activeEstablishment.id, {
          name: data.name.trim(),
          slug: finalSlug,
          avatar_url: data.avatarUrl,
          phone: phoneClean,
          address: data.address?.trim() || null,
        });

        if (response.status === 200) {
          // Atualiza as stores locais
          setProfile({
            id: profile?.id || '',
            email: profile?.email || '',
            name: profileData.name,
            avatarUrl: profileData.avatarUrl,
            createdAt: profile?.createdAt || new Date().toISOString()
          });

          const updatedEst = {
            ...activeEstablishment,
            name: data.name.trim(),
            slug: finalSlug,
            avatarUrl: data.avatarUrl,
            phone: phoneClean,
            address: data.address?.trim() || null,
          };

          setEstablishments([updatedEst]);
          setActiveEstablishment(updatedEst);

          toast.success("Prontinho! Cadastro concluído com sucesso.");

          // Força recarregar a rota para liberar o painel
          window.location.reload();
        } else {
          toast.error(response.message || "Erro ao salvar os dados do seu espaço.");
        }
      } catch {
        toast.error("Erro de conexão. Tente novamente mais tarde.");
      } finally {
        setSlugIsChecking(false);
      }
    });
  };

  return (
    <div className="bg-white border border-purple-100 rounded-3xl p-6 md:p-10 shadow-[0_10px_40px_rgba(147,51,234,0.04)] max-w-2xl mx-auto transition-all duration-300">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="establishmentName" className="text-purple-950 font-semibold">Nome do Espaço</FieldLabel>
              <Input
                id="establishmentName"
                placeholder="Ex: Espaço da Lu Silva"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  // Gera o slug automaticamente se o slug não foi modificado manualmente
                  if (!form.getFieldState("slug").isDirty) {
                    form.setValue("slug", slugify(e.target.value));
                  }
                }}
                className="bg-white border-purple-200/80 rounded-xl focus-visible:ring-purple-600/20 focus-visible:border-purple-600 transition-all duration-200 shadow-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || !!slugError}>
              <FieldLabel htmlFor="establishmentSlug" className="text-purple-950 font-semibold">Link do Espaço (Slug único)</FieldLabel>
              <div className="flex rounded-xl shadow-sm border border-purple-200/80 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-purple-600/20 focus-within:border-purple-600 transition-all duration-200">
                <span className="inline-flex items-center px-3.5 bg-purple-50 text-purple-700 text-xs border-r border-purple-100 font-semibold select-none">
                  luluzinha.com.br/
                </span>
                <input
                  id="establishmentSlug"
                  type="text"
                  placeholder="link-do-seu-espaco"
                  {...field}
                  onChange={(e) => {
                    field.onChange(slugify(e.target.value));
                    setSlugError('');
                  }}
                  className="flex-1 min-w-0 border-0 px-3 py-2 text-sm text-purple-950 focus:outline-none focus:ring-0 focus:border-transparent"
                />
              </div>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : slugError ? (
                <span className="text-[10px] font-semibold text-red-500 mt-1 block">
                  {slugError}
                </span>
              ) : (
                <FieldDescription>Esse link será a sua vitrine de atendimentos.</FieldDescription>
              )}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="establishmentPhone" className="text-purple-950 font-semibold">Telefone Comercial (Opcional)</FieldLabel>
                <Input
                  id="establishmentPhone"
                  placeholder="Ex: (11) 99999-9999"
                  {...field}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  className="bg-white border-purple-200/80 rounded-xl focus-visible:ring-purple-600/20 focus-visible:border-purple-600 transition-all duration-200 shadow-sm"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="establishmentAddress" className="text-purple-950 font-semibold">Endereço (Opcional)</FieldLabel>
                <Input
                  id="establishmentAddress"
                  placeholder="Ex: Sala 3, Centro"
                  {...field}
                  className="bg-white border-purple-200/80 rounded-xl focus-visible:ring-purple-600/20 focus-visible:border-purple-600 transition-all duration-200 shadow-sm"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Escolha sua Marca */}
        <Controller
          control={form.control}
          name="avatarUrl"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex flex-col gap-2">
                <div>
                  <FieldLabel className="text-purple-950 font-semibold block">Escolha sua Marca</FieldLabel>
                  <FieldDescription>Um símbolo que represente o seu espaço de trabalho.</FieldDescription>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 w-full mt-1">
                  {ESTABLISHMENT_AVAILABLE_ICONS.map((ico) => {
                    const IconItem = ico.component;
                    const isSelected = field.value === ico.name;

                    return (
                      <button
                        key={ico.name}
                        type="button"
                        onClick={() => field.onChange(ico.name)}
                        className={cn(
                          "relative p-3.5 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer",
                          isSelected
                            ? "bg-purple-900 border-purple-900 text-white shadow-lg shadow-purple-900/20 scale-105"
                            : "bg-purple-50/30 border-purple-100 text-purple-600 hover:bg-purple-50 hover:border-purple-200"
                        )}
                        title={ico.label}
                      >
                        <IconItem className="text-lg md:text-xl" />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white shadow-xs">
                            <FaCheck className="text-[6px]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Botões de Ação na Largura Total */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            className="flex-1 py-6 rounded-xl font-bold border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaArrowLeftLong className="text-xs" /> VOLTAR
          </Button>
          <Button
            type="submit"
            variant="theme"
            disabled={slugIsChecking || isPending}
            className="flex-2 py-6 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {(slugIsChecking || isPending) ? (
              <>
                <FaArrowsRotate className="animate-spin" />
                {slugIsChecking ? "VERIFICANDO LINK..." : "SALVANDO CADASTRO..."}
              </>
            ) : (
              <>
                CONCLUIR CADASTRO <FaCheckCircle className="text-sm" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
