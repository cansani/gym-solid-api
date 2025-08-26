import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistory } from "@/services/fetch-user-check-ins-history"

export function makeFetchUserCheckInsHistoryService() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const fetchUserCheckInsHistoryService = new FetchUserCheckInsHistory(checkInsRepository)

    return fetchUserCheckInsHistoryService
}