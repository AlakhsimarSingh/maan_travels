"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);
      setVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-[60]
        flex items-center justify-center
        transition-all duration-300
        ${
          visible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0"
        }
      `}
      aria-label="Scroll to top"
    >
      <svg width="60" height="60" className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#252525"
          strokeWidth="4"
          fill="none"
        />

        {/* Progress circle */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#ecb100"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Arrow Icon */}
      <div
        className="
          absolute
          flex h-10 w-10 items-center justify-center
          rounded-full
          bg-[#0a0a0a]
          border border-[#252525]
          text-[#ecb100]
          hover:bg-[#ecb100]
          hover:text-black
          transition
        "
      >
        <ArrowUp size={18} />
      </div>
    </button>
  );
}