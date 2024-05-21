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
import { getLikeStatus, getPhoto } from "./actions";

async function getCachedLikeStatus(id: number) {
  const session = await getSession();
  const operation = unstable_cache(
    (id) => getLikeStatus(id, session.id ?? 0),
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
  const photo = await getPhoto(id);
  if (!photo) return notFound();
  const { isLiked, likeCount } = await getCachedLikeStatus(id);
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
              <LikeButton
                disabled={!session.id}
                id={photo.id}
                isLiked={isLiked}
                likeCount={likeCount}
              />
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
      </div>
    </>
  );
}
