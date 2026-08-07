import { messageRepository } from "@/src/domain/message/repository";
import type { MessageCreateInput } from "@/src/domain/message/validation";

/**
 * Thin wrapper — contact form submissions persist as ContactMessage rows.
 */
export const contactRepository = {
  async create(input: MessageCreateInput) {
    return messageRepository.create(input);
  },
};
