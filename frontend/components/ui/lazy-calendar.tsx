"use client";

import dynamic from "next/dynamic";

/**
 * Same API as `Calendar` from ./calendar, but react-day-picker and its
 * date-fns locale code are fetched only when a calendar actually renders.
 * Every Calendar in the app sits inside a closed-by-default <PopoverContent>,
 * so this keeps ~25KB of JS off the initial load of every booking page.
 */
export const Calendar = dynamic(() => import("./calendar").then((m) => m.Calendar), {
  ssr: false,
  loading: () => <div className="h-[300px] w-[280px] animate-pulse rounded-md bg-[#141414]" />,
});
