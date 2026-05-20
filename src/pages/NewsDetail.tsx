import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Eye, ArrowLeft, Share2, MessageSquare, Send, CornerDownRight, X } from "lucide-react";
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

  // Reply State
  const [replyingTo, setReplyingTo] = useState<{ id: number; author: string } | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

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
        parent_id: null,
      });
      setComments((prev) => [...prev, { ...result.comment, replies: [] }]);
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

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyName.trim() || !replyText.trim()) {
      addToast("Nama dan isi balasan harus diisi!", "warning");
      return;
    }
    setIsSubmittingReply(true);
    try {
      const result = await api.addComment(article.id, {
        author_name: replyName,
        comment_text: replyText,
        parent_id: replyingTo.id,
      });
      // Append reply under the parent comment
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo.id
            ? { ...c, replies: [...(c.replies || []), result.comment] }
            : c
        )
      );
      setReplyName("");
      setReplyText("");
      setReplyingTo(null);
      addToast("Balasan berhasil dikirim!", "success");
    } catch (err) {
      console.error(err);
      addToast("Gagal mengirimkan balasan.", "danger");
    } finally {
      setIsSubmittingReply(false);
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

          {/* Comments Section */}
          <div className="comments-section">
            <h2 style={{ fontSize: "22px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <MessageSquare size={20} /> Komentar ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
            </h2>

            {/* Main Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              style={{
                backgroundColor: "var(--surface)",
                padding: "20px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                marginBottom: "28px",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                <MessageSquare size={15} /> Tulis Komentar
              </h3>
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
                  rows={3}
                  placeholder="Tulis pendapat atau pertanyaan Anda..."
                  className="form-control"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmittingComment}>
                {isSubmittingComment ? "Mengirim..." : <><Send size={14} /> Kirim Komentar</>}
              </button>
            </form>

            {/* Comment List with Replies */}
            <div className="comment-list">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    {/* Comment Header */}
                    <div className="comment-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          backgroundColor: "var(--primary)", color: "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "14px", fontWeight: 700, flexShrink: 0,
                        }}>
                          {c.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="comment-author">{c.author_name}</div>
                          <div className="comment-date">{formatSqlDate(c.created_at)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (replyingTo?.id === c.id) {
                            setReplyingTo(null);
                          } else {
                            setReplyingTo({ id: c.id, author: c.author_name });
                            setReplyName("");
                            setReplyText("");
                          }
                        }}
                        style={{
                          background: "none", border: "1px solid var(--border)",
                          borderRadius: "20px", padding: "4px 12px",
                          fontSize: "12px", fontWeight: 600, cursor: "pointer",
                          color: replyingTo?.id === c.id ? "var(--danger)" : "var(--primary)",
                          display: "flex", alignItems: "center", gap: "4px",
                          transition: "all 0.2s",
                        }}
                      >
                        {replyingTo?.id === c.id ? <><X size={12} /> Batal</> : <><CornerDownRight size={12} /> Balas</>}
                      </button>
                    </div>

                    {/* Comment Text */}
                    <p className="comment-text" style={{ marginTop: "10px", marginLeft: "42px" }}>{c.comment_text}</p>

                    {/* Inline Reply Form */}
                    {replyingTo?.id === c.id && (
                      <form
                        onSubmit={handleReplySubmit}
                        style={{
                          marginTop: "14px",
                          marginLeft: "42px",
                          padding: "14px",
                          backgroundColor: "rgba(15,60,115,0.04)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border)",
                          borderLeft: "3px solid var(--primary)",
                        }}
                      >
                        <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <CornerDownRight size={12} /> Membalas komentar <strong>{replyingTo?.author}</strong>
                        </div>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <input
                            type="text"
                            placeholder="Nama Anda"
                            className="form-control"
                            value={replyName}
                            onChange={(e) => setReplyName(e.target.value)}
                            style={{ flex: 1, minWidth: "140px", padding: "8px 12px", fontSize: "13px" }}
                            required
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder={`Balas komentar ${replyingTo?.author}...`}
                          className="form-control"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{ marginBottom: "10px", fontSize: "13px" }}
                          required
                        />
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ padding: "7px 16px", fontSize: "13px" }}
                          disabled={isSubmittingReply}
                        >
                          {isSubmittingReply ? "Mengirim..." : <><Send size={12} /> Kirim Balasan</>}
                        </button>
                      </form>
                    )}

                    {/* Nested Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div style={{ marginTop: "12px", marginLeft: "42px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {c.replies.map((r: any) => (
                          <div
                            key={r.id}
                            style={{
                              backgroundColor: "rgba(15,60,115,0.03)",
                              border: "1px solid var(--border)",
                              borderLeft: "3px solid var(--secondary)",
                              borderRadius: "var(--radius-sm)",
                              padding: "12px 14px",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "4px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <CornerDownRight size={13} style={{ color: "var(--secondary-dark)" }} />
                                <div style={{
                                  width: "26px", height: "26px", borderRadius: "50%",
                                  backgroundColor: "var(--secondary)", color: "var(--primary-dark)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: "11px", fontWeight: 700, flexShrink: 0,
                                }}>
                                  {r.author_name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: "13px", fontWeight: 700 }}>{r.author_name}</span>
                              </div>
                              <span className="comment-date">{formatSqlDate(r.created_at)}</span>
                            </div>
                            <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, lineHeight: 1.6 }}>{r.comment_text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "14px", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                  Belum ada komentar. Jadilah yang pertama memberikan tanggapan!
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
