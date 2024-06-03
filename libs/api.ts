import { GetCommentsReturnType } from "@/app/api/v1/photos/[id]/comments/route";
import { GetLikeStatusReturnType } from "@/app/api/v1/photos/[id]/like/route";
import { GetPhotoReturnType } from "@/app/api/v1/photos/[id]/route";
import { GetPhotosReturnType } from "@/app/api/v1/photos/route";
import { GetLikedPhotosReturnType } from "@/app/api/v1/profile/liked-photos/route";
import { GetMyPhotosReturnType } from "@/app/api/v1/profile/my-photos/route";
import { GetProfileReturnType } from "@/app/api/v1/profile/route";
import { PostCommentBody } from "@/components/comments";
import axios from "axios";

const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL}/api/v1` });

export async function getPhotos({ pageParam }: { pageParam: string }) {
  return (await api.get<GetPhotosReturnType>(`/photos?cursor=${pageParam}`))
    .data;
}

export async function postPhoto(body: FormData) {
  return (await api.post<{ id: number }>("/photos", body)).data;
}

export async function getPhoto(id: string) {
  return (await api.get<GetPhotoReturnType>(`/photos/${id}`)).data;
}

export async function getPhotoLikeStatus(id: string) {
  return (await api.get<GetLikeStatusReturnType>(`/photos/${id}/like`)).data;
}

export async function postLike(id: string) {
  return (await api.post(`/photos/${id}/like`)).data;
}

export async function deleteLike(id: string) {
  return (await api.delete(`/photos/${id}/like`)).data;
}

export interface UpdatePhotoBody {
  title: string;
  caption: string;
}

export async function updatePhoto(id: string, data: UpdatePhotoBody) {
  return (await api.patch(`/photos/${id}`, data)).data;
}

export async function deletePhoto(id: string) {
  return (await api.delete(`/photos/${id}`)).data;
}

export async function getProfile(id: string) {
  return (await api.get<GetProfileReturnType>(`/profile?id=${id}`)).data;
}

export async function getLikedPhotos(id: string) {
  return (
    await api.get<GetLikedPhotosReturnType>(`/profile/liked-photos?id=${id}`)
  ).data;
}

export async function getMyPhotos(id: string) {
  return (await api.get<GetMyPhotosReturnType>(`/profile/my-photos?id=${id}`))
    .data;
}

export async function logout() {
  return (await api.post("/profile/logout")).data;
}

export async function getComments(id: string) {
  return (await api.get<GetCommentsReturnType>(`/photos/${id}/comments`)).data;
}

export async function postComment(id: string, body: PostCommentBody) {
  return (await api.post(`/photos/${id}/comments`, body)).data;
}

export async function postChildComment(
  id: string,
  parentId: string,
  body: PostCommentBody
) {
  return (await api.post(`/photos/${id}/comments/${parentId}`, body)).data;
}

export async function updateComment(
  id: string,
  cid: string,
  body: PostCommentBody
) {
  return (await api.patch(`/photos/${id}/comments/${cid}`, body)).data;
}

export async function deleteComment(id: string, cid: string) {
  return (await api.delete(`/photos/${id}/comments/${cid}`)).data;
}

export default api;
