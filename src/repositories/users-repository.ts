import { Prisma, User } from "../../generated/prisma"

export interface UsersRepository {
    register(data: Prisma.UserCreateInput): Promise<User>
    findByEmail(email: string): Promise<User | null>
}