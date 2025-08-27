export class RefreshTokenError extends Error {
    constructor() {
        super("O refreshToken não existe.")
    }
}