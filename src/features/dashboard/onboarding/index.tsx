'use client'

import { createProfileUserAction } from "@/actions/auth";
import { checkSlugAvailabilityAction, updateEstablishmentAction } from "@/actions/establishment";
import { HttpStatusEnum } from "@/commons/enums/http";
import { useProfileStore } from "@/store/use-profile";
import { useEstablishmentStore } from "@/store/use-establishment";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { slugify } from "@/commons/utils/format";
import { ESTABLISHMENT_AVAILABLE_ICONS } from "@/commons/constants/establishment";
import { AVAILABLE_AVATARS } from "@/commons/constants/profile";
import { AvatarMap } from "@/components/maps/avatar-map";
import { cn } from "@/commons/lib/tw-merge";
import { FaCheck, FaArrowsRotate, FaUser, FaStore } from "react-icons/fa6";
import Image from "next/image";

export function Onboarding() {
  const [step, setStep] = useState<'profile' | 'establishment'>('profile');
  const [isPending, startTransition] = useTransition();

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const activeEstablishment = useEstablishmentStore((state) => state.activeEstablishment);
  const setEstablishments = useEstablishmentStore((state) => state.setEstablishments);
  const setActiveEstablishment = useEstablishmentStore((state) => state.setActiveEstablishment);

  // Dados do Passo 1 (Perfil)
  const [profileName, setProfileName] = useState(profile?.name !== "Manicure Luluzinha" ? (profile?.name || '') : '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile?.avatarUrl || 'avatar-1');

  // Dados do Passo 2 (Bancada/Estabelecimento)
  const [establishmentName, setEstablishmentName] = useState('');
  const [establishmentSlug, setEstablishmentSlug] = useState('');
  const [establishmentIcon, setEstablishmentIcon] = useState<string>('FaPaintbrush');
  const [establishmentPhone, setEstablishmentPhone] = useState('');
  const [establishmentAddress, setEstablishmentAddress] = useState('');

  // Validação de slug reativa
  const [slugIsChecking, setSlugIsChecking] = useState(false);
  const [slugError, setSlugError] = useState('');

  // Passo 1: Submissão do Perfil (Nome + Avatar)
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Por favor, nos informe seu nome ou apelido.");
      return;
    }

    startTransition(async () => {
      const response = await createProfileUserAction(profileName.trim(), selectedAvatar);
      if (response.status === HttpStatusEnum.Ok) {
        toast.success("Seu perfil foi configurado com carinho!");
        
        // Atualiza a store de perfil local
        setProfile({
          id: profile?.id || '',
          email: profile?.email || '',
          name: profileName.trim(),
          avatarUrl: selectedAvatar,
          createdAt: profile?.createdAt || new Date().toISOString()
        });

        // Sugere um slug inicial baseado no nome da manicure
        setEstablishmentName(`Bancada de ${profileName}`);
        setEstablishmentSlug(slugify(`bancada-${profileName}`));
        setStep('establishment');
      } else {
        toast.error(response.message || "Não conseguimos criar seu perfil. Tente novamente.");
      }
    });
  };

  // Passo 2: Submissão da Bancada (Estabelecimento)
  const handleEstablishmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!establishmentName.trim()) {
      toast.error("Sua bancada digital precisa de um nome.");
      return;
    }

    const finalSlug = slugify(establishmentSlug);
    if (!finalSlug) {
      toast.error("Por favor, digite um link válido.");
      return;
    }

    if (!activeEstablishment?.id) {
      toast.error("Falha ao localizar seu estabelecimento temporário. Tente recarregar a página.");
      return;
    }

    setSlugIsChecking(true);
    setSlugError('');

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

      // 2. Atualizar o estabelecimento temporário
      const phoneClean = establishmentPhone.replace(/\D/g, "") || null;
      const response = await updateEstablishmentAction(activeEstablishment.id, {
        name: establishmentName.trim(),
        slug: finalSlug,
        avatar_url: establishmentIcon,
        phone: phoneClean,
        address: establishmentAddress.trim() || null,
      });

      if (response.status === 200) {
        toast.success("Prontinho! Cadastro concluído com sucesso.");
        
        // Atualiza a store local de estabelecimentos
        const updatedEst = {
          ...activeEstablishment,
          name: establishmentName.trim(),
          slug: finalSlug,
          avatarUrl: establishmentIcon,
          phone: phoneClean,
          address: establishmentAddress.trim() || null,
        };

        setEstablishments([updatedEst]);
        setActiveEstablishment(updatedEst);

        // Força recarregar a rota para liberar o painel
        window.location.reload();
      } else {
        toast.error(response.message || "Erro ao salvar os dados da sua bancada.");
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setSlugIsChecking(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Indicador visual do Stepper */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
          step === 'profile' ? "bg-purple-900 text-white" : "bg-purple-100 text-purple-700"
        )}>
          <FaUser className="text-xs" />
          <span>Seu Perfil</span>
        </div>
        <div className="h-0.5 w-12 bg-purple-100 rounded" />
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
          step === 'establishment' ? "bg-purple-900 text-white" : "bg-purple-50 text-purple-400"
        )}>
          <FaStore className="text-xs" />
          <span>Sua Bancada</span>
        </div>
      </div>

      {step === 'profile' && (
        <div className="bg-white border border-purple-50 rounded-2xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-purple-900">Seu Perfil de Profissional</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Como suas Poderosas vão te identificar? Escolha seu apelido e seu avatar.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <Field>
              <FieldLabel htmlFor="profileName">Como você gostaria de ser chamada?</FieldLabel>
              <Input
                id="profileName"
                placeholder="Ex: Luciana Silva (ou Lu Manicure)"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                className="bg-white border-purple-100 rounded-lg focus-visible:ring-purple-200"
              />
              <FieldDescription>Sua assinatura ou apelido profissional.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Escolha seu Avatar</FieldLabel>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mt-3 max-h-48 overflow-y-auto p-2 border border-purple-50 rounded-xl bg-purple-50/10">
                {AVAILABLE_AVATARS.map((avatarKey, index) => {
                  const isSelected = selectedAvatar === avatarKey;
                  const avatarImg = AvatarMap[avatarKey] || AvatarMap["avatar-1"];
                  return (
                    <button
                      key={avatarKey}
                      type="button"
                      onClick={() => setSelectedAvatar(avatarKey)}
                      className={cn(
                        "relative rounded-full overflow-hidden border-2 transition-all duration-200 hover:scale-105 shrink-0 h-10 w-10 md:h-12 md:w-12",
                        isSelected ? "border-purple-900 ring-2 ring-purple-100 scale-105" : "border-transparent"
                      )}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={avatarImg}
                          alt={`Avatar ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 40px, 48px"
                          className="object-cover"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-purple-950/20 flex items-center justify-center">
                          <FaCheck className="text-[10px] text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Button
              type="submit"
              variant="theme"
              disabled={isPending}
              className="w-full py-6 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {isPending && <FaArrowsRotate className="animate-spin" />}
              {isPending ? "SALVANDO PERFIL..." : "SALVAR E CONTINUAR"}
            </Button>
          </form>
        </div>
      )}

      {step === 'establishment' && (
        <div className="bg-white border border-purple-50 rounded-2xl p-6 md:p-8 shadow-sm max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
          <form onSubmit={handleEstablishmentSubmit} className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-purple-900">Sua Bancada Digital</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Configure os detalhes básicos do seu espaço de trabalho.
              </p>
            </div>

            <Field>
              <FieldLabel htmlFor="establishmentName">Nome da Bancada / Salão</FieldLabel>
              <Input
                id="establishmentName"
                placeholder="Ex: Espaço da Lu Silva"
                value={establishmentName}
                onChange={(e) => {
                  setEstablishmentName(e.target.value);
                  setEstablishmentSlug(slugify(e.target.value));
                }}
                required
                className="bg-white border-purple-100 rounded-lg focus-visible:ring-purple-200"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="establishmentSlug">Link da Bancada (Slug único)</FieldLabel>
              <div className="flex rounded-lg shadow-sm border border-purple-100 overflow-hidden bg-white">
                <span className="inline-flex items-center px-3 bg-purple-50 text-purple-500 text-xs border-r border-purple-50 font-medium select-none">
                  luluzinha.com.br/
                </span>
                <input
                  id="establishmentSlug"
                  type="text"
                  placeholder="link-da-sua-bancada"
                  value={establishmentSlug}
                  onChange={(e) => {
                    setEstablishmentSlug(slugify(e.target.value));
                    setSlugError('');
                  }}
                  required
                  className="flex-1 min-w-0 border-0 px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-transparent focus-visible:outline-none"
                />
              </div>
              {slugError ? (
                <span className="text-[10px] font-semibold text-red-500 mt-1 block">
                  {slugError}
                </span>
              ) : (
                <FieldDescription>Esse link será a sua vitrine de atendimentos.</FieldDescription>
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="establishmentPhone">Telefone Comercial (Opcional)</FieldLabel>
                <Input
                  id="establishmentPhone"
                  placeholder="Ex: (11) 99999-9999"
                  value={establishmentPhone}
                  onChange={(e) => setEstablishmentPhone(e.target.value)}
                  className="bg-white border-purple-100 rounded-lg focus-visible:ring-purple-200"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="establishmentAddress">Endereço (Opcional)</FieldLabel>
                <Input
                  id="establishmentAddress"
                  placeholder="Ex: Sala 3, Centro"
                  value={establishmentAddress}
                  onChange={(e) => setEstablishmentAddress(e.target.value)}
                  className="bg-white border-purple-100 rounded-lg focus-visible:ring-purple-200"
                />
              </Field>
            </div>

            <Button
              type="submit"
              variant="theme"
              disabled={slugIsChecking || isPending}
              className="w-full py-6 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
            >
              {slugIsChecking && <FaArrowsRotate className="animate-spin" />}
              {slugIsChecking ? "VERIFICANDO LINK..." : "CONCLUIR CADASTRO"}
            </Button>
          </form>

          {/* Escolha do Ícone */}
          <div className="border border-purple-50/50 bg-purple-50/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
            <div>
              <span className="text-xs font-bold text-purple-900 block">Selecione o Ícone</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">Um símbolo que represente seu salão.</span>
            </div>

            <div className="grid grid-cols-5 gap-2 w-full mt-2">
              {ESTABLISHMENT_AVAILABLE_ICONS.map((ico) => {
                const IconItem = ico.component;
                const isSelected = establishmentIcon === ico.name;

                return (
                  <button
                    key={ico.name}
                    type="button"
                    onClick={() => setEstablishmentIcon(ico.name)}
                    className={cn(
                      "relative p-2 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-105",
                      isSelected
                        ? "bg-purple-900 border-purple-900 text-white shadow-md"
                        : "bg-white border-purple-50 text-purple-500 hover:bg-purple-50/50"
                    )}
                    title={ico.label}
                  >
                    <IconItem className="text-sm" />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-0.5 border border-white">
                        <FaCheck className="text-[4px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
