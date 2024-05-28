export default function Loading() {
  return (
    <div className="grid grid-cols-3 gap-1 lg:rounded-lg lg:overflow-hidden">
      {Array.from({ length: 30 }, (v, i) => i).map((e) => (
        <div key={e} className="skeleton aspect-square rounded-none"></div>
      ))}
    </div>
  );
}
