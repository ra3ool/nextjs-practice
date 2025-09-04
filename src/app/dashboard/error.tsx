'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset?: () => void;
}) {
  return (
    <div className="p-4 space-y-2">
      <h2 className="font-bold text-red-600">Something went wrong!</h2>
      <p>{error.message}</p>
      <button
        {...(reset && {
          onClick: () => reset(),
        })}
        className="px-3 py-1 rounded bg-blue-500 text-white"
      >
        Try again
      </button>
    </div>
  );
}
