import prisma from "@/libs/db";
import { revalidateTag } from "next/cache";
import EditPhotoButton from "./edit-photo-button";

interface EditPhotoFormProps {
  id: number;
  title: string | null;
  caption: string | null;
}

export default function EditPhotoForm({
  id,
  title,
  caption,
}: EditPhotoFormProps) {
  async function action(data: FormData) {
    "use server";
    const title = data.get("title") as string;
    const caption = data.get("caption") as string;
    await prisma.photo.update({
      data: { title, caption },
      where: { id },
    });
    revalidateTag(`photos-${id}`);
  }

  return (
    <form action={action}>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg">Edit</h3>
        <input
          name="title"
          placeholder="Title"
          className="input input-bordered w-full"
          defaultValue={title ?? ""}
        />
        <textarea
          name="caption"
          placeholder="Caption"
          className="textarea textarea-bordered w-full"
          defaultValue={caption ?? ""}
        ></textarea>
      </div>
      <div className="divider"></div>
      <EditPhotoButton />
    </form>
  );
}
