import { beforeEach, expect } from "vitest";
import { describe, it } from "vitest";
import { CheckInService } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

let checkInsRepository: CheckInsRepository
let sut: CheckInService

describe("CheckIn Service", async () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInService(checkInsRepository)
    })

    it("should be able to check in", async () => {
        const { checkIn } = await sut.handle({
            gymId: "gym-any-id",
            userId: "user-any-id"
        })

        expect(checkIn.id).toStrictEqual(expect.any(String))
    })
})