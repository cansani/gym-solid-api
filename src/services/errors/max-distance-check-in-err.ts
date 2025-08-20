export class MaxDistanceCheckInError extends Error {
    constructor() {
        super("A distancia entre o check-in e academia não pode ser maior do que 100m.")
    }
}