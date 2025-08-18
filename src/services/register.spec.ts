import { describe, it, expect } from "vitest"
import { RegisterService } from "./register"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { compare } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-err"
import { beforeEach } from "vitest"

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe("Register Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterService(usersRepository)
    })

    it("Create user", async () => {
        const { user } = await sut.handle({
            name: "John",
            email: "john@email.com",
            password: "123"
        })

        expect(user.id).toStrictEqual(expect.any(String))
    }) 

    it("Hashed Password", async () => {
        const { user } = await sut.handle({
            name: "John",
            email: "john@email.com",
            password: "123"
        })

        const isCorrectlyPasswordHashed = await compare("123", user.password_hash)

        expect(isCorrectlyPasswordHashed).toBe(true)
    })

    it("Same Email", async () => {
        const sameEmail = "sameEmail@email.com"

        await sut.handle({
            name: "First",
            email: sameEmail,
            password: "123456"
        })

        await expect(async () => {
            await sut.handle({
                name: "Second",
                email: sameEmail,
                password: "123456"
            })
        }).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})