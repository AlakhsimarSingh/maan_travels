"use client";

export default function ImageUploader() {
  return (
    <div className="rounded-2xl border border-[#252525] bg-[#141414] p-6 space-y-4">
      <h3 className="text-xl font-semibold text-white">
        Package Images
      </h3>

      <input
        type="file"
        multiple
        className="w-full text-white"
      />

      <p className="text-sm text-[#8a8a8a]">
        Upload multiple images for gallery display
      </p>
    </div>
  );
}