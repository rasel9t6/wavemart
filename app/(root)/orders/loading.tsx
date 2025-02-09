export default function SkeletonLoading() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex items-center justify-between bg-teal-500 p-4">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-300"></div>
        <div className="h-8 w-48 animate-pulse rounded bg-gray-300"></div>
        <div className="flex space-x-4">
          <div className="size-8 animate-pulse rounded-full bg-gray-300"></div>
          <div className="size-8 animate-pulse rounded-full bg-gray-300"></div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 space-y-4 bg-white p-4 shadow-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-full animate-pulse rounded bg-gray-300"
            ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Banner Skeleton */}
          <div className="mb-6 h-56 w-full animate-pulse rounded-lg bg-gray-300"></div>

          {/* Collections Skeleton */}
          <h2 className="mb-4 h-8 w-40 animate-pulse rounded bg-gray-300"></h2>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-gray-300"
              ></div>
            ))}
          </div>

          {/* Product Cards Skeleton */}
          <div className="mt-6 grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white p-4 shadow">
                <div className="h-40 w-full animate-pulse rounded-lg bg-gray-300"></div>
                <div className="mt-4 h-6 w-32 animate-pulse rounded bg-gray-300"></div>
                <div className="mt-2 h-6 w-24 animate-pulse rounded bg-gray-300"></div>
                <div className="mt-2 h-6 w-16 animate-pulse rounded bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
