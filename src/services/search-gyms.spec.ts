import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsService } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe("Search Gyms Service", async () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsService(gymsRepository)
    })

    it("should be able to search gyms", async () => {
        await gymsRepository.create({
            name: "JS Gym",
            description: "",
            phone: "",
            latitude:-22.739692,
            longitude: -47.660755
        })

        await gymsRepository.create({
            name: "AB Gym",
            description: "",
            phone: "",
            latitude:-22.739692,
            longitude: -47.660755
        })

        const { gyms } = await sut.handle({
            query: "JS",
            page: 1
        })

        expect(gyms).toEqual([
            expect.objectContaining({ name: "JS Gym" })
        ])
    })

    it("should be able to get gyms with pagination", async () => {
        for(let i = 0; i <= 21; i++) {
            await gymsRepository.create({
                name: `JS Gym ${i}`,
                description: "",
                phone: "",
                latitude:-22.739692,
                longitude: -47.660755
            })  
        }

        const { gyms } = await sut.handle({
            query: "JS",
            page: 2
        })

        expect(gyms).toEqual([
            expect.objectContaining({ name: "JS Gym 20" }),
            expect.objectContaining({ name: "JS Gym 21" })
        ])
    })
})