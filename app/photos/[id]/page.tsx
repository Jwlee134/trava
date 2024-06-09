import getSession from "@/libs/session";
import { Metadata } from "next";
import prisma from "@/libs/db";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import EditPhotoModal from "@/components/edit-photo-modal";
import LikeButton from "@/components/like-button";
import { IoCamera } from "react-icons/io5";
import { RiCameraLensFill, RiMapPinTimeFill } from "react-icons/ri";
import { IoMdImage } from "react-icons/io";
import PhotoDetailMap from "@/components/photo-detail-map";
import Comments from "@/components/comments";
import { getComments, getLikeStatus, getPhoto } from "./actions";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const id = params.id;

  try {
    const photo = await prisma.photo.findUnique({
      where: { id },
      select: { id: true, url: true, title: true, caption: true },
    });

    return {
      title: photo?.title || "No title",
      openGraph: {
        images: photo?.url,
        title: photo?.title || "No title",
        description: photo?.caption || "No caption",
      },
    };
  } catch {
    return notFound();
  }
}

function getCachedPhoto(id: string) {
  const operation = unstable_cache(getPhoto, [`photo-${id}`], {
    tags: [`photo-${id}`],
  });

  return operation(id);
}

async function getCachedLikeStatus(id: string) {
  const session = await getSession();
  const operation = unstable_cache(getLikeStatus, [`photo-${id}-likeStatus`], {
    tags: [`photo-${id}-likeStatus`],
  });

  return operation(id, session.id);
}

function getCachedComments(id: string) {
  const operation = unstable_cache(getComments, [`photo-${id}-comments`], {
    tags: [`photo-${id}-comments`],
  });

  return operation(id);
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const session = await getSession();
  const [photo, likeStatus, comments] = await Promise.all([
    getCachedPhoto(id),
    getCachedLikeStatus(id),
    getCachedComments(id),
  ]);
  if (!photo) return notFound();

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
              <EditPhotoModal
                title={photo.title ?? ""}
                caption={photo.caption ?? ""}
              />
            )}
            <LikeButton status={likeStatus} session={{ ...session }} />
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
        <Comments data={comments} session={{ ...session }} />
      </div>
    </div>
  );
}
