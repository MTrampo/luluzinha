import { IoFlowerSharp } from "react-icons/io5";
import { OpeningHours } from "../models/establishment";
import {
  FaPaintbrush,
  FaSpa,
  FaCrown,
  FaHeart,
  FaGem,
  FaStar,
  FaHandSparkles,
  FaSun,
  FaMoon
} from "react-icons/fa6";

export const ESTABLISHMENT_DEFAULT_HOURS: OpeningHours = {
  mon: { open: "08:00", close: "18:00", closed: false },
  tue: { open: "08:00", close: "18:00", closed: false },
  wed: { open: "08:00", close: "18:00", closed: false },
  thu: { open: "08:00", close: "18:00", closed: false },
  fri: { open: "08:00", close: "18:00", closed: false },
  sat: { open: "08:00", close: "14:00", closed: false },
  sun: { open: "00:00", close: "00:00", closed: true }
}

// Mapeador dos dias da semana em português
export const ESTABLISHMENT_DAY_LABELS: Record<keyof OpeningHours, string> = {
  mon: "Segunda-feira",
  tue: "Terça-feira",
  wed: "Quarta-feira",
  thu: "Quinta-feira",
  fri: "Sexta-feira",
  sat: "Sábado",
  sun: "Domingo"
}

// Ordem de exibição dos dias da semana (começando no Domingo)
export const ESTABLISHMENT_WEEKDAY_ORDER: Array<keyof OpeningHours> = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

// Lista de Ícones Disponíveis com Labels
export const ESTABLISHMENT_AVAILABLE_ICONS = [
  { name: "FaPaintbrush", component: FaPaintbrush, label: "Pincel" },
  { name: "IoFlowerSharp", component: IoFlowerSharp, label: "Flor" },
  { name: "FaSpa", component: FaSpa, label: "Cuidado" },
  { name: "FaCrown", component: FaCrown, label: "Coroa" },
  { name: "FaHeart", component: FaHeart, label: "Coração" },
  { name: "FaGem", component: FaGem, label: "Joia" },
  { name: "FaStar", component: FaStar, label: "Estrela" },
  { name: "FaSun", component: FaSun, label: "Sol" },
  { name: "FaMoon", component: FaMoon, label: "Lua" },
  { name: "FaHandSparkles", component: FaHandSparkles, label: "Mãos" }
]