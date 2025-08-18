import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { beforeEach } from "vitest";
import { describe, expect, it } from "vitest";
import { GetUserProfileService } from "./get-user-profile";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { ResorceNotFoundError } from "./errors/resource-not-found.err";

let usersRepository: UsersRepository
let sut: GetUserProfileService

describe("Get User Profile Service", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileService(usersRepository)
    })

    it("should be able to get user profile", async () => {
        const createdUser = await usersRepository.register({
            name: "John",
            email: "john@email.com",
            password_hash: await hash("123456", 6)
        })

        const { user } = await sut.handle({
            userId: createdUser.id
        })

        expect(user.name).toEqual("John")
    }) 

    it("should not be able to get user profile using wrong id", async () => {
        await expect(async () => {
            await sut.handle({
                userId: "non-existing-id"
            })
        }).rejects.toBeInstanceOf(ResorceNotFoundError)
    })
})