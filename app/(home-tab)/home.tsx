"use client";

import { getPhotos } from "@/libs/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";

export default function Home() {
  const trigger = useRef<HTMLSpanElement>(null);
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["photos"],
    queryFn: getPhotos,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (!hasNextPage) return;
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          fetchNextPage();
        }
      },
      { rootMargin: "100px 0px" }
    );
    if (trigger.current) observer.observe(trigger.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, data]);

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {data?.pages.map((photos, i) => (
          <Fragment key={i}>
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
                  sizes="33vw"
                />
              </Link>
            ))}
          </Fragment>
        ))}
      </div>
      <span ref={trigger}></span>
    </>
  );
}
