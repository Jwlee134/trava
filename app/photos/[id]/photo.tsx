"use client";

import Comments from "@/components/comments";
import DeletePhotoButton from "@/components/delete-photo-button";
import EditPhotoForm from "@/components/edit-photo-form";
import EditPhotoModal from "@/components/edit-photo-modal";
import LikeButton from "@/components/like-button";
import PhotoDetailMap from "@/components/photo-detail-map";
import { getPhoto } from "@/libs/api";
import { SessionData } from "@/libs/session";
import { useQuery } from "@tanstack/react-query";
import { IronSession } from "iron-session";
import Image from "next/image";
import { useParams } from "next/navigation";
import { IoMdImage } from "react-icons/io";
import { IoCamera } from "react-icons/io5";
import { RiCameraLensFill, RiMapPinTimeFill } from "react-icons/ri";

interface PhotoProps {
  session: IronSession<SessionData>;
}

export default function Photo({ session }: PhotoProps) {
  const { id } = useParams();
  const { data: photo } = useQuery({
    queryKey: ["photo", id],
    queryFn: () => getPhoto(id as string),
  });

  if (!photo) return null;

  const date = photo.date
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "medium",
        timeZone: "GMT",
      }).format(new Date(photo.date))
    : "No date information";

  return (
    <div className="lg:grid lg:grid-cols-2">
      <Image
        src={photo.url}
        alt={photo.title ?? "Photo"}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="w-full h-auto lg:rounded-lg lg:self-start lg:sticky lg:top-16"
        priority
      />
      <div className="p-3 lg:self-center lg:px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <Image
                  src={photo.user.avatar}
                  alt={photo.user.username}
                  width={48}
                  height={48}
                  priority
                />
              </div>
            </div>
            <span>{photo.user.username}</span>
          </div>
          <div className="flex items-center gap-4">
            {(session.id === photo.user.id || session.isAdmin) && (
              <EditPhotoModal>
                <EditPhotoForm title={photo.title} caption={photo.caption} />
                <DeletePhotoButton />
              </EditPhotoModal>
            )}
            <div className="flex gap-4 opacity-80">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs">{photo.views}</span>
              </div>
              <LikeButton session={session} />
            </div>
          </div>
        </div>
        <div className="divider m-1"></div>
        <div className="mt-3 mb-5">
          <h1 className="text-lg break-words">{photo.title || "No title"}</h1>
          <h1 className="opacity-70 whitespace-pre-line break-words">
            {photo.caption || "No caption"}
          </h1>
        </div>
        <div className="bg-base-200 rounded-lg overflow-hidden mb-3">
          <div className="flex justify-between items-center bg-base-300 p-1.5">
            <span className="flex items-center gap-2">
              <IoCamera size={20} />
              {photo.deviceModel ?? "No camera information"}
            </span>
            <span className="bg-accent/80 px-1 py-0.5 rounded text-xs text-base-100">
              {photo.format}
            </span>
          </div>
          <div className="p-1.5 opacity-50 text-sm flex flex-col gap-1 [&>*]:flex [&>*]:items-center [&>*]:gap-2">
            <div>
              <RiCameraLensFill size={18} />
              {photo.lensModel ?? "No lens information"}
            </div>
            <div>
              <IoMdImage size={18} />
              <span>{photo.resolution}</span>
              <span> • </span>
              <span>{photo.dimensions}</span>
            </div>
            <div>
              <RiMapPinTimeFill size={18} />
              <span>{date}</span>
            </div>
          </div>
          <div className="flex justify-between items-center p-1.5 border-t border-t-base-300 text-sm *:opacity-50">
            <span>{photo.iso ?? "-"}</span>
            <span>{photo.focalLength ?? "-"}</span>
            <span>{photo.exposure ?? "-"}</span>
            <span>{photo.aperture ?? "-"}</span>
            <span>{photo.shutterSpeed ?? "-"}</span>
          </div>
        </div>
        {photo.latitude && photo.longitude && (
          <PhotoDetailMap
            url={photo.url}
            lat={photo.latitude}
            lng={photo.longitude}
          />
        )}
        <Comments session={session} />
      </div>
    </div>
  );
}
