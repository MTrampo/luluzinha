import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Converte um nome completo para formato título seguindo regras comuns
 * em Português:
 * - Primeira letra de cada parte do nome em maiúscula
 * - Partículas e artigos (de, do, da, dos, das, e) permanecem em
 *   minúscula quando não são a primeira palavra
 * - Partes ligadas por hífen são tratadas individualmente
 */
const LOWER_PARTICLES = new Set(["de", "do", "da", "dos", "das", "e"])

export const formatCaseName = (value?: string): string => {
	if (!value) return ""

	return value
		.trim()
		.toLowerCase()
		.split(/\s+/)
		.map((word, wordIndex) => {
			// trata partes com hífen (ex.: joão-pedro)
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

export const formatCurrencyBRL = (value: number): string => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value)
}

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
