"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const fetchFeedbacks = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/feedback",{ 
        credentials: "include"
      }
    );
    const data = await res.json();
    setFeedbacks(data.feedbacks || []);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const toggle = async (id: string) => {
    await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/feedback/${id}/toggle`,
      { credentials: "include",
        method: "PATCH" }
    );

    fetchFeedbacks();
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-white">
        Customer Feedback
      </h1>

      <div className="space-y-4">

        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="border border-[#252525] bg-[#141414] p-5 rounded-xl"
          >

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-white font-semibold">
                  {fb.customerName}
                </h2>

                <p className="text-sm text-[#8a8a8a]">
                  {fb.route || "General Trip"}
                </p>
              </div>

              {/* TOGGLE */}
              <Button
                onClick={() => toggle(fb.id)}
                className={`${
                  fb.showOnWebsite
                    ? "bg-green-500 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {fb.showOnWebsite ? "Visible" : "Hidden"}
              </Button>

            </div>

            <p className="mt-3 text-[#c7c7c7]">
              {fb.comments}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}