export default function Loading() {
  return (
    <div className="pt-16">
      <div className="flex flex-col items-center gap-4 pb-10">
        <div className="skeleton rounded-full size-32" />
        <div className="skeleton w-32 h-8" />
      </div>
    </div>
  );
}
