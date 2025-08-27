import { app } from "@/app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";

describe("Search Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to search gyms by query", async () => {
        const { access_token } = await createAndAuthenticateUser(app, true)

        await request(app.server).post("/gyms").set("Authorization", `Bearer ${access_token}`).send({
            name: "Gym 01",
            description: "Some description",
            phone: "11999999999",
            latitude:-22.739692,
            longitude: -47.660755
        })

        await request(app.server).post("/gyms").set("Authorization", `Bearer ${access_token}`).send({
            name: "Java Gym",
            description: "Some description",
            phone: "11999999999",
            latitude:-22.739692,
            longitude: -47.660755
        })

        const response = await request(app.server).get("/gyms/search").set("Authorization", `Bearer ${access_token}`).query({
            q: "Java"
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                name: "Java Gym"
            })
        ])
    })
})