import { format, parseISO, parse, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { convertTimeToMinutes } from './helper'

const LOWER_PARTICLES = new Set(["de", "do", "da", "dos", "das", "e", "da", "do", "dos", "das", "em"])

export const formatCaseName = (value?: string): string => {
	if (!value) return ""

	return value
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.map((word, wordIndex) => {
			if (word.includes("-")) {
				return word
					.split("-")
					.map((part) => formatPart(part, wordIndex === 0))
					.join("-")
			}

			return formatPart(word, wordIndex === 0)
		})
		.join(" ")
}

function formatPart(part: string, isFirstWord: boolean) {
	if (!part) return part

	if (LOWER_PARTICLES.has(part) && !isFirstWord) return part
	return part.charAt(0).toUpperCase() + part.slice(1)
}

export const formatCurrencyBRL = (value: number): string => new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
}).format(value)

export const formatPhone = (phone?: string | null): string => {
	if (!phone) return ""

	const digits = phone.replace(/\D/g, "")
	if (digits.length !== 11) return phone

	return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
}

export const formatDate = (date?: string | null): string => {
	if (!date) return ""
	try {
		return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR })
	} catch {
		return ""
	}
}

export const formatDuration = (minutes?: number | null): string => {
	if (!minutes) return "0min"
	if (minutes < 60) return `${minutes}min`
	const h = Math.floor(minutes / 60)
	const m = minutes % 60
	if (m === 0) return `${h}h`
	return `${h}h ${m}min`
}

export const formatTimeRangeToDuration = (startTime: string, endTime: string): string => {
	if (!startTime || !endTime) return "0min"

	// Caso especial para o dia todo
	if (startTime === "00:00" && endTime === "23:59") return "24h"

	const start = convertTimeToMinutes(startTime)
	const end = convertTimeToMinutes(endTime)
	const diff = end - start

	return formatDuration(diff)
}

export const formatPhoneInput = (value: string): string => {
	const digits = value.replace(/\D/g, "");
	if (digits.length <= 2) return digits;
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const formatDateInput = (date?: Date | null): string => {
	if (!date || !isValid(date)) return ""
	return format(date, 'dd/MM/yyyy')
}

export const parseDateInput = (dateStr: string): Date | undefined => {
	const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
	if (!dateRegex.test(dateStr)) return undefined;

	const parsed = parse(dateStr, 'dd/MM/yyyy', new Date())

	return isValid(parsed) && format(parsed, 'dd/MM/yyyy') === dateStr ? parsed : undefined
}

export const toIsoDateInput = (date?: Date | null): string => {
	if (!date) return ""
	return format(date, 'yyyy-MM-dd')
}

export const isIsoDateString = (value?: string | null): boolean => {
	return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export const slugify = (text: string): string => {
	return text
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
}

