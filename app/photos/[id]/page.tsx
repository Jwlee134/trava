import DeletePhotoForm from "@/components/delete-photo-form";
import EditPhotoForm from "@/components/edit-photo-form";
import EditPhotoModal from "@/components/edit-photo-modal";
import LikeButton from "@/components/like-button";
import PhotoDetailMap from "@/components/photo-detail-map";
import getSession from "@/libs/session";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IoMdImage } from "react-icons/io";
import { IoCamera } from "react-icons/io5";
import { RiCameraLensFill, RiMapPinTimeFill } from "react-icons/ri";
import { getIsLiked, getPhoto } from "./actions";

function getCachedPhoto(id: number) {
  const operation = unstable_cache(getPhoto, ["photo-detail"], {
    tags: [`photos-${id}`],
  });
  return operation(id);
}

async function getCachedIsLiked(id: number) {
  const session = await getSession();
  if (!session.id) return false;
  const operation = unstable_cache(
    (id) => getIsLiked(id, session.id!),
    ["like-status"],
    {
      tags: [`like-status-${session.id}`],
    }
  );
  return operation(id);
}

export default async function PhotoDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const photo = await getCachedPhoto(id);
  if (!photo) return notFound();
  const isLiked = await getCachedIsLiked(id);
  const session = await getSession();

  const date = photo.date
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(new Date(photo.date))
    : "No date information";

  return (
    <>
      <Image
        src={photo.url}
        alt={photo.title ?? "Photo"}
        width={photo.width}
        height={photo.height}
        sizes="100vw"
        className="w-full h-auto"
        priority
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
          <div className="flex items-center">
            {session.id === photo.user.id && (
              <EditPhotoModal>
                <EditPhotoForm
                  id={id}
                  title={photo.title}
                  caption={photo.caption}
                />
                <DeletePhotoForm id={id} />
              </EditPhotoModal>
            )}
            {session.id && <LikeButton id={photo.id} isLiked={isLiked} />}
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
      </div>
    </>
  );
}
