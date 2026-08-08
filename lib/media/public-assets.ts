/**
 * Stable local public assets for the marketing site.
 * Prefer CMS media when it is a real upload/path; never rely on broken hotlinks.
 */

/** Cinematic architectural hero — always available under /public. */
export const LOCAL_HERO_IMAGE = "/images/hero-architecture.png";

/** Rotating architectural fallbacks for services / projects / editorial frames. */
export const LOCAL_ARCHITECTURE_IMAGES = [
  "/images/hero-architecture.png",
  "/images/architecture-facade.png",
  "/images/architecture-structure.png",
  "/images/architecture-interior.png",
] as const;

/** Hosts that are demo placeholders, not production photography. */
const UNRELIABLE_HOSTS = [
  "placehold.co",
  "via.placeholder.com",
  "unsplash.com",
  "images.unsplash.com",
];

function isUnreliableRemote(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return UNRELIABLE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return true;
  }
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Pick a deterministic local architectural image from a seed (slug/id). */
export function localArchitectureImage(seed = "default"): string {
  const index = hashSeed(seed) % LOCAL_ARCHITECTURE_IMAGES.length;
  return LOCAL_ARCHITECTURE_IMAGES[index] ?? LOCAL_HERO_IMAGE;
}

/**
 * Resolve any public CMS image URL.
 * Local paths pass through; unreliable remote placeholders fall back to local art.
 */
export function resolvePublicImageUrl(
  cmsUrl?: string | null,
  fallback: string = LOCAL_HERO_IMAGE,
): string {
  const url = cmsUrl?.trim();
  if (!url) return fallback;
  if (url.startsWith("/")) return url;
  if (isUnreliableRemote(url)) return fallback;
  return url;
}

/** Resolve a hero image URL for the public site. */
export function resolveHeroImageUrl(cmsUrl?: string | null): string {
  return resolvePublicImageUrl(cmsUrl, LOCAL_HERO_IMAGE);
}

/** Always returns a visible architectural image for service cards/sections. */
export function resolveServiceImageUrl(
  cmsUrl?: string | null,
  seed = "service",
): string {
  return resolvePublicImageUrl(cmsUrl, localArchitectureImage(seed));
}

/** Always returns a visible architectural image for project covers. */
export function resolveProjectImageUrl(
  cmsUrl?: string | null,
  seed = "project",
): string {
  return resolvePublicImageUrl(cmsUrl, localArchitectureImage(seed));
}

/**
 * Portrait / logo remote placeholders are not usable photography.
 * Returns a reliable local path only when the CMS URL is a real asset.
 */
export function resolveOptionalCmsImageUrl(
  cmsUrl?: string | null,
): string | null {
  const url = cmsUrl?.trim();
  if (!url) return null;
  if (url.startsWith("/")) return url;
  if (isUnreliableRemote(url)) return null;
  return url;
}
