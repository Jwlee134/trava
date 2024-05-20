import prisma from "@/libs/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import DeletePhotoButton from "./delete-photo-button";

interface DeletePhotoFormProps {
  id: number;
}

export default function DeletePhotoForm({ id }: DeletePhotoFormProps) {
  async function action() {
    "use server";
    await prisma.photo.delete({ where: { id } });
    revalidateTag("photos");
    redirect("/");
  }

  return (
    <form action={action}>
      <DeletePhotoButton />
    </form>
  );
}
