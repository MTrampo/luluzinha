
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