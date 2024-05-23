export default function Loading() {
  return (
    <div className="lg:grid lg:grid-cols-2">
      <div className="skeleton w-full aspect-[3/4] self-center" />
      <div className="p-3 lg:self-center lg:px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="skeleton size-12 rounded-full" />
            <div className="skeleton w-14 h-6" />
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton size-6" />
            <div className="skeleton size-6" />
          </div>
        </div>
        <div className="divider m-1"></div>
        <div className="mt-3 mb-5 space-y-2">
          <div className="skeleton w-16 h-6" />
          <div className="skeleton w-28 h-5" />
        </div>
        <div className="skeleton w-full h-[149px] mb-3" />
        <div className="skeleton w-full aspect-[4/3]" />
      </div>
    </div>
  );
}
