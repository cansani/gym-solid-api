import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { describe, beforeEach, it, expect } from "vitest";
import { createGymService } from "./create-gym";

let gymsRepository: InMemoryGymsRepository
let sut: createGymService

describe("Create Gym Service", async () => {
    beforeEach(async () => {    
        gymsRepository = new InMemoryGymsRepository()
        sut = new createGymService(gymsRepository)
    })

    it("should be able to create a gym", async () => {
        const { gym } = await sut.handle({
            name: "JS Gym",
            description: "",
            phone: "",
            latitude:-22.739692,
            longitude: 47.660755
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})