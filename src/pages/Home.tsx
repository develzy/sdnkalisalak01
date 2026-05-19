import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ChevronRight, Megaphone } from "lucide-react";
import { api } from "../services/api";
import { NewsCardSkeleton } from "../components/Skeleton";


export const Home: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [prestasi, setPrestasi] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set document title
  useEffect(() => {
    document.title = "SDN KALISALAK 01 - Portal Resmi Berita & Informasi Sekolah";
  }, []);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch all needed dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, announcementsRes, eventsRes, galleryRes, profileRes, slidesRes] = await Promise.all([
          api.getNews({ limit: 6 }),
          api.getAnnouncements(),
          api.getEvents(),
          api.getGallery(),
          api.getProfile().catch(() => null),
          api.getSlides().catch(() => []),
        ]);
        
        // Filter latest news
        setNews(newsRes.filter((item: any) => item.category_slug !== "prestasi-siswa").slice(0, 3));
        setPrestasi(newsRes.filter((item: any) => item.category_slug === "prestasi-siswa").slice(0, 3));
        setAnnouncements(announcementsRes.slice(0, 3));
        setEvents(eventsRes.slice(0, 3));
        setGallery(galleryRes.slice(0, 4));
        if (profileRes) setProfile(profileRes);
        if (slidesRes.length > 0) setSlides(slidesRes);
      } catch (err) {
        console.error("Gagal memuat data utama:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slide Auto rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const formatSqlDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getDayAndMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const day = d.getDate();
      const month = d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase();
      return { day, month };
    } catch {
      return { day: "?", month: "MEI" };
    }
  };

  return (
    <div>
      {/* 1. Hero Banner Slider */}
      <section className="hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div key={slide.id ?? index} className={`hero-slide ${index === currentSlide ? "active" : ""}`}>
              <img src={slide.image_url} alt={slide.title} className="hero-image" />
              <div className="container">
                <div className="hero-content">
                  <span className="hero-badge">{slide.badge}</span>
                  <h2 className="hero-title">{slide.title}</h2>
                  <p className="hero-desc">{slide.description}</p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Link to="/profil" className="btn btn-secondary">
                      Profil Sekolah
                    </Link>
                    <Link to="/berita" className="btn btn-outline" style={{ color: "white", borderColor: "white" }}>
                      Lihat Berita
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-arrows">
          <button
            className="hero-arrow"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            aria-label="Slide Sebelumnya"
          >
            &lt;
          </button>
          <button
            className="hero-arrow"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            aria-label="Slide Berikutnya"
          >
            &gt;
          </button>
        </div>
      </section>

      {/* 2. Info Ribbon */}
      <div className="info-ribbon">
        <div className="container ribbon-container">
          <span className="ribbon-badge" style={{ zIndex: 10 }}>Penting</span>
          <div className="marquee-container ribbon-text">
            <div className="marquee-content">
              Selamat Datang di Portal Resmi SDN Kalisalak 01 Margasari, Tegal • Pendaftaran PPDB Tahun Ajaran 2026/2027 dibuka mulai 15 Juni 2026 secara online & offline • Ujian Penilaian Akhir Tahun (PAT) akan dilaksanakan mulai tanggal 1 Juni 2026.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sambutan Kepala Sekolah */}
      <section className="welcome-section">
        <div className="container welcome-grid">
          <div className="welcome-img-wrap">
            <img
              src={profile?.sambutan_foto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"}
              alt={profile?.sambutan_nama || "Kepala Sekolah SDN Kalisalak 01"}
              className="welcome-img"
            />
          </div>
          <div className="welcome-content">
            <h3>Sambutan Kepala Sekolah</h3>
            <h2>{profile?.sambutan_judul || "Mewujudkan Sekolah Sehat & Berprestasi"}</h2>
            {profile?.sambutan_isi ? (
              <div dangerouslySetInnerHTML={{ __html: profile.sambutan_isi }} className="rich-content" />
            ) : (
              <>
                <p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                <p>
                  Salam sejahtera bagi kita semua. Kami ucapkan selamat datang di website portal resmi SDN Kalisalak 01 Margasari. Melalui platform digital ini, kami berkomitmen untuk menyediakan sarana informasi yang cepat, transparan, dan terpercaya bagi seluruh wali murid, guru, staf, serta masyarakat umum mengenai seluruh kegiatan dan perkembangan di sekolah kami.
                </p>
                <p>
                  Sebagai salah satu sekolah dasar unggulan di Kabupaten Tegal, kami berdedikasi tinggi untuk melahirkan tunas-tunas bangsa yang berkarakter islami/religius, sehat fisik dan mental, serta kompetitif dalam prestasi akademis maupun non-akademis. Kami percaya sinergi yang kuat antara sekolah, orang tua, dan masyarakat adalah kunci utama kesuksesan belajar anak didik kita.
                </p>
              </>
            )}
            <div className="welcome-author">
              <h4>{profile?.sambutan_nama || "Bambang Setiawan, S.Pd., M.Pd."}</h4>
              <p>{profile?.sambutan_jabatan || "Kepala Sekolah SDN Kalisalak 01"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Berita Terbaru */}
      <section style={{ padding: "48px 0" }}>
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Berita Terbaru</h2>
            <Link to="/berita" className="btn-outline btn" style={{ padding: "6px 12px", fontSize: "12px" }}>
              Selengkapnya <ChevronRight size={14} />
            </Link>
          </div>

          <div className="card-grid">
            {isLoading ? (
              Array(3)
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
                    <span className="card-news-badge">{item.category_name || "Berita"}</span>
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
                        Baca <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: "span 3", textAlign: "center", color: "var(--text-muted)" }}>
                Belum ada berita dipublikasikan.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. Prestasi Siswa */}
      <section style={{ padding: "48px 0", backgroundColor: "rgba(15, 60, 115, 0.02)" }}>
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Prestasi Siswa</h2>
            <Link to="/berita?category=prestasi-siswa" className="btn-outline btn" style={{ padding: "6px 12px", fontSize: "12px" }}>
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>

          <div className="card-grid">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => <NewsCardSkeleton key={i} />)
            ) : prestasi.length > 0 ? (
              prestasi.map((item) => (
                <div key={item.id} className="card-news">
                  <div className="card-news-img-wrap" style={{ borderColor: "var(--secondary)" }}>
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600"}
                      alt={item.title}
                      className="card-news-img"
                      loading="lazy"
                    />
                    <span className="card-news-badge" style={{ backgroundColor: "var(--secondary)", color: "var(--primary-dark)" }}>
                      Prestasi
                    </span>
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
                        Selengkapnya <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: "span 3", textAlign: "center", color: "var(--text-muted)" }}>
                Belum ada prestasi siswa terbaru.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 6. Pengumuman & Agenda Grid */}
      <section style={{ padding: "48px 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* Announcements Col */}
          <div>
            <div className="section-title-wrap">
              <h2 className="section-title">Pengumuman Terbaru</h2>
              <Link to="/pengumuman" className="btn-outline btn" style={{ padding: "6px 12px", fontSize: "12px" }}>
                Semua <ChevronRight size={14} />
              </Link>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "var(--radius)" }}></div>
                ))
              ) : announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann.id} className="announcement-card" style={{ marginBottom: "0" }}>
                    <Link to="/pengumuman" className="announcement-header" style={{ cursor: "pointer" }}>
                      <div className="announcement-title-wrap">
                        <Megaphone className="announcement-pin" size={16} />
                        <span className="announcement-title">{ann.title}</span>
                      </div>
                      <span className="announcement-date">{formatSqlDate(ann.created_at)}</span>
                    </Link>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)" }}>Tidak ada pengumuman baru.</p>
              )}
            </div>
          </div>

          {/* Agenda Col */}
          <div>
            <div className="section-title-wrap">
              <h2 className="section-title">Agenda Terdekat</h2>
              <Link to="/agenda" className="btn-outline btn" style={{ padding: "6px 12px", fontSize: "12px" }}>
                Semua <ChevronRight size={14} />
              </Link>
            </div>

            <div className="agenda-list" style={{ marginBottom: "0" }}>
              {isLoading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: "100px", borderRadius: "var(--radius)" }}></div>
                ))
              ) : events.length > 0 ? (
                events.map((evt) => {
                  const { day, month } = getDayAndMonth(evt.date);
                  return (
                    <div key={evt.id} className="agenda-item" style={{ gridTemplateColumns: "auto 1fr" }}>
                      <div className="agenda-date-box">
                        <span className="agenda-date-day">{day}</span>
                        <span className="agenda-date-month">{month}</span>
                      </div>
                      <div className="agenda-info">
                        <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{evt.title}</h3>
                        <p><MapPin size={12} /> {evt.location}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>{evt.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "var(--text-muted)" }}>Tidak ada agenda terdekat.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Galeri Singkat */}
      <section style={{ padding: "48px 0", backgroundColor: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title">Galeri Kegiatan</h2>
            <Link to="/galeri" className="btn-outline btn" style={{ padding: "6px 12px", fontSize: "12px" }}>
              Lihat Album <ChevronRight size={14} />
            </Link>
          </div>

          <div className="gallery-grid" style={{ marginBottom: "0" }}>
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "180px", borderRadius: "var(--radius)" }}></div>
              ))
            ) : gallery.length > 0 ? (
              gallery.map((item) => (
                <div key={item.id} className="gallery-item">
                  <img src={item.image_url} alt={item.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: "span 4", textAlign: "center", color: "var(--text-muted)" }}>
                Belum ada foto galeri diunggah.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
