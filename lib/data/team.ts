import { safeQuery } from "@/lib/data/safe";
import { teamService } from "@/src/domain/team/service";

export async function getTeamMembers() {
  return safeQuery(() => teamService.listPublished(), []);
}
