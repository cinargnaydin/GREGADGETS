import { testimonials } from "@/content/site";
import { Star } from "lucide-react";

export default function TestimonialSlider() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="premium-card rounded-2xl p-5 flex flex-col hover:-translate-y-1 transition-transform duration-300"
        >
          <div className="flex gap-1 mb-3 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="text-sm font-medium leading-relaxed mb-4 flex-grow text-black">
            &quot;{testimonial.quote}&quot;
          </p>
          <p className="mt-auto text-xs font-bold text-black/70">
            {testimonial.author}
          </p>
        </div>
      ))}
    </div>
  );
}
