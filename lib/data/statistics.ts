import { safeQuery } from "@/lib/data/safe";
import { statisticService } from "@/src/domain/statistic/service";

export async function getStatistics() {
  return safeQuery(() => statisticService.listPublished(), []);
}
