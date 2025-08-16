import { UsersRepository } from "@/repositories/users-repository"
import { compare } from "bcryptjs"
import { InvalidCredentialsError } from "./errors/invalid-credentials-err"

interface AuthenticateRequest {
    email: string,
    password: string
}

interface AuthenticateResponse {
    access_token: string
}

export class AuthenticateService {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}
    
    async handle({ email, password }: AuthenticateRequest): Promise<AuthenticateResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            access_token: ""
        }
    }
}   