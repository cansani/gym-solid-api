import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsService } from "./get-user-metrics";
import { check } from "zod";

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe("Get User Metrics Service", async () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsService(checkInsRepository)
    })

    it("should be able to get check ins metrics", async () => {
        await checkInsRepository.create({
            gym_id: "gym-01",
            user_id: "1"
        })

        await checkInsRepository.create({
            gym_id: "gym-02",
            user_id: "1"
        })

        const { checkInsCount } = await sut.handle({
            userId: "1"
        })

        expect(checkInsCount).toBe(2)
    }) 
})