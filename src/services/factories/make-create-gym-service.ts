import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { createGymService } from "../create-gym";

export function makeCreateGymService() {
    const gymsRepository = new PrismaGymsRepository()
    const createGymsService = new createGymService(gymsRepository)

    return createGymsService
}