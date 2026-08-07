import { statisticRepository } from "@/src/domain/statistic/repository";

export const statisticService = {
  async listPublished() {
    return statisticRepository.listPublished();
  },
};
