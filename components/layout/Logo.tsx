import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  shortName?: string;
  href?: "/";
};

export function Logo({
  className,
  shortName = "Northern Meteor",
  href = "/",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-baseline gap-2 font-semibold tracking-tight text-foreground transition-colors hover:text-gold",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block size-2 shrink-0 rounded-full bg-gold transition-transform group-hover:scale-110"
      />
      <span className="text-base sm:text-lg">{shortName}</span>
    </Link>
  );
}
