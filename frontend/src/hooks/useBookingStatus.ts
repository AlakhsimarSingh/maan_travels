"use client";

import { useState } from "react";

export function useBookingStatus() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | undefined>();

  const start = () => {
    setLoading(true);
    setSuccess(false);
  };

  const done = (id?: string) => {
    setLoading(false);
    setSuccess(true);
    setBookingId(id);
  };

  const reset = () => {
    setLoading(false);
    setSuccess(false);
    setBookingId(undefined);
  };

  return {
    loading,
    success,
    bookingId,
    start,
    done,
    reset,
  };
}