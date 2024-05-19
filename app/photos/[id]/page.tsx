import { GetPhotoResponse } from "@/app/api/v1/photos/[id]/route";
import LikeStatus from "@/components/like-status";
import PhotoDetailMap from "@/components/photo-detail-map";
import api from "@/libs/api";
import getSession from "@/libs/session";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IoMdImage } from "react-icons/io";
import { IoCamera } from "react-icons/io5";
import { RiCameraLensFill, RiMapPinTimeFill } from "react-icons/ri";

async function getPhoto(id: number) {
  return await api<GetPhotoResponse>(`/photos/${id}`, {
    method: "GET",
    next: { tags: ["photo-detail", `photos-${id}`] },
  });
}

async function getIsLiked(id: number) {
  const session = await getSession();
  if (!session.id) return false;
  return await api<boolean>(`/photos/${id}/like?userId=${session.id}`, {
    method: "GET",
    next: { tags: [`like-status-${id}`] },
  });
}

export default async function PhotoDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const photo = await getPhoto(id);
  if (!photo) return notFound();
  const isLiked = await getIsLiked(id);

  const date = photo.date
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(new Date(photo.date))
    : "No date information";

  return (
    <div>
      <Image
        src={photo.url}
        alt={photo.title ?? "Photo"}
        width={photo.width}
        height={photo.height}
        sizes="100vw"
        className="w-full h-auto"
      />
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <Image
                  src={photo.user.avatar}
                  alt={photo.user.username}
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <span>{photo.user.username}</span>
          </div>
          <LikeStatus id={photo.id} isLiked={isLiked} />
        </div>
        <div className="divider m-1"></div>
        {photo.title && <h1 className="text-lg break-words">{photo.title}</h1>}
        {photo.caption && (
          <h1 className="opacity-70 mb-3 whitespace-pre-line break-words">
            {photo.caption}
          </h1>
        )}
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
      </div>
    </div>
  );
}
