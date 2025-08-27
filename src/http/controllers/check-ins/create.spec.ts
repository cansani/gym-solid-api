import { app } from "@/app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Check-in (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to check in", async () => {
        const { access_token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                name: "JS Gym",
                latitude:-22.739692,
                longitude: -47.660755
            }
        })

        const gymId = gym.id

        const response = await request(app.server).post(`/gyms/${gymId}/check-ins`).set("Authorization", `Bearer ${access_token}`).send({
            latitude:-22.739692,
            longitude: -47.660755
        })

        expect(response.statusCode).toEqual(201)
    })
})