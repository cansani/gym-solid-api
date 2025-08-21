import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistory } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistory

describe("Fetch User CheckIns History Service", async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository
        sut = new FetchUserCheckInsHistory(checkInsRepository)
    })

    it("should be able to get a user check in history", async () => {
        const userId = "1"
        
        await checkInsRepository.create({
            gym_id: "gym-id",
            user_id: userId,
        })

        const { checkIns } = await sut.handle({
            userId,
            page: 1
        })

        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-id" })
        ])
    })

    it("should be able to get a user check in history", async () => {
        const userId = "1"
        
        for (let i = 0; i < 21; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: userId,
            })
        }

        const { checkIns } = await sut.handle({
            userId,
            page: 2
        })

        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-20" })
        ])
    })
})