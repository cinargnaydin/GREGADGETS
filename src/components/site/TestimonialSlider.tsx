"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { testimonials } from "@/content/site";

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <p className="text-xl font-semibold leading-relaxed md:text-2xl">
          &quot;{testimonials[active]?.quote}&quot;
        </p>
        <p className="mt-3 text-sm font-medium text-muted">{testimonials[active]?.author}</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={clsx(
              "h-2.5 w-2.5 rounded-full bg-black/20",
              active === index && "bg-brand-red"
            )}
            aria-label={`Show review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
