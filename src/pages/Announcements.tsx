import React, { useState, useEffect } from "react";
import { Megaphone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../services/api";

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set document title
  useEffect(() => {
    document.title = "Pengumuman Resmi Sekolah - SDN Kalisalak 01";
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
        // Expand the first announcement by default if present
        if (data.length > 0) {
          setExpandedId(data[0].id);
        }
      } catch (err) {
        console.error("Gagal memuat pengumuman:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatSqlDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="profile-hero" style={{ padding: "40px 0" }}>
        <div className="container">
          <h1>Pengumuman Sekolah</h1>
          <p>Informasi resmi, maklumat, dan pengumuman akademik SDN Kalisalak 01</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px", maxWidth: "800px" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "var(--radius)" }}></div>
            ))}
          </div>
        ) : announcements.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {announcements.map((ann) => {
              const isExpanded = expandedId === ann.id;
              return (
                <div key={ann.id} className="announcement-card" style={{ borderColor: isExpanded ? "var(--secondary)" : "var(--border)" }}>
                  <div className="announcement-header" onClick={() => toggleExpand(ann.id)}>
                    <div className="announcement-title-wrap">
                      <Megaphone className="announcement-pin" size={18} style={{ color: isExpanded ? "var(--secondary-dark)" : "var(--text-muted)" }} />
                      <span className="announcement-title" style={{ fontSize: "16px", color: isExpanded ? "var(--primary)" : "var(--text)" }}>{ann.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="announcement-date" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={12} /> {formatSqlDate(ann.created_at)}
                      </span>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="announcement-body" dangerouslySetInnerHTML={{ __html: ann.content }}></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
            Tidak ada pengumuman yang sedang aktif saat ini.
          </p>
        )}
      </div>
    </div>
  );
};
