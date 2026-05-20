import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Eye, ArrowLeft, Share2, MessageSquare, Send } from "lucide-react";
import { api } from "../services/api";
import { DetailSkeleton } from "../components/Skeleton";
import { Toast } from "../components/Toast";
import type { ToastMessage } from "../components/Toast";

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Comment Form State
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Set document title dynamically
  useEffect(() => {
    if (article) {
      document.title = `${article.title} - SDN Kalisalak 01`;
    } else {
      document.title = "Detail Berita - SDN Kalisalak 01";
    }
  }, [article]);

  const addToast = (message: string, type: "success" | "warning" | "danger" | "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const fetchArticleData = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        // Fetch article details
        const detail = await api.getNewsDetail(slug);
        setArticle(detail);

        // Fetch comments for this article
        const commentList = await api.getComments(detail.id);
        setComments(commentList);

        // Fetch related articles
        const newsList = await api.getNews({ limit: 4 });
        setRelated(newsList.filter((item: any) => item.id !== detail.id).slice(0, 3));
      } catch (err) {
        console.error("Gagal memuat detail berita:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) {
      addToast("Nama dan isi komentar harus diisi!", "warning");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const result = await api.addComment(article.id, {
        author_name: commentName,
        comment_text: commentText,
      });
      setComments((prev) => [result.comment, ...prev]);
      setCommentName("");
      setCommentText("");
      addToast("Komentar Anda berhasil ditambahkan!", "success");
    } catch (err) {
      console.error(err);
      addToast("Gagal mengirimkan komentar.", "danger");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const shareArticle = (platform: "wa" | "fb" | "tg" | "copy") => {
    const currentUrl = window.location.href;
    const shareText = `Baca berita terbaru dari SDN Kalisalak 01: "${article.title}"\n${currentUrl}`;

    switch (platform) {
      case "wa":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "fb":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
        break;
      case "tg":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(currentUrl);
        addToast("Tautan berita berhasil disalin!", "success");
        break;
    }
  };

  const formatSqlDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <DetailSkeleton />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>Berita Tidak Ditemukan</h2>
        <p style={{ color: "var(--text-muted)", margin: "16px 0" }}>
          Kabar berita yang Anda cari mungkin telah dihapus atau dipindahkan.
        </p>
        <Link to="/berita" className="btn btn-primary">
          <ArrowLeft size={16} /> Kembali ke Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 16px 80px 16px" }}>
      {/* Toast Notifier */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Link to="/berita" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)" }}>
          <ArrowLeft size={16} /> Kembali ke Portal Berita
        </Link>
      </div>

      <div className="news-detail-grid">
        {/* Main Content Column */}
        <article>
          <span
            className="card-news-badge"
            style={{ position: "static", display: "inline-block", marginBottom: "16px" }}
          >
            {article.category_name || "Berita"}
          </span>
          <h1 className="news-detail-title">
            {article.title}
          </h1>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              color: "var(--text-muted)",
              fontSize: "14px",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "16px",
              marginBottom: "24px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={16} /> {article.author}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={16} /> {formatSqlDate(article.created_at)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Eye size={16} /> Dibaca {article.views} kali
            </span>
          </div>

          <div className="news-detail-hero-img">
            <img
              src={article.image_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800"}
              alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Body Content */}
          <div
            className="news-detail-content"
            style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--text)", marginBottom: "40px" }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>

          {/* Share Section */}
          <div className="news-share-section">
            <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <Share2 size={16} /> Bagikan:
            </span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                className="btn btn-outline"
                style={{ padding: "6px 14px", fontSize: "12px", borderColor: "#25d366", color: "#25d366" }}
                onClick={() => shareArticle("wa")}
              >
                WhatsApp
              </button>
              <button
                className="btn btn-outline"
                style={{ padding: "6px 14px", fontSize: "12px", borderColor: "#1877f2", color: "#1877f2" }}
                onClick={() => shareArticle("fb")}
              >
                Facebook
              </button>
              <button
                className="btn btn-outline"
                style={{ padding: "6px 14px", fontSize: "12px", borderColor: "#0088cc", color: "#0088cc" }}
                onClick={() => shareArticle("tg")}
              >
                Telegram
              </button>
              <button
                className="btn btn-primary"
                style={{ padding: "6px 14px", fontSize: "12px" }}
                onClick={() => shareArticle("copy")}
              >
                Salin
              </button>
            </div>
          </div>

          {/* Simple Comments Section */}
          <div className="comments-section">
            <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageSquare size={20} /> Komentar ({comments.length})
            </h2>

            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              style={{
                marginTop: "20px",
                backgroundColor: "var(--surface)",
                padding: "24px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <h3 style={{ fontSize: "15px", marginBottom: "16px" }}>Tulis Komentar</h3>
              <div className="form-group">
                <label className="form-label">Nama Anda</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  className="form-control"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Isi Komentar</label>
                <textarea
                  rows={4}
                  placeholder="Tulis pendapat atau pertanyaan Anda di sini..."
                  className="form-control"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmittingComment}>
                {isSubmittingComment ? "Mengirim..." : (
                  <>
                    Kirim Komentar <Send size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Comment List */}
            <div className="comment-list">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{c.author_name}</span>
                      <span className="comment-date">{formatSqlDate(c.created_at)}</span>
                    </div>
                    <p className="comment-text">{c.comment_text}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                  Belum ada komentar untuk berita ini. Jadilah yang pertama memberikan tanggapan!
                </p>
              )}
            </div>
          </div>
        </article>

        {/* Sidebar Column */}
        <aside>
          <div
            style={{
              position: "sticky",
              top: "100px",
              backgroundColor: "var(--surface)",
              padding: "24px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
          >
            <h3 style={{ fontSize: "18px", color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "8px", marginBottom: "20px" }}>
              Kabar Populer
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {related.length > 0 ? (
                related.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "12px" }}>
                    <div style={{ width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, backgroundColor: "#cbd5e1" }}>
                      <img src={item.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, lineHeight: "1.3", margin: "0 0 4px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                      </h4>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {formatSqlDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>Tidak ada berita terkait.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
