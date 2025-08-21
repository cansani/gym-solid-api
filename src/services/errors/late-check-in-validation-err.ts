export class LateCheckInValidationError extends Error {
    constructor() {
        super("O check-in não pode ser validado 20 minutos depois de ser criado.")
    }
}