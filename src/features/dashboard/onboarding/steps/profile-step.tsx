'use client'

import { useProfileStore } from "@/store/use-profile";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { AVAILABLE_AVATARS } from "@/commons/constants/profile";
import { AvatarMap } from "@/components/maps/avatar-map";
import { cn } from "@/commons/lib/tw-merge";
import { FaArrowRightLong } from "react-icons/fa6";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselApi } from "@/components/ui/carousel";
import { useStepper } from "../onboarding-steps";
import { profileFormSchema } from "@/commons/validations/user";
import { ProfileFormInputs } from "@/commons/models/user";

export function ProfileStep() {
  const stepper = useStepper();
  const profile = useProfileStore((state) => state.profile);

  const profileMeta = stepper.metadata.get("profile") as Partial<ProfileFormInputs> | undefined;

  const form = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profileMeta?.name ?? (profile?.name !== "Manicure Luluzinha" ? (profile?.name || '') : ''),
      avatarUrl: profileMeta?.avatarUrl ?? (profile?.avatarUrl || 'avatar-1')
    }
  });

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Observa os valores em tempo real para o Live Preview e Carrossel
  const formName = form.watch("name") || "";
  const formAvatarUrl = form.watch("avatarUrl") || "avatar-1";

  // Sincroniza a mudança de slide com o avatar selecionado
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      const selectedIndex = carouselApi.selectedScrollSnap();
      const avatarKey = AVAILABLE_AVATARS[selectedIndex];
      if (avatarKey) {
        form.setValue("avatarUrl", avatarKey, { shouldDirty: true });
      }
    };

    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, form]);

  const handleAvatarClick = (avatarKey: string, index: number) => {
    form.setValue("avatarUrl", avatarKey, { shouldDirty: true });
    carouselApi?.scrollTo(index);
  };

  const onSubmit = (data: ProfileFormInputs) => {
    // Grava no metadata para o Passo 2 ler e salvar no banco ao final
    stepper.metadata.set("profile", data);
    stepper.navigation.next();
  };

  return (
    <div className="bg-white border border-purple-100 rounded-3xl p-6 md:p-10 shadow-[0_10px_40px_rgba(147,51,234,0.04)] max-w-2xl mx-auto transition-all duration-300">

      {/* Destaque do Avatar Selecionado com Live Preview do Nome */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-4 border-purple-600 shadow-lg shadow-purple-500/5 ring-4 ring-purple-400 bg-white transition-all duration-300 hover:scale-105">
          <Image
            src={AvatarMap[formAvatarUrl] || AvatarMap["avatar-1"]}
            alt="Avatar Selecionado"
            fill
            sizes="(max-width: 768px) 96px, 112px"
            className="object-contain p-1"
            priority
          />
        </div>
        <span className={cn(
          "text-xs font-bold tracking-wide text-center mt-1 px-4 py-1.5 rounded-full border shadow-xs transition-all duration-300",
          formName.trim()
            ? "text-purple-700 bg-purple-50 border-purple-100 font-extrabold uppercase"
            : "text-purple-400 bg-purple-50/20 border-purple-100/30 italic font-semibold"
        )}>
          {formName.trim() || "Como você quer ser chamada?"}
        </span>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profileName" className="text-purple-950 font-semibold">Como você gostaria de ser chamada?</FieldLabel>
              <Input
                id="profileName"
                placeholder="Ex: Luciana Silva (ou Lu)"
                {...field}
                className="bg-white border-purple-200/80 rounded-xl focus-visible:ring-purple-600/20 focus-visible:border-purple-600 transition-all duration-200 shadow-sm"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <FieldDescription>Sua assinatura ou apelido profissional.</FieldDescription>
              )}
            </Field>
          )}
        />

        <Field>
          <FieldLabel className="text-purple-950 font-semibold">Escolha seu Avatar</FieldLabel>

          <div className="flex flex-col items-center gap-6 mt-4">
            {/* Carrossel de Opções */}
            <div className="w-full relative px-10">
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                  startIndex: AVAILABLE_AVATARS.indexOf(formAvatarUrl) >= 0 ? AVAILABLE_AVATARS.indexOf(formAvatarUrl) : 0,
                }}
                setApi={setCarouselApi}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-3">
                  {AVAILABLE_AVATARS.map((avatarKey, index) => {
                    const isSelected = formAvatarUrl === avatarKey;
                    const avatarImg = AvatarMap[avatarKey] || AvatarMap["avatar-1"];
                    return (
                      <CarouselItem key={avatarKey} className="pl-2 md:pl-3 basis-1/5 sm:basis-1/7 md:basis-[11.11%] flex justify-center py-2">
                        <button
                          key={avatarKey}
                          type="button"
                          onClick={() => handleAvatarClick(avatarKey, index)}
                          className={cn(
                            "relative rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 h-10 w-10 md:h-12 md:w-12 cursor-pointer focus:outline-none bg-white",
                            isSelected
                              ? "border-purple-200 ring-4 ring-purple-100 scale-110 opacity-100 shadow-md shadow-purple-500/10"
                              : "border-purple-100/40 opacity-40 hover:opacity-85 hover:border-purple-300 hover:scale-95 scale-90"
                          )}
                        >
                          <div className="relative h-full w-full">
                            <Image
                              src={avatarImg}
                              alt={`Avatar ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 40px, 48px"
                              className="object-contain p-0.5"
                            />
                          </div>

                        </button>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 -translate-x-1/2 bg-white border-purple-100 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 shadow-sm size-9 rounded-full transition-all duration-200" />
                <CarouselNext className="absolute right-0 translate-x-1/2 bg-white border-purple-100 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 shadow-sm size-9 rounded-full transition-all duration-200" />
              </Carousel>
            </div>
          </div>
        </Field>

        <Button
          type="submit"
          variant="theme"
          className="w-full py-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:gap-3 cursor-pointer"
        >
          CONTINUAR <FaArrowRightLong className="text-sm animate-pulse" />
        </Button>
      </form>
    </div>
  );
}
