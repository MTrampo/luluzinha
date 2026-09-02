import { useState } from 'react';
import Image from 'next/image';
import powerfulContactSvg from '@/commons/assets/svgs/powerful-contact.svg';
import { Button } from '@/components/ui/button';
import { FaShareNodes } from 'react-icons/fa6';
import { InviteShareModal } from '@/components/modals/invite-share-modal';

interface AppointmentFeedbackEmptyProps {
  availableDays?: string[];
}

export function AppointmentFeedbackEmpty({ availableDays = [] }: AppointmentFeedbackEmptyProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative w-48 h-48 mb-6">
        <Image
          src={powerfulContactSvg}
          alt="Sem agendamentos"
          fill
          className="object-contain opacity-80"
          priority
        />
      </div>

      <h4 className="font-black text-purple-900">
        Seu espaço está pronto para brilhar!
      </h4>

      <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6 leading-relaxed">
        Toda grande trajetória começa com um primeiro passo. Que tal aproveitar esse tempo livre para divulgar seu talento e convidar uma Poderosa para renovar o brilho das unhas?
      </p>

      <Button
        variant="outline"
        onClick={() => setIsInviteModalOpen(true)}
        className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-bold gap-2 transition-all active:scale-95"
      >
        <FaShareNodes />
        Convidar uma Poderosa
      </Button>

      <InviteShareModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        availableDays={availableDays}
      />
    </div>
  );
}
