"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GetPhotosReturnType, GetPhotosType } from "./actions";

interface PhotosProps {
  initialPhotos: GetPhotosReturnType;
  fetchMorePhotos: GetPhotosType;
}

export default function Photos({
  initialPhotos,
  fetchMorePhotos,
}: PhotosProps) {
  const trigger = useRef<HTMLSpanElement>(null);
  const [photos, setPhotos] = useState(initialPhotos);

  useEffect(() => {
    if (!photos.nextCursor) return;
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          const res = await fetchMorePhotos(photos.nextCursor);
          setPhotos((prev) => ({
            data: [...prev.data, ...res.data],
            nextCursor: res.nextCursor,
          }));
        }
      },
      { rootMargin: "200px 0px" }
    );
    if (trigger.current) observer.observe(trigger.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchMorePhotos, photos.nextCursor]);

  return (
    <>
      <div className="grid grid-cols-3 gap-1 lg:rounded-lg lg:overflow-hidden">
        {photos.data.map((photo) => (
          <Link
            key={photo.id}
            href={`/photos/${photo.id}`}
            className="relative aspect-square"
          >
            <Image
              src={photo.url}
              alt="photo"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 33vw, 275px"
              priority
              quality={50}
            />
          </Link>
        ))}
      </div>
      <span ref={trigger}></span>
    </>
  );
}
