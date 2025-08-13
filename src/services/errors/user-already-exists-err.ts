export class UserAlreadyExistsError extends Error {
    constructor() {
        super("Este email ja existe.")
    }
}