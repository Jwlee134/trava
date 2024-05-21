/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "trava-jwlee.s3.ap-northeast-2.amazonaws.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "k.kakaocdn.net" },
    ],
  },
  logging: {
    fetches: { fullUrl: true },
  },
};

export default nextConfig;
