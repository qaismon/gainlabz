import { useState, useEffect, useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Star, ImagePlus, X, ThumbsUp, Clock, SortAsc, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import StarRating from "./StarRating"
import API_BASE_URL from "../services/api"

function RatingBar({ label, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-right text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-xs text-gray-500 dark:text-gray-400">{count}</span>
    </div>
  )
}

function ReviewCard({ review, onDelete, currentUserId }) {
  const imgUrl = (src) => {
    if (!src || typeof src !== "string") return "/placeholder.png"
    if (src.startsWith("data:") || src.startsWith("http")) return src
    const base = API_BASE_URL.replace("/api", "")
    return `${base}/${src}`
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm">
            {(review.user?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{review.user?.name || "Anonymous"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} readonly size={14} />
              {review.verifiedPurchase && (
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
          {currentUserId === review.user?._id && (
            <button
              onClick={() => onDelete(review._id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {review.title && (
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-3 text-sm">{review.title}</h4>
      )}
      {review.comment && (
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">{review.comment}</p>
      )}

      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {review.images.map((img, i) => (
            <img
              key={i}
              src={imgUrl(img)}
              alt={`Review image ${i + 1}`}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ReviewSection({ productId }) {
  const { isLoggedIn, userToken } = useContext(ShopContext)
  const navigate = useNavigate()

  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({ rating: 0, title: "", comment: "" })
  const [files, setFiles] = useState([])

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}?page=${page}&limit=8&sort=${sort}`)
      const data = await res.json()
      if (data.success) {
        setReviews(data.reviews)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error("Failed to load reviews", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${productId}/stats`)
      const data = await res.json()
      if (data.success) setStats(data.stats)
    } catch (err) {
      console.error("Failed to load stats", err)
    }
  }

  useEffect(() => { fetchReviews() }, [productId, page, sort])
  useEffect(() => { fetchStats() }, [productId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.rating === 0) return toast.error("Please select a rating")
    if (!form.title.trim()) return toast.error("Please add a review title")
    if (!isLoggedIn) return navigate("/login")

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("product", productId)
      fd.append("rating", form.rating)
      fd.append("title", form.title.trim())
      fd.append("comment", form.comment.trim())
      files.forEach((f) => fd.append("images", f))

      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
        body: fd
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Review submitted!")
        setForm({ rating: 0, title: "", comment: "" })
        setFiles([])
        setShowForm(false)
        fetchReviews()
        fetchStats()
      } else {
        toast.error(data.message || "Failed to submit review")
      }
    } catch (err) {
      toast.error("Server error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm("Delete this review?")) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` }
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Review deleted")
        fetchReviews()
        fetchStats()
      }
    } catch (err) {
      toast.error("Failed to delete")
    }
  }

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Star size={24} className="text-yellow-400 fill-yellow-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reviews</h2>
        </div>
        <button
          onClick={() => isLoggedIn ? setShowForm(!showForm) : navigate("/login")}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-bold transition-all active:scale-95"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Stats Summary */}
      {stats && stats.total > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-8">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-5xl font-black text-gray-900 dark:text-gray-100">{stats.average}</span>
            <StarRating rating={Math.round(stats.average)} readonly size={16} />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stats.total} review{stats.total !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar key={star} label={star} count={stats.distribution[star] || 0} total={stats.total} />
            ))}
          </div>
        </div>
      )}

      {/* Write Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
            <StarRating rating={form.rating} onRate={(r) => setForm((f) => ({ ...f, rating: r }))} size={28} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Give your review a title"
              maxLength={100}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comment</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="What did you think of this product?"
              rows={3}
              maxLength={1000}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photos (optional, max 5)</label>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                <ImagePlus size={18} />
                Upload
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files)].slice(0, 5))}
                />
              </label>
              {files.map((f, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
                  {f.name.length > 20 ? f.name.slice(0, 20) + "..." : f.name}
                  <button type="button" onClick={() => removeFile(i)} className="ml-1 text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Sort */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-end gap-2 mb-4">
          <SortAsc size={16} className="text-gray-500" />
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1) }}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard key={r._id} review={r} onDelete={handleDelete} currentUserId={r.user?._id} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                page === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
