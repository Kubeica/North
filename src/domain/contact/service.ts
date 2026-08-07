import { contactRepository } from "@/src/domain/contact/repository";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/src/domain/contact/validation";
import { DomainError } from "@/src/domain/shared/errors";

export const contactService = {
  async submitContact(input: ContactFormInput) {
    const parsed = contactFormSchema.safeParse(input);
    if (!parsed.success) {
      throw new DomainError("Validation failed");
    }

    try {
      return await contactRepository.create(parsed.data);
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to submit contact message");
    }
  },
};
