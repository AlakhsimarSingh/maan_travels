/**
 * Shared phone / email formatting + validation for every customer-facing form.
 *
 * Phone numbers are stored as "+<country code> <number>", e.g.
 * "+91 9501038811" or "+1 4155552671". One canonical format keeps customer
 * de-duplication (exact phone match in the backend) working across forms.
 */

// ITU country calling codes. The set is prefix-free (no code is the start of
// another), so the code in a run of digits can be found unambiguously —
// which lets us insert the space after the code automatically as people type.
const CALLING_CODES = new Set(
  (
    "1 7 20 27 30 31 32 33 34 36 39 40 41 43 44 45 46 47 48 49 51 52 53 54 55 56 57 58 " +
    "60 61 62 63 64 65 66 81 82 84 86 90 91 92 93 94 95 98 " +
    "211 212 213 216 218 220 221 222 223 224 225 226 227 228 229 230 231 232 233 234 235 " +
    "236 237 238 239 240 241 242 243 244 245 246 247 248 249 250 251 252 253 254 255 256 " +
    "257 258 260 261 262 263 264 265 266 267 268 269 290 291 297 298 299 " +
    "350 351 352 353 354 355 356 357 358 359 370 371 372 373 374 375 376 377 378 380 381 " +
    "382 383 385 386 387 389 420 421 423 " +
    "500 501 502 503 504 505 506 507 508 509 590 591 592 593 594 595 596 597 598 599 " +
    "670 672 673 674 675 676 677 678 679 680 681 682 683 685 686 687 688 689 690 691 692 " +
    "850 852 853 855 856 880 886 " +
    "960 961 962 963 964 965 966 967 968 970 971 972 973 974 975 976 977 992 993 994 995 996 998"
  ).split(" ")
);

export const DEFAULT_PHONE_PREFIX = "+91 ";
export const PHONE_PLACEHOLDER = "+91 9501038811";

const MAX_NATIONAL_DIGITS = 14;

function splitCountryCode(digits: string): { code: string; national: string } | null {
  for (let len = 1; len <= 3 && len <= digits.length; len++) {
    const code = digits.slice(0, len);
    if (CALLING_CODES.has(code)) return { code, national: digits.slice(len) };
  }
  return null;
}

/**
 * Normalises phone input as the user types (or pastes) into
 * "+<code> <number>". Strips anything that isn't a digit, forces a single
 * leading "+", and places the space after the country code automatically.
 */
export function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return raw.includes("+") ? "+" : "";

  if (!raw.trim().startsWith("+")) {
    if (digits.startsWith("00")) {
      // "0091 98..." — international dialling prefix instead of "+".
      digits = digits.slice(2);
    } else {
      // No "+" means a local number was typed or pasted (e.g. "9501038811"
      // or "09501038811") — treat it as Indian rather than reading its first
      // digits as some other country's code.
      digits = `91${digits.replace(/^0+/, "")}`;
    }
  }

  const split = splitCountryCode(digits);
  if (!split) {
    // Still typing the country code (or it isn't a real one — validation
    // will flag that). Never more than 3 digits of code.
    return `+${digits.slice(0, 3)}`;
  }

  // Indian numbers are sometimes written with a trunk "0" (+91 098...).
  const nationalDigits = split.code === "91" ? split.national.replace(/^0+/, "") : split.national;
  const national = nationalDigits.slice(0, MAX_NATIONAL_DIGITS);
  if (!national) {
    // Keep the trailing space only if the user typed it, so backspace works.
    return /\s$/.test(raw) ? `+${split.code} ` : `+${split.code}`;
  }
  return `+${split.code} ${national}`;
}

/** Returns an error message, or null if the phone number is valid. */
export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Enter your phone number";

  const split = splitCountryCode(digits);
  if (!split) return "Start with a valid country code, e.g. +91";
  if (!split.national) return "Enter your phone number after the country code";

  if (split.code === "91") {
    return /^[6-9]\d{9}$/.test(split.national)
      ? null
      : "Enter a valid 10-digit Indian mobile number, e.g. +91 9501038811";
  }

  return split.national.length >= 6 && split.national.length <= MAX_NATIONAL_DIGITS
    ? null
    : "Enter a valid phone number with country code, e.g. +1 4155552671";
}

export function isValidPhone(value: string): boolean {
  return validatePhone(value) === null;
}

/** True when the field holds nothing beyond the default/partial prefix. */
export function isPhoneEmpty(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return !digits || !splitCountryCode(digits)?.national;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/**
 * Returns an error message, or null if valid. Pass `required: false` for
 * optional email fields — an empty value is then accepted.
 */
export function validateEmail(value: string, { required = true } = {}): string | null {
  const trimmed = value.trim();
  if (!trimmed) return required ? "Enter your email address" : null;
  return EMAIL_REGEX.test(trimmed) ? null : "Enter a valid email address, e.g. name@example.com";
}

export function isValidEmail(value: string): boolean {
  return validateEmail(value) === null;
}
