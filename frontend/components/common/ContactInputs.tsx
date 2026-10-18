"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  PHONE_PLACEHOLDER,
  formatPhoneInput,
  isPhoneEmpty,
  validateEmail,
  validatePhone,
} from "@/src/lib/contactValidation";

type BaseProps = Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
  value: string;
  onChange: (value: string) => void;
  /** Force the error to show (e.g. after a submit attempt). */
  showError?: boolean;
  /** Absolutely-positioned icon, centred against the input (not the error). */
  icon?: React.ReactNode;
};

export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>;
}

/**
 * Phone field that keeps the value in "+<country code> <number>" form as
 * the user types, and shows a validation message once they leave the field.
 */
export function PhoneInput({ value, onChange, showError, onBlur, icon, ...props }: BaseProps) {
  const [touched, setTouched] = useState(false);
  // Don't nag about an untouched default prefix like "+91 " on blur.
  const error =
    (touched && !isPhoneEmpty(value)) || showError ? validatePhone(value) : null;

  return (
    <div>
      <div className="relative">
        {icon}
        <Input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={PHONE_PLACEHOLDER}
          {...props}
          value={value}
          onChange={(e) => onChange(formatPhoneInput(e.target.value))}
          onBlur={(e) => {
            setTouched(true);
            onBlur?.(e);
          }}
          aria-invalid={error ? true : undefined}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function EmailInput({
  value,
  onChange,
  showError,
  onBlur,
  icon,
  required = false,
  ...props
}: BaseProps & { required?: boolean }) {
  const [touched, setTouched] = useState(false);
  const error =
    (touched && value.trim()) || showError ? validateEmail(value, { required }) : null;

  return (
    <div>
      <div className="relative">
        {icon}
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          onBlur={(e) => {
            setTouched(true);
            onBlur?.(e);
          }}
          aria-invalid={error ? true : undefined}
        />
      </div>
      <FieldError message={error} />
    </div>
  );
}
