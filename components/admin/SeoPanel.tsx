import {
  Field,
  fieldClassName,
  textareaClassName,
} from "@/components/admin/FormSection";
import { FormCard } from "@/components/admin/FormCard";
import { cn } from "@/lib/utils";

type SeoPanelProps = {
  seoTitleAr?: string | null;
  seoTitleEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionEn?: string | null;
  errors?: Partial<
    Record<
      "seoTitleAr" | "seoTitleEn" | "seoDescriptionAr" | "seoDescriptionEn",
      string
    >
  >;
  className?: string;
  title?: string;
};

/** SEO fields with names matching existing project/service forms. */
export function SeoPanel({
  seoTitleAr,
  seoTitleEn,
  seoDescriptionAr,
  seoDescriptionEn,
  errors,
  className,
  title = "SEO",
}: SeoPanelProps) {
  return (
    <FormCard title={title} className={cn(className)}>
      <Field label="SEO title (EN)" name="seoTitleEn" error={errors?.seoTitleEn}>
        <input
          id="seoTitleEn"
          name="seoTitleEn"
          defaultValue={seoTitleEn ?? ""}
          className={fieldClassName}
        />
      </Field>
      <Field label="SEO title (AR)" name="seoTitleAr" error={errors?.seoTitleAr}>
        <input
          id="seoTitleAr"
          name="seoTitleAr"
          dir="rtl"
          defaultValue={seoTitleAr ?? ""}
          className={fieldClassName}
        />
      </Field>
      <Field
        label="SEO description (EN)"
        name="seoDescriptionEn"
        full
        error={errors?.seoDescriptionEn}
      >
        <textarea
          id="seoDescriptionEn"
          name="seoDescriptionEn"
          defaultValue={seoDescriptionEn ?? ""}
          className={textareaClassName}
        />
      </Field>
      <Field
        label="SEO description (AR)"
        name="seoDescriptionAr"
        full
        error={errors?.seoDescriptionAr}
      >
        <textarea
          id="seoDescriptionAr"
          name="seoDescriptionAr"
          dir="rtl"
          defaultValue={seoDescriptionAr ?? ""}
          className={textareaClassName}
        />
      </Field>
    </FormCard>
  );
}
