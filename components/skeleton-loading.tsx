import { Skeleton } from "./ui/skeleton";

const SkeletonLoading = () => (
  <main className="flex flex-col items-center text-center mt-20 h-[60svh]">
    <Skeleton className="w-2/5 h-14 bg-slate-200 rounded-md" />
    <Skeleton className="w-2/5 h-8 bg-slate-200 rounded-md mt-2" />
    <Skeleton className="w-2/5 h-14 bg-slate-200 rounded-md mt-11" />
  </main>
);

export { SkeletonLoading };
