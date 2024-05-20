"use client";

import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PhotoDetailMapProps {
  url: string;
  lat: number;
  lng: number;
}

export default function PhotoDetailMap({ url, lat, lng }: PhotoDetailMapProps) {
  const mapRef = useRef<google.maps.Map>();
  const [node, setNode] = useState<HTMLElement>();

  const initMap = useCallback(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
      version: "weekly",
      libraries: ["maps"],
    });

    loader.importLibrary("maps").then(({ Map, InfoWindow }) => {
      mapRef.current = new Map(document.getElementById("map") as HTMLElement, {
        zoom: 16,
        center: { lat, lng },
        clickableIcons: false,
        disableDefaultUI: true,
      });

      const infowindow = new InfoWindow({
        content: "<div id='thumbnail' />",
        position: { lat, lng },
      });
      infowindow.open({ map: mapRef.current });
      const listener = infowindow.addListener("domready", () => {
        setNode(document.getElementById("thumbnail")!);
        listener.remove();
      });
    });
  }, [lat, lng]);

  useEffect(() => {
    initMap();
  }, [lat, lng, initMap]);

  return (
    <div id="map" className="aspect-[4/3] rounded-lg">
      {node &&
        createPortal(
          <div className="p-1.5">
            <div className="relative size-20 rounded overflow-hidden">
              <Image
                src={url}
                alt="Photo"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          </div>,
          node
        )}
    </div>
  );
}
