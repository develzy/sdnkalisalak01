import React, { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import { api } from "../services/api";

export const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set document title
  useEffect(() => {
    document.title = "Agenda Kegiatan Terdekat - SDN Kalisalak 01";
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Gagal memuat agenda:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatFullDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
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
      {/* Page Header */}
      <div className="profile-hero" style={{ padding: "40px 0" }}>
        <div className="container">
          <h1>Agenda Kegiatan Sekolah</h1>
          <p>Kalender akademik, agenda kegiatan, dan pertemuan penting SDN Kalisalak 01</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px", maxWidth: "800px" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "var(--radius)" }}></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="agenda-list">
            {events.map((evt) => {
              const { day, month } = getDayAndMonth(evt.date);
              return (
                <div key={evt.id} className="agenda-item" style={{ gridTemplateColumns: "auto 1fr" }}>
                  <div className="agenda-date-box" style={{ width: "80px", height: "80px" }}>
                    <span className="agenda-date-day" style={{ fontSize: "28px" }}>{day}</span>
                    <span className="agenda-date-month" style={{ fontSize: "12px" }}>{month}</span>
                  </div>
                  <div className="agenda-info" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h2 style={{ fontSize: "20px", color: "var(--text)", marginBottom: "8px" }}>{evt.title}</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={14} style={{ color: "var(--secondary-dark)" }} /> {formatFullDate(evt.date)}
                      </span>
                      <span className="agenda-location" style={{ fontSize: "13px" }}>
                        <MapPin size={14} style={{ color: "var(--secondary-dark)" }} /> {evt.location}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0" }}>
                      {evt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
            Tidak ada agenda kegiatan terdaftar untuk saat ini.
          </p>
        )}
      </div>
    </div>
  );
};
