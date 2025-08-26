import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest"
import { app } from "@/app";
import { afterEach } from "node:test";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";

describe("Get Profile (e2e)", async () => {
    beforeEach(async () => {
        await app.ready()
    })

    afterEach(async () => {
        await app.close()
    })

    it("should be able to get profile", async () => {
        const { access_token } = await createAndAuthenticateUser(app)

        const response = await request(app.server).get("/me").set('Authorization', `Bearer ${access_token}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body.user).toEqual(expect.objectContaining({
            email: "john@email.com"
        }))
    })
})