"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Star, ThumbsUp, Car, Headphones, CheckCircle2, XCircle } from "lucide-react";

type Feedback = {
  id: string;
  customerName: string;
  travelDate: string | null;
  route: string | null;
  satisfaction: string | null;
  vehicleRating: number | null;
  supportRating: number | null;
  driverExperience: string | null;
  comments: string | null;
  recommend: boolean;
  showOnWebsite: boolean;
  createdAt: string;
};

function StarRow({ rating, label, icon }: { rating: number | null; label: string; icon: React.ReactNode }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-[11px] text-[#555] w-28 shrink-0">
        {icon}
        {label}
      </span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={11}
            className={s <= rating ? "text-[#ecb100] fill-[#ecb100]" : "text-[#2a2a2a] fill-[#2a2a2a]"}
          />
        ))}
      </div>
      <span className="text-[11px] text-[#555]">{rating}/5</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-[#1c1c1c] bg-[#0f0f0f] rounded-xl p-5 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-[#1c1c1c]" />
          <div className="h-3 w-24 rounded bg-[#1c1c1c]" />
        </div>
        <div className="h-8 w-24 rounded-lg bg-[#1c1c1c]" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-[#1c1c1c]" />
        <div className="h-3 w-3/4 rounded bg-[#1c1c1c]" />
      </div>
    </div>
  );
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  const fetchFeedbacks = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/feedback", {
      credentials: "include",
    });
    const data = await res.json();
    setFeedbacks(data.feedbacks || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const toggle = async (id: string) => {
    setToggling((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/feedback/${id}/toggle`,
        { credentials: "include", method: "PATCH" }
      );
      const data = await res.json();
      if (data.success) {
        setFeedbacks((prev) =>
          prev.map((fb) => (fb.id === id ? { ...fb, showOnWebsite: data.feedback.showOnWebsite } : fb))
        );
      }
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const visible = feedbacks.filter((f) => f.showOnWebsite).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-white">Customer Feedback</h1>
          <p className="text-[12px] text-[#444] mt-0.5">
            {loading ? "Loading…" : `${feedbacks.length} total · ${visible} visible on website`}
          </p>
        </div>
        {/* Legend */}
        {!loading && (
          <div className="flex items-center gap-3 text-[11px] text-[#555]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Visible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
              Hidden
            </span>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : feedbacks.map((fb) => {
              const isToggling = toggling.has(fb.id);
              const isHidden = !fb.showOnWebsite;

              return (
                <div
                  key={fb.id}
                  className={`border rounded-xl p-5 transition-colors duration-300 ${
                    isHidden
                      ? "border-[#191919] bg-[#0c0c0c]"
                      : "border-[#252525] bg-[#111]"
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Avatar initial */}
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                          isHidden ? "bg-[#1a1a1a] text-[#444]" : "bg-[#ecb10018] text-[#ecb100]"
                        }`}>
                          {fb.customerName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className={`text-[14px] font-semibold truncate ${isHidden ? "text-[#555]" : "text-white"}`}>
                          {fb.customerName}
                        </span>
                        {fb.recommend && (
                          <span className="flex items-center gap-1 rounded-full bg-[#ecb10012] px-2 py-0.5 text-[10px] text-[#ecb100]">
                            <ThumbsUp size={9} />
                            Recommends
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        {fb.route && (
                          <span className="text-[11px] text-[#555]">{fb.route}</span>
                        )}
                        {fb.travelDate && (
                          <span className="text-[11px] text-[#3a3a3a]">
                            {new Date(fb.travelDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        {fb.satisfaction && (
                          <span className={`text-[11px] capitalize ${
                            fb.satisfaction === "excellent" ? "text-green-500" :
                            fb.satisfaction === "good" ? "text-[#ecb100]" :
                            fb.satisfaction === "average" ? "text-orange-500" : "text-red-500"
                          }`}>
                            {fb.satisfaction}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Toggle button */}
                    <button
                      onClick={() => toggle(fb.id)}
                      disabled={isToggling}
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all duration-200 disabled:cursor-not-allowed ${
                        fb.showOnWebsite
                          ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "border-[#2a2a2a] bg-[#161616] text-[#555] hover:border-[#333] hover:text-[#888]"
                      }`}
                    >
                      {isToggling ? (
                        <span className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full border border-current border-t-transparent animate-spin" />
                          Saving…
                        </span>
                      ) : fb.showOnWebsite ? (
                        <>
                          <Eye size={12} />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} />
                          Hidden
                        </>
                      )}
                    </button>
                  </div>

                  {/* Ratings row */}
                  {(fb.vehicleRating || fb.supportRating) && (
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-[#161616] pt-3">
                      <StarRow
                        rating={fb.vehicleRating}
                        label="Vehicle"
                        icon={<Car size={10} />}
                      />
                      <StarRow
                        rating={fb.supportRating}
                        label="Support"
                        icon={<Headphones size={10} />}
                      />
                    </div>
                  )}

                  {/* Driver experience */}
                  {fb.driverExperience && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {fb.driverExperience === "excellent" || fb.driverExperience === "good" ? (
                        <CheckCircle2 size={11} className="text-green-500 shrink-0" />
                      ) : (
                        <XCircle size={11} className="text-red-500 shrink-0" />
                      )}
                      <span className="text-[11px] text-[#555] capitalize">
                        Driver: {fb.driverExperience}
                      </span>
                    </div>
                  )}

                  {/* Comments */}
                  {fb.comments && (
                    <p className={`mt-3 text-[13px] leading-relaxed ${isHidden ? "text-[#3a3a3a]" : "text-[#999]"}`}>
                      "{fb.comments}"
                    </p>
                  )}
                </div>
              );
            })}

        {!loading && feedbacks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Star size={32} className="text-[#222] mb-3" />
            <p className="text-[14px] text-[#444]">No feedback yet</p>
            <p className="text-[12px] text-[#333] mt-1">Submissions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}