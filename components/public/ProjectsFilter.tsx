"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { cn } from "@/components/public/theme/utils";
import { useRouter } from "@/i18n/navigation";

type CategoryOption = {
  slug: string;
  name: string;
};

type LocationOption = {
  value: string;
  label: string;
};

type ProjectsFilterProps = {
  categories: CategoryOption[];
  locations: LocationOption[];
  currentQ?: string;
  currentCategory?: string;
  currentStatus?: string;
  currentLocation?: string;
  currentFeatured?: boolean;
};

const STATUSES = ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"] as const;

const fieldClass =
  "w-full rounded-sm border border-border bg-surface/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold";

export function ProjectsFilter({
  categories,
  locations,
  currentQ = "",
  currentCategory = "",
  currentStatus = "",
  currentLocation = "",
  currentFeatured = false,
}: ProjectsFilterProps) {
  const t = useTranslations("projects");
  const tForms = useTranslations("forms");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function apply(formData: FormData) {
    const params = new URLSearchParams();
    const q = String(formData.get("q") ?? "").trim();
    const category = String(formData.get("category") ?? "");
    const status = String(formData.get("status") ?? "");
    const location = String(formData.get("location") ?? "");
    const featured = formData.get("featured") === "true";

    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (location) params.set("location", location);
    if (featured) params.set("featured", "true");

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/projects?${query}` : "/projects");
    });
  }

  return (
    <form
      action={apply}
      className="grid gap-4 border border-border/60 bg-surface/20 p-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end"
      aria-label={t("filtersLabel")}
      aria-busy={pending}
    >
      <div className="sm:col-span-2 lg:col-span-2">
        <label htmlFor="q" className="mb-1.5 block text-xs text-muted-foreground">
          {tForms("search")}
        </label>
        <input
          id="q"
          name="q"
          defaultValue={currentQ}
          placeholder={t("searchPlaceholder")}
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1.5 block text-xs text-muted-foreground"
        >
          {t("category")}
        </label>
        <select
          id="category"
          name="category"
          defaultValue={currentCategory}
          className={fieldClass}
        >
          <option value="">{t("filterAll")}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1.5 block text-xs text-muted-foreground"
        >
          {t("statusLabel")}
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className={fieldClass}
        >
          <option value="">{t("filterAll")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="location"
          className="mb-1.5 block text-xs text-muted-foreground"
        >
          {t("location")}
        </label>
        <select
          id="location"
          name="location"
          defaultValue={currentLocation}
          className={fieldClass}
          disabled={locations.length === 0}
        >
          <option value="">{t("filterAll")}</option>
          {locations.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
        <label
          className={cn(
            "flex h-[42px] items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm",
            "focus-within:ring-2 focus-within:ring-gold",
          )}
        >
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={currentFeatured}
            className="size-4 accent-[var(--gold)]"
          />
          <span>{t("featured")}</span>
        </label>
        <PublicButton
          type="submit"
          disabled={pending}
          className="w-full"
          size="md"
        >
          {pending ? tForms("loading") : t("applyFilters")}
        </PublicButton>
      </div>
    </form>
  );
}
