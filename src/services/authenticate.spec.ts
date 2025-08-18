import { describe, it, expect } from "vitest"
import { AuthenticateService } from "./authenticate"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { hash } from "bcryptjs"
import { InvalidCredentialsError } from "./errors/invalid-credentials-err"
import { beforeEach } from "node:test"

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe("Authenticate Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateService(usersRepository)
    })

    it("Should be able to authenticate", async () => {
        await usersRepository.register({
            name: "John",
            email: "john@email.com",
            password_hash: await hash("123456", 6)
        })

        const { access_token } = await sut.handle({
            email: "john@email.com",
            password: "123456"
        })

        expect(access_token).toStrictEqual(expect.any(String))
    })

    it("Should not be able to authenticate using invalid email", async () => {
        await expect(async () => {
            await sut.handle({
                email: "john123@email.com",
                password: "123456"
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it("Should not be able to authenticate using wrong password", async () => {
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