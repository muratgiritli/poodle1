import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquarePlus, Star } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { apiRequest, queryClient } from "@/lib/queryClient";

const P = "#5D3A1A";
const PL = "#F5F0E6";
const GB = "#E8E0D4";

export interface ProductReview {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  reviewDate: string;
  createdAt?: string;
}

/** Published reviews for a product. Shared cache key with the PDP JSON-LD. */
export function useProductReviews(productId: number) {
  return useQuery<ProductReview[]>({
    queryKey: ["/api/reviews", String(productId)],
    enabled: Number.isFinite(productId) && productId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function reviewSummary(reviews: ProductReview[]) {
  if (reviews.length === 0) return { count: 0, average: 0 };
  const total = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0);
  return { count: reviews.length, average: total / reviews.length };
}

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }} aria-label={`${value.toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          size={size}
          strokeWidth={1.8}
          color="#C98A2E"
          fill={step <= Math.round(value) ? "#C98A2E" : "none"}
        />
      ))}
    </span>
  );
}

function RatingPicker({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <span style={{ display: "inline-flex", gap: 4 }} role="radiogroup" aria-label="Puan">
      {[1, 2, 3, 4, 5].map((step) => (
        <button
          key={step}
          type="button"
          role="radio"
          aria-checked={value === step}
          aria-label={`${step} yıldız`}
          onClick={() => onChange(step)}
          style={{
            display: "grid", placeItems: "center", width: 34, height: 34,
            border: "none", borderRadius: 9, background: "none", cursor: "pointer",
          }}
        >
          <Star size={22} strokeWidth={1.8} color="#C98A2E" fill={step <= value ? "#C98A2E" : "none"} />
        </button>
      ))}
    </span>
  );
}

export default function YPProductReviews({ productId }: { productId: number }) {
  const { customer } = useCustomer();
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const summary = useMemo(() => reviewSummary(reviews), [reviews]);

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState(customer?.name || "");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    if (name.trim().length < 2) { setError("Lütfen adınızı yazın."); return; }
    if (rating < 1) { setError("Lütfen bir puan seçin."); return; }
    if (comment.trim().length < 10) { setError("Yorumunuz en az 10 karakter olmalı."); return; }

    setError(null);
    setSending(true);
    try {
      await apiRequest("POST", `/api/reviews/${productId}`, {
        reviewerName: name.trim().slice(0, 100),
        rating,
        comment: comment.trim().slice(0, 2000),
      });
      setSent(true);
      setFormOpen(false);
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", String(productId)] });
    } catch {
      setError("Değerlendirme gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return null;

  return (
    <section style={{ marginBottom: 24 }} aria-label="Ürün değerlendirmeleri">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
          Değerlendirmeler{summary.count > 0 ? ` (${summary.count})` : ""}
        </h2>
        {summary.count > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <Stars value={summary.average} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#5C4B3A" }}>
              {summary.average.toFixed(1)} / 5
            </span>
          </span>
        )}
      </div>

      {sent && (
        <p style={{
          margin: "0 0 12px", padding: "11px 13px", borderRadius: 11,
          background: "#EDF6EE", border: "1px solid #CBE5CF",
          fontSize: 13, color: "#256A34", lineHeight: 1.5,
        }}>
          Değerlendirmeniz alındı. Onaylandıktan sonra bu sayfada yayınlanacak.
        </p>
      )}

      {summary.count === 0 ? (
        <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#7A6A58", lineHeight: 1.6 }}>
          Bu ürün için henüz değerlendirme yok. Ürünü denediyseniz ilk yorumu siz yazabilirsiniz.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          {reviews.map((review) => (
            <article
              key={review.id}
              style={{ background: "#fff", border: `1px solid ${GB}`, borderRadius: 12, padding: "13px 15px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                <strong style={{ fontSize: 13, fontWeight: 750, color: "#2C2118" }}>{review.reviewerName}</strong>
                <span style={{ fontSize: 11, color: "#9A8B7A" }}>{review.reviewDate}</span>
              </div>
              <div style={{ marginBottom: 7 }}><Stars value={Number(review.rating) || 0} size={13} /></div>
              <p style={{ margin: 0, fontSize: 13.5, color: "#4B5563", lineHeight: 1.6 }}>{review.comment}</p>
            </article>
          ))}
        </div>
      )}

      {!formOpen ? (
        <button
          type="button"
          onClick={() => { setFormOpen(true); setSent(false); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44,
            padding: "0 16px", border: `1.5px solid ${P}`, borderRadius: 12,
            background: PL, color: P, fontFamily: "inherit", fontSize: 13.5,
            fontWeight: 750, cursor: "pointer",
          }}
        >
          <MessageSquarePlus size={17} /> Değerlendirme yaz
        </button>
      ) : (
        <form
          onSubmit={submit}
          style={{ background: "#fff", border: `1px solid ${GB}`, borderRadius: 14, padding: 16 }}
        >
          <label style={{ display: "block", fontSize: 12, fontWeight: 750, color: "#5C4B3A", marginBottom: 6 }}>
            Adınız
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            placeholder="Adınız ve soyadınızın baş harfi"
            style={{
              width: "100%", minHeight: 44, marginBottom: 14, padding: "0 12px",
              border: `1px solid ${GB}`, borderRadius: 11, background: "#FFFCF8",
              fontFamily: "inherit", fontSize: 14, color: "#2C2118", boxSizing: "border-box",
            }}
          />

          <span style={{ display: "block", fontSize: 12, fontWeight: 750, color: "#5C4B3A", marginBottom: 4 }}>
            Puanınız
          </span>
          <div style={{ marginBottom: 12 }}><RatingPicker value={rating} onChange={setRating} /></div>

          <label style={{ display: "block", fontSize: 12, fontWeight: 750, color: "#5C4B3A", marginBottom: 6 }}>
            Yorumunuz
          </label>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Ürünü nasıl buldunuz? Poodle'ınız sevdi mi?"
            style={{
              width: "100%", marginBottom: 6, padding: "11px 12px", resize: "vertical",
              border: `1px solid ${GB}`, borderRadius: 11, background: "#FFFCF8",
              fontFamily: "inherit", fontSize: 14, color: "#2C2118", lineHeight: 1.55,
              boxSizing: "border-box",
            }}
          />
          <p style={{ margin: "0 0 12px", fontSize: 11.5, color: "#9A8B7A" }}>
            Yorumlar yayınlanmadan önce incelenir.
          </p>

          {error && (
            <p style={{ margin: "0 0 12px", fontSize: 12.5, fontWeight: 650, color: "#B4271C" }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={sending}
              style={{
                minHeight: 44, padding: "0 18px", border: "none", borderRadius: 12,
                background: sending ? "#9A8B7A" : P, color: "#fff", fontFamily: "inherit",
                fontSize: 13.5, fontWeight: 750, cursor: sending ? "progress" : "pointer",
              }}
            >
              {sending ? "Gönderiliyor…" : "Gönder"}
            </button>
            <button
              type="button"
              onClick={() => { setFormOpen(false); setError(null); }}
              style={{
                minHeight: 44, padding: "0 16px", border: `1px solid ${GB}`, borderRadius: 12,
                background: "#fff", color: "#5C4B3A", fontFamily: "inherit",
                fontSize: 13.5, fontWeight: 700, cursor: "pointer",
              }}
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
