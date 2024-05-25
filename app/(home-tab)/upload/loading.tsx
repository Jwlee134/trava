export default function Loading() {
  return (
    <div className="min-h-[calc(100dvh-128px)] flex flex-col gap-3 justify-center items-center p-3 *:skeleton *:max-w-xs *:w-full">
      <div className="h-12" />
      <div className="h-12" />
      <div className="h-[74px]" />
      <div className="h-12" />
    </div>
  );
}
