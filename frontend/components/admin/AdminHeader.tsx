import { Bell } from "lucide-react";

export default function AdminHeader() {
  return (
    <header
      className="
        flex
        h-16
        items-center
        justify-between
        border-b
        border-border
        px-6
      "
    >
      <h1 className="font-semibold">
        Dashboard
      </h1>

      <button
        className="
          rounded-lg
          border
          border-border
          p-2
        "
      >
        <Bell className="h-4 w-4" />
      </button>
    </header>
  );
}