import { describe, it, expect } from "vitest"
import { AuthenticateService } from "./authenticate"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { hash } from "bcryptjs"
import { InvalidCredentialsError } from "./errors/invalid-credentials-err"

describe("Authenticate Service", () => {
    it("Should be able to authenticate", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const authenticateService = new AuthenticateService(usersRepository)

        await usersRepository.register({
            name: "John",
            email: "john@email.com",
            password_hash: await hash("123456", 6)
        })

        const { access_token } = await authenticateService.handle({
            email: "john@email.com",
            password: "123456"
        })

        expect(access_token).toStrictEqual(expect.any(String))
    })

    it("Should not be able to authenticate using invalid email", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const authenticateService = new AuthenticateService(usersRepository)

        await expect(async () => {
            await authenticateService.handle({
                email: "john123@email.com",
                password: "123456"
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it("Should not be able to authenticate using wrong password", async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateService(usersRepository)

        await usersRepository.register({
            name: "John",
            email: "john@email.com",
            password_hash: await hash("123456", 6)
        })

        await expect(async () => {
            await sut.handle({
                email: "john@email.com",
                password: "12345689"
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)

        
    })
})