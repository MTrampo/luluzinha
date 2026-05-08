import { CustomerFormatted } from "./customer";
import { ProcedureSupabase } from "./procedure";

export type ScheduleStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ScheduleFormatted {
  id: string;
  customer: CustomerFormatted;
  procedures: ProcedureSupabase[]; // Alterado para array
  startTime: string; 
  endTime: string;   
  date: string;      
  status: ScheduleStatus;
  notes?: string;
  totalPriceFormatted: string; // Preço total formatado
  totalDuration: number;       // Duração total em minutos
}

export const mockSchedules: ScheduleFormatted[] = [
  {
    id: "1",
    customer: {
      id: "c1",
      name: "Raquel Santos",
      nameFormatted: "Raquel Santos",
      initials: "RS",
      phoneFormatted: "(11) 98888-7777",
      waLink: "https://wa.me/5511988887777",
      email: null,
      birthday: null,
      notes: null,
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: false,
      phone: "11988887777"
    },
    procedures: [
      {
        id: "p1",
        name: "Pé e Mão",
        price: 60,
        duration: 60,
        establishment_id: "",
        created_at: "",
        updated_at: null,
        description: null,
        is_active: true
      },
      {
        id: "p3",
        name: "Sobrancelha",
        price: 35,
        duration: 30,
        establishment_id: "",
        created_at: "",
        updated_at: null,
        description: null,
        is_active: true
      }
    ],
    startTime: "09:00",
    endTime: "10:30",
    date: new Date().toISOString().split('T')[0],
    status: "confirmed",
    totalPriceFormatted: "R$ 95,00",
    totalDuration: 90
  },
  {
    id: "2",
    customer: {
      id: "c2",
      name: "Mariana Oliveira",
      nameFormatted: "Mariana Oliveira",
      initials: "MO",
      phoneFormatted: "(11) 97777-6666",
      waLink: "https://wa.me/5511977776666",
      email: null,
      birthday: null,
      notes: "Alérgica a esmalte comum",
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: true,
      hasNotes: true,
      phone: "11977776666"
    },
    procedures: [
      {
        id: "p2",
        name: "Alongamento em Gel",
        price: 150,
        duration: 120,
        establishment_id: "",
        created_at: "",
        updated_at: null,
        description: null,
        is_active: true
      }
    ],
    startTime: "10:30",
    endTime: "12:30",
    date: new Date().toISOString().split('T')[0],
    status: "pending",
    totalPriceFormatted: "R$ 150,00",
    totalDuration: 120
  },
  {
    id: "3",
    customer: {
      id: "c3",
      name: "Beatriz Lima",
      nameFormatted: "Beatriz Lima",
      initials: "BL",
      phoneFormatted: "(11) 96666-5555",
      waLink: "https://wa.me/5511966665555",
      phone: "11966665555",
      email: null,
      birthday: null,
      notes: null,
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: false
    },
    procedures: [{ id: "p1", name: "Pé e Mão", price: 60, duration: 60, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true }],
    startTime: "14:00",
    endTime: "15:00",
    date: new Date().toISOString().split('T')[0],
    status: "completed",
    totalPriceFormatted: "R$ 60,00",
    totalDuration: 60
  },
  {
    id: "4",
    customer: {
      id: "c4",
      name: "Fernanda Rocha",
      nameFormatted: "Fernanda Rocha",
      initials: "FR",
      phoneFormatted: "(11) 95555-4444",
      waLink: "https://wa.me/5511955554444",
      phone: "11955554444",
      email: null,
      birthday: null,
      notes: null,
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: false
    },
    procedures: [{ id: "p3", name: "Sobrancelha", price: 35, duration: 30, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true }],
    startTime: "15:15",
    endTime: "15:45",
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    status: "confirmed",
    totalPriceFormatted: "R$ 35,00",
    totalDuration: 30
  },
  {
    id: "5",
    customer: {
      id: "c5",
      name: "Juliana Costa",
      nameFormatted: "Juliana Costa",
      initials: "JC",
      phoneFormatted: "(11) 94444-3333",
      waLink: "https://wa.me/5511944443333",
      phone: "11944443333",
      email: null,
      birthday: null,
      notes: null,
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: false
    },
    procedures: [
      { id: "p1", name: "Pé e Mão", price: 60, duration: 60, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true },
      { id: "p4", name: "Esmaltação em Gel", price: 50, duration: 40, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true }
    ],
    startTime: "16:00",
    endTime: "17:40",
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    status: "confirmed",
    totalPriceFormatted: "R$ 110,00",
    totalDuration: 100
  },
  {
    id: "6",
    customer: {
      id: "c6",
      name: "Patrícia Souza",
      nameFormatted: "Patrícia Souza",
      initials: "PS",
      phoneFormatted: "(11) 93333-2222",
      waLink: "https://wa.me/5511933332222",
      phone: "11933332222",
      email: null,
      birthday: null,
      notes: null,
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: false
    },
    procedures: [{ id: "p5", name: "Manutenção Fibra", price: 120, duration: 90, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true }],
    startTime: "18:00",
    endTime: "19:30",
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    status: "cancelled",
    totalPriceFormatted: "R$ 120,00",
    totalDuration: 90
  },
  {
    id: "7",
    customer: {
      id: "c7",
      name: "Camila Arantes",
      nameFormatted: "Camila Arantes",
      initials: "CA",
      phoneFormatted: "(11) 92222-1111",
      waLink: "https://wa.me/5511922221111",
      phone: "11922221111",
      email: null,
      birthday: null,
      notes: null,
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: false
    },
    procedures: [{ id: "p1", name: "Pé e Mão", price: 60, duration: 60, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true }],
    startTime: "19:30",
    endTime: "20:30",
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    status: "pending",
    totalPriceFormatted: "R$ 60,00",
    totalDuration: 60
  },
  {
    id: "8",
    customer: {
      id: "c8",
      name: "Daniela Xavier",
      nameFormatted: "Daniela Xavier",
      initials: "DX",
      phoneFormatted: "(11) 91111-0000",
      waLink: "https://wa.me/5511911110000",
      phone: "11911110000",
      email: null,
      birthday: null,
      notes: "Sempre pede café",
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: true
    },
    procedures: [
      { id: "p1", name: "Pé e Mão", price: 60, duration: 60, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true },
      { id: "p3", name: "Sobrancelha", price: 35, duration: 30, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true },
      { id: "p4", name: "Esmaltação em Gel", price: 50, duration: 40, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true },
      { id: "p6", name: "Depilação", price: 45, duration: 30, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true },
      { id: "p7", name: "Buço", price: 15, duration: 15, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true },
      { id: "p8", name: "Massagem", price: 80, duration: 45, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true }
    ],
    startTime: "11:00",
    endTime: "14:00",
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    status: "confirmed",
    totalPriceFormatted: "R$ 285,00",
    totalDuration: 180
  },
  {
    id: "9",
    customer: {
      id: "c9",
      name: "Eliane Moraes",
      nameFormatted: "Eliane Moraes",
      initials: "EM",
      phoneFormatted: "(11) 90000-9999",
      waLink: "https://wa.me/5511900009999",
      phone: "11900009999",
      email: null,
      birthday: null,
      notes: null,
      birthdayFormatted: "",
      createdAt: "",
      updatedAt: null,
      establishmentId: "",
      isBirthdayToday: false,
      hasNotes: false
    },
    procedures: [{ id: "p1", name: "Pé e Mão", price: 60, duration: 60, establishment_id: "", created_at: "", updated_at: null, description: null, is_active: true }],
    startTime: "20:30",
    endTime: "21:30",
    date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
    status: "pending",
    totalPriceFormatted: "R$ 60,00",
    totalDuration: 60
  }
];
