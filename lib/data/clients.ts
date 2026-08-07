import { safeQuery } from "@/lib/data/safe";
import { clientService } from "@/src/domain/client/service";

export async function getClients() {
  return safeQuery(() => clientService.listPublished(), []);
}
