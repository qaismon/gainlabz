import { useState } from "react"
import { Star } from "lucide-react"

export default function StarRating({ rating = 0, onRate, readonly = false, size = 18 }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => onRate?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-transform ${
            !readonly && "hover:scale-110"
          }`}
        >
          <Star
            size={size}
            className={`${
              star <= (hovered || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}
