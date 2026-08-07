import { projectService } from "../src/domain/project/service";
import { userService } from "../src/domain/user/service";

async function main() {
  const users = await userService.list({ page: 1, pageSize: 1 });
  const projects = await projectService.list({ page: 1, pageSize: 1 });
  console.log("client_ok=true");
  console.log(`user_count=${users.total}`);
  console.log(`project_count=${projects.total}`);
}

main().catch((error) => {
  console.error("client_ok=false");
  console.error(error instanceof Error ? error.message : "unknown_error");
  process.exit(1);
});
