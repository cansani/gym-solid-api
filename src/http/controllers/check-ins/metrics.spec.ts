import { app } from "@/app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Check-in Metrics (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to get count of check ins", async () => {
        const { access_token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                name: "JS Gym",
                latitude:-22.739692,
                longitude: -47.660755
            }
        })

        const gymId = gym.id

        await request(app.server).post(`/gyms/${gymId}/check-ins`).set("Authorization", `Bearer ${access_token}`).send({
            latitude:-22.739692,
            longitude: -47.660755
        })

        await prisma.checkIn.create({
            data: {
                gym_id: gym.id,
                user_id: user.id
            }
        })

        const response = await request(app.server).get("/check-ins/metrics").set("Authorization", `Bearer ${access_token}`).send()

        expect(response.body.checkInsCount).toEqual(2)
        expect(response.statusCode).toEqual(200)
    })
})