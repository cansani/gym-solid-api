export class MoreThanOneCheckInsOnSameDayError extends Error {
    constructor() {
        super("Não é permitido realizar mais de um check-in no mesmo dia.")
    }
}