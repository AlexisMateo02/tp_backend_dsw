export function validateZipCode(zipcode: string): void {
    if (!zipcode || zipcode.trim().length === 0) {
        throw new Error('El código postal es requerido')
    }
    
    // Validar formato básico de código postal (ajusta según tus necesidades)
    const zipCodeRegex = /^[0-9]{4,5}$/ // 4-5 dígitos numéricos
    if (!zipCodeRegex.test(zipcode)) {
        throw new Error('El código postal debe contener entre 4 y 5 dígitos numéricos')
    }
}