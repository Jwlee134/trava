import { GetLikeStatusReturnType } from "@/app/api/v1/photos/[id]/like/route";
import { GetPhotoReturnType } from "@/app/api/v1/photos/[id]/route";
import { GetPhotosReturnType } from "@/app/api/v1/photos/route";
import { GetLikedPhotosReturnType } from "@/app/api/v1/profile/liked-photos/route";
import { GetMyPhotosReturnType } from "@/app/api/v1/profile/my-photos/route";
import { GetProfileReturnType } from "@/app/api/v1/profile/route";
import axios from "axios";

const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL}/api/v1` });

export async function getPhotos({ pageParam }: { pageParam: number }) {
  return (await api.get<GetPhotosReturnType>(`/photos?cursor=${pageParam}`))
    .data;
}

export async function postPhoto(body: FormData) {
  return (await api.post<{ id: number }>("/photos", body)).data;
}

export async function getPhoto(id: number) {
  return (await api.get<GetPhotoReturnType>(`/photos/${id}`)).data;
}

export async function getPhotoLikeStatus(id: number) {
  return (await api.get<GetLikeStatusReturnType>(`/photos/${id}/like`)).data;
}

export async function postLike(id: number) {
  return (await api.post(`/photos/${id}/like`)).data;
}

export async function deleteLike(id: number) {
  return (await api.delete(`/photos/${id}/like`)).data;
}

export interface UpdatePhotoBody {
  title: string;
  caption: string;
}

export async function updatePhoto(id: number, data: UpdatePhotoBody) {
  return (await api.patch(`/photos/${id}`, data)).data;
}

export async function deletePhoto(id: number) {
  return (await api.delete(`/photos/${id}`)).data;
}

export async function getProfile(id: number) {
  return (await api.get<GetProfileReturnType>(`/profile?id=${id}`)).data;
}

export async function getLikedPhotos(id: number) {
  return (
    await api.get<GetLikedPhotosReturnType>(`/profile/liked-photos?id=${id}`)
  ).data;
}

export async function getMyPhotos(id: number) {
  return (await api.get<GetMyPhotosReturnType>(`/profile/my-photos?id=${id}`))
    .data;
}

export async function logout() {
  return (await api.post("/profile/logout")).data;
}

export default api;
