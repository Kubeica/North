import { LazyImage } from "@/components/public/media/LazyImage";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { cn } from "@/components/public/theme/utils";

type TeamMemberCardProps = {
  name: string;
  position: string;
  bio?: string | null;
  imageUrl?: string | null;
  linkedInUrl?: string | null;
  linkedInLabel?: string;
  email?: string | null;
  emailLabel?: string;
  className?: string;
};

/** Presentational leadership / team card (no data fetching). */
export function TeamMemberCard({
  name,
  position,
  bio,
  imageUrl,
  linkedInUrl,
  linkedInLabel = "LinkedIn",
  email,
  emailLabel = "Email",
  className,
}: TeamMemberCardProps) {
  const hasContacts = Boolean(linkedInUrl || email);

  return (
    <article
      className={cn(
        "flex h-full flex-col border border-border/60 bg-surface/30",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
        {imageUrl ? (
          <LazyImage
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-navy via-surface to-background"
            aria-hidden
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Heading as="h3" size="h4">
          {name}
        </Heading>
        <Caption className="mt-2 tracking-[0.12em] text-gold uppercase">
          {position}
        </Caption>
        {bio ? (
          <Paragraph className="mt-3 text-sm text-muted-foreground">
            {bio}
          </Paragraph>
        ) : null}
        {hasContacts ? (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {linkedInUrl ? (
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit text-sm text-gold transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {linkedInLabel}
              </a>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex w-fit text-sm text-gold transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {emailLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
