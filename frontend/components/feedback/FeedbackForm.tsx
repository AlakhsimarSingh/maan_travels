"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import BookingDatePicker from "@/components/booking/BookingDatePicker";
import StarRating from "./StarRating";
import BookingSuccess from "@/components/common/BookingSuccess";
import Reveal from "@/components/common/Reveal";

import { createFeedback } from "@/src/services/bookingService";
import FeedbackDatePicker from "./FeedbackDatePicker";

export default function FeedbackForm() {
  const [vehicleRating, setVehicleRating] = useState(0);
  const [supportRating, setSupportRating] = useState(0);

  const [travelDate, setTravelDate] = useState<Date | undefined>();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedbackId, setFeedbackId] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    route: "",
    satisfaction: "",
    driverExperience: "",
    comments: "",
    recommend: "",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.customerName || !form.satisfaction || !vehicleRating) {
      setFormError("Please add your name, satisfaction level, and a vehicle rating before submitting.");
      return;
    }

    setFormError(null);

    try {
      setLoading(true);

      const res: any = await createFeedback({
        customerName: form.customerName,
        route: form.route,
        satisfaction: form.satisfaction,
        driverExperience: form.driverExperience,
        comments: form.comments,
        recommend: form.recommend,
        vehicleRating,
        supportRating,
        travelDate: travelDate ? travelDate.toISOString() : "",
      });

      setFeedbackId(res?.feedback?.id);
      setSuccess(true);

      setForm({
        customerName: "",
        route: "",
        satisfaction: "",
        driverExperience: "",
        comments: "",
        recommend: "",
      });

      setVehicleRating(0);
      setSupportRating(0);
      setTravelDate(undefined);
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong submitting your feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        rounded-3xl border border-[#252525] bg-[#141414] p-8
        transition-all duration-700 ease-out
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
    >

      <h2 className="mb-8 text-3xl font-bold text-white">Share Your Experience</h2>

      <div className="space-y-7">

        <Reveal>
          <label className="mb-2 block text-sm text-[#c7c7c7]">Customer Name</label>
          <Input
            placeholder="Enter your name"
            value={form.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            className="transition-colors focus:border-[#ecb100]/60"
          />
        </Reveal>

        <Reveal delay={60}>
          <label className="mb-2 block text-sm text-[#c7c7c7]">Date of Travel</label>
          <FeedbackDatePicker value={travelDate} onChange={setTravelDate} />
        </Reveal>

        <Reveal delay={120}>
          <label className="mb-2 block text-sm text-[#c7c7c7]">Route / Trip Name</label>
          <Input
            placeholder="Example: Delhi - Manali"
            value={form.route}
            onChange={(e) => handleChange("route", e.target.value)}
            className="transition-colors focus:border-[#ecb100]/60"
          />
        </Reveal>

        <Reveal delay={180}>
          <label className="mb-2 block text-sm text-[#c7c7c7]">
            How satisfied were you with your overall travel experience?
          </label>
          <Select value={form.satisfaction} onValueChange={(v) => handleChange("satisfaction", v)}>
            <SelectTrigger className="bg-[#111] border-[#252525] text-white">
              <SelectValue placeholder="Select satisfaction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-satisfied">Very Satisfied</SelectItem>
              <SelectItem value="satisfied">Satisfied</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="unsatisfied">Unsatisfied</SelectItem>
              <SelectItem value="very-unsatisfied">Very Unsatisfied</SelectItem>
            </SelectContent>
          </Select>
        </Reveal>

        <Reveal delay={240}>
          <label className="mb-3 block text-sm text-[#c7c7c7]">
            How would you rate the comfort and cleanliness of the vehicle?
          </label>
          <StarRating value={vehicleRating} onChange={setVehicleRating} />
        </Reveal>

        <Reveal delay={300}>
          <label className="mb-2 block text-sm text-[#c7c7c7]">
            Was the driver punctual, polite, and professional?
          </label>
          <Select value={form.driverExperience} onValueChange={(v) => handleChange("driverExperience", v)}>
            <SelectTrigger className="bg-[#111] border-[#252525] text-white">
              <SelectValue placeholder="Select response" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="somewhat">Somewhat</SelectItem>
            </SelectContent>
          </Select>
        </Reveal>

        <Reveal delay={360}>
          <label className="mb-3 block text-sm text-[#c7c7c7]">
            How satisfied were you with the booking and support service?
          </label>
          <StarRating value={supportRating} onChange={setSupportRating} />
        </Reveal>

        <Reveal delay={420}>
          <label className="mb-2 block text-sm text-[#c7c7c7]">Suggestions or Comments</label>
          <textarea
            placeholder="Tell us how we can improve..."
            value={form.comments}
            onChange={(e) => handleChange("comments", e.target.value)}
            className="min-h-36 w-full rounded-xl border border-[#252525] bg-[#111] p-4 text-white transition-colors focus:border-[#ecb100] focus:outline-none"
          />
        </Reveal>

        <Reveal delay={480}>
          <label className="mb-2 block text-sm text-[#c7c7c7]">Would you recommend us to others?</label>
          <Select value={form.recommend} onValueChange={(v) => handleChange("recommend", v)}>
            <SelectTrigger className="bg-[#111] border-[#252525] text-white">
              <SelectValue placeholder="Select response" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </Reveal>

        {formError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {formError}
          </div>
        )}

        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#ecb100] text-black transition-transform duration-150 hover:bg-[#f6c94c] hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>

      <BookingSuccess
        open={success}
        onClose={() => setSuccess(false)}
        title="Feedback Submitted"
        showId={false}
        message="Thank you for sharing your experience!"
      />
    </div>
  );
}