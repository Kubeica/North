import { safeQuery } from "@/lib/data/safe";
import { milestoneService } from "@/src/domain/milestone/service";

export async function getCompanyMilestones() {
  return safeQuery(() => milestoneService.listPublished(), []);
}
