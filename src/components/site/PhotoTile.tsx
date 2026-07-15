import Image from "next/image";

type PhotoTileProps = {
  src: string;
  alt: string;
  /** Optional label shown over a soft gradient at the bottom of the image. */
  caption?: string;
  /** Height/spanning utilities — the tile fills its box with object-cover. */
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Consistent, gently-animated photo tile used to weave real store photos
 * across the site. Uses the shared glass-panel frame, clips an object-cover
 * image, and adds a subtle zoom + caption on hover for a "live" feel.
 */
export default function PhotoTile({
  src,
  alt,
  caption,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: PhotoTileProps) {
  return (
    <figure className={`glass-panel group relative overflow-hidden rounded-3xl ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      {caption ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red shadow-glow" />
            <span className="text-sm font-semibold text-white drop-shadow-md">{caption}</span>
          </figcaption>
        </>
      ) : null}
    </figure>
  );
}
