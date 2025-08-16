import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-err";

interface registerUserRequest {
    name: string,
    email: string,
    password: string
}

export class RegisterService {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}

    async handle({ name, email, password }: registerUserRequest) {
        const passwordHashed = await hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.register({
            name,
            email,
            password_hash: passwordHashed
        })

        return {
            user
        }
    }
}