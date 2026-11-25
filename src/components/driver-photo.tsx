import Image from "next/image";
import photos from "@/data/driver-photos.json";

export const hasPhoto = (slug: string) => slug in photos;

export function DriverPhoto({ slug, name, className, sizes }: { slug: string; name: string; className: string; sizes: string }) {
  if (!hasPhoto(slug)) return null;
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image src={`/pilotos/${slug}.jpg`} alt={name} fill sizes={sizes} className="object-cover object-top" />
    </span>
  );
}
