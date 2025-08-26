import { app } from "@/app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to create a gym", async () => {
        const { access_token } = await createAndAuthenticateUser(app)

        const response = await request(app.server).post("/gyms").set("Authorization", `Bearer ${access_token}`).send({
            name: "Gym 01",
            description: "Some description",
            phone: "11999999999",
            latitude:-22.739692,
            longitude: -47.660755
        })

        expect(response.statusCode).toEqual(201)
    })
})