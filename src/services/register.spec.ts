import { describe, it, expect } from "vitest"
import { RegisterService } from "./register"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { compare } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-err"

describe("Register Service", () => {
    it("Create user", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(usersRepository)

        const { user } = await registerService.handle({
            name: "John",
            email: "john@email.com",
            password: "123"
        })

        expect(user.id).toStrictEqual(expect.any(String))
    }) 

    it("Hashed Password", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(usersRepository)

        const { user } = await registerService.handle({
            name: "John",
            email: "john@email.com",
            password: "123"
        })

        const isCorrectlyPasswordHashed = await compare("123", user.password_hash)

        expect(isCorrectlyPasswordHashed).toBe(true)
    })

    it("Same Email", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerService = new RegisterService(usersRepository)

        const sameEmail = "sameEmail@email.com"

        await registerService.handle({
            name: "First",
            email: sameEmail,
            password: "123456"
        })

        await expect(async () => {
            await registerService.handle({
                name: "Second",
                email: sameEmail,
                password: "123456"
            })
        }).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})