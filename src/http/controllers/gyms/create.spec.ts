import { app } from "@/app";
import { describe, beforeEach, afterEach, it } from "vitest";
import request from "supertest";

describe("Create Gym (e2e)", async () => {
    beforeEach(async () => {
        await app.ready()
    })

    afterEach(async () => {
        await app.close()
    })

    it("should be able to create gym", async () => {
        const response = await request(app.server).post("/gym").send({
            name: "Gym 01",
            description: "Random description",
            phone: "11999999999",
            latitude: "000000",
            longitude: "0000000"
        })
    })
})