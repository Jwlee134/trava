export default function OauthLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <span className="loading loading-spinner loading-lg" />
      <span className="font-semibold mb-8">
        We are signing you in. Do not refresh the page.
      </span>
    </div>
  );
}
