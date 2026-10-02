'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { playGentleChime } from '@/commons/utils/audio';
import { ScheduleWeekDay } from '@/commons/models/schedule';
import { ScheduleStatusEnum } from '@/commons/enums/schedule';
import { Clock } from 'lucide-react';

interface AppointmentSoundAlertProps {
  schedules: ScheduleWeekDay[];
}

export function AppointmentSoundAlert({ schedules }: AppointmentSoundAlertProps) {
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkUpcomingAppointments = () => {
      const now = new Date();
      const todayStr = now.toDateString();

      schedules.forEach((schedule) => {
        // Apenas atendimentos pendentes ou confirmados
        if (
          schedule.status !== ScheduleStatusEnum.PENDING &&
          schedule.status !== ScheduleStatusEnum.CONFIRMED
        ) {
          return;
        }

        const appointmentDate = new Date(schedule.startAtIso);
        if (appointmentDate.toDateString() !== todayStr) {
          return;
        }

        const diffMinutes = Math.floor(
          (appointmentDate.getTime() - now.getTime()) / (1000 * 60)
        );

        // Se faltam entre 1 e 15 minutos e ainda não alertou
        if (diffMinutes >= 0 && diffMinutes <= 15) {
          if (!notifiedIdsRef.current.has(schedule.id)) {
            notifiedIdsRef.current.add(schedule.id);

            // Toca som delicado
            playGentleChime();

            // Notifica visualmente
            toast('Próximo atendimento em breve!', {
              description: `Seu horário com ${schedule.customerName} começa às ${schedule.startTime} (em cerca de ${diffMinutes} min).`,
              icon: <Clock className="w-4 h-4 text-primary" />,
              duration: 10000,
            });
          }
        }
      });
    };

    // Checa de imediato e depois a cada 1 minuto
    checkUpcomingAppointments();
    const interval = setInterval(checkUpcomingAppointments, 60000);

    return () => clearInterval(interval);
  }, [schedules]);

  return null;
}
