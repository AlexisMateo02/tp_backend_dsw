export function validateId(id: number, entity: string): void {
	if (!id || isNaN(id) || id <= 0) {
		throw new Error(`ID de ${entity} inválido`)
	}
}
