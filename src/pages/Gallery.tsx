import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { api } from "../services/api";

export const Gallery: React.FC = () => {
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  // Set document title
  useEffect(() => {
    document.title = "Galeri Foto Kegiatan - SDN Kalisalak 01";
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        setGallery(data);
      } catch (err) {
        console.error("Gagal memuat galeri:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (index: number) => {
    setActivePhotoIdx(index);
  };

  const closeLightbox = () => {
    setActivePhotoIdx(null);
  };

  const navigateLightbox = (dir: "next" | "prev", e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx === null) return;
    if (dir === "next") {
      setActivePhotoIdx((prev) => (prev! + 1) % gallery.length);
    } else {
      setActivePhotoIdx((prev) => (prev! - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="profile-hero" style={{ padding: "40px 0" }}>
        <div className="container">
          <h1>Galeri Foto Sekolah</h1>
          <p>Dokumentasi visual berbagai kegiatan, perlombaan, dan sarana prasarana SDN Kalisalak 01</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px" }}>
        {isLoading ? (
          <div className="gallery-grid">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "200px", borderRadius: "var(--radius)" }}></div>
            ))}
          </div>
        ) : gallery.length > 0 ? (
          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <div key={item.id} className="gallery-item" onClick={() => openLightbox(index)}>
                <img src={item.image_url} alt={item.title} className="gallery-img" loading="lazy" />
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                  <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <ZoomIn size={12} /> Klik untuk memperbesar
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
            Belum ada dokumentasi foto kegiatan saat ini.
          </p>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close Lightbox">
            <X size={24} />
          </button>
          
          <button className="lightbox-nav lightbox-prev" onClick={(e) => navigateLightbox("prev", e)} aria-label="Previous">
            <ChevronLeft size={28} />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[activePhotoIdx].image_url}
              alt={gallery[activePhotoIdx].title}
              className="lightbox-img"
            />
            <div className="lightbox-caption">
              <h3>{gallery[activePhotoIdx].title}</h3>
              {gallery[activePhotoIdx].description && <p>{gallery[activePhotoIdx].description}</p>}
            </div>
          </div>

          <button className="lightbox-nav lightbox-next" onClick={(e) => navigateLightbox("next", e)} aria-label="Next">
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
};
