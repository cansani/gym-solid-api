import { Prisma, User } from "generated/prisma";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = []

    async register(data: Prisma.UserCreateInput) {
        const user = {
            id: "user-1",
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date()
        }

        this.items.push(user)

        return user
    }

    async findByEmail(email: string) {
        const user = this.items.find((item) => item.email === email)

        if (!user) {
            return null
        }

        return user
    }

    async findById(userId: string): Promise<User | null> {
        const user = this.items.find((item) => userId === item.id)

        if (!user) {
            return null
        }

        return user
    }
}