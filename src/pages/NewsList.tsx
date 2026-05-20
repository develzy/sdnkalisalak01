import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { api } from "../services/api";
import { NewsCardSkeleton } from "../components/Skeleton";

export const NewsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set document title
  useEffect(() => {
    document.title = "Kabar Berita & Kegiatan - SDN Kalisalak 01";
  }, []);

  // Fetch categories & news
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await api.getCategories();
        setCategories(catRes);
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const data = await api.getNews({
          category: categoryParam,
          q: searchParams.get("q") || "",
        });
        setNews(data);
      } catch (err) {
        console.error("Gagal memuat berita:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [categoryParam, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set("q", searchTerm);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set("category", slug);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const formatSqlDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="profile-hero" style={{ padding: "40px 0" }}>
        <div className="container">
          <h1>Portal Berita & Kegiatan</h1>
          <p>Dapatkan kabar terbaru dan prestasi membanggakan dari SDN Kalisalak 01</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px" }}>
        {/* Search and Filters Layout */}
        <div className="news-filter-bar">
          {/* Categories Tab list */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <button
              onClick={() => handleCategorySelect("")}
              className={`btn ${!categoryParam ? "btn-primary" : "btn-outline"}`}
              style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "13px" }}
            >
              Semua Berita
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`btn ${categoryParam === cat.slug ? "btn-primary" : "btn-outline"}`}
                style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "13px" }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%", maxWidth: "360px", position: "relative" }}>
            <input
              type="text"
              placeholder="Cari berita..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingRight: "44px", borderRadius: "30px" }}
            />
            <button
              type="submit"
              className="btn-icon"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "transparent",
              }}
              aria-label="Cari"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Search Info */}
        {searchParams.get("q") && (
          <p style={{ marginBottom: "20px", color: "var(--text-muted)", fontSize: "14px" }}>
            Menampilkan hasil pencarian untuk: <strong>"{searchParams.get("q")}"</strong>
          </p>
        )}

        {/* News Grid */}
        <div className="card-grid">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <NewsCardSkeleton key={i} />)
          ) : news.length > 0 ? (
            news.map((item) => (
              <div key={item.id} className="card-news">
                <div className="card-news-img-wrap">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600"}
                    alt={item.title}
                    className="card-news-img"
                    loading="lazy"
                  />
                  <span className="card-news-badge">{item.category_name || "Kabar"}</span>
                </div>
                <div className="card-news-body">
                  <div className="card-news-meta">
                    <span><Calendar size={12} /> {formatSqlDate(item.created_at)}</span>
                    <span>View: {item.views}</span>
                  </div>
                  <h3 className="card-news-title">
                    <Link to={`/berita/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="card-news-excerpt" dangerouslySetInnerHTML={{ __html: item.content }}></p>
                  <div className="card-news-footer">
                    <span className="card-news-author">{item.author}</span>
                    <Link to={`/berita/${item.slug}`} className="card-news-more">
                      Baca Lengkap <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "span 3", textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "16px" }}>
                Tidak ada berita yang ditemukan.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSearchParams({});
                }}
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
