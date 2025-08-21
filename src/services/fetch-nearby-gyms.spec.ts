import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsService } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe("Fetch Nearby Gyms Service", async () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsService(gymsRepository)
    })

    it("should be able to fetch nearby gyms", async () => {
        await gymsRepository.create({
            name: "Near Gym",
            description: "",
            phone: "",
            latitude:-23.5277843,
            longitude: -46.8372001
        })

        await gymsRepository.create({
            name: "Far Gym",
            description: "",
            phone: "",
            latitude:-22.739692,
            longitude: -47.660755
        })

        const gyms = await gymsRepository.findManyNearby(-23.528460, -46.799358)

        expect(gyms).toEqual([
            expect.objectContaining({ name: "Near Gym" })
        ])
    })
})