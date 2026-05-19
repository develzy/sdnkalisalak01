import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { StaffCardSkeleton } from "../components/Skeleton";

export const Staff: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set document title
  useEffect(() => {
    document.title = "Daftar Guru & Staf - SDN Kalisalak 01";
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await api.getStaff();
        setStaff(data);
      } catch (err) {
        console.error("Gagal memuat data guru/staff:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="profile-hero" style={{ padding: "40px 0" }}>
        <div className="container">
          <h1>Pendidik & Tenaga Kependidikan</h1>
          <p>Guru dan staf profesional SDN Kalisalak 01 yang berdedikasi tinggi membimbing putra-putri Anda</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px" }}>
        {isLoading ? (
          <div className="staff-grid">
            {Array(4)
              .fill(0)
              .map((_, i) => <StaffCardSkeleton key={i} />)}
          </div>
        ) : staff.length > 0 ? (
          <div className="staff-grid">
            {staff.map((member) => (
              <div key={member.id} className="staff-card">
                <div className="staff-img-wrap">
                  <img
                    src={member.photo_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"}
                    alt={member.name}
                    className="staff-img"
                    loading="lazy"
                  />
                </div>
                <div className="staff-info">
                  <h3 className="staff-name">{member.name}</h3>
                  <p className="staff-role">{member.role}</p>
                  <p className="staff-nip">
                    {member.nip ? `NIP. ${member.nip}` : "Tenaga Kependidikan"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
            Data guru dan staf pendidik belum tersedia.
          </p>
        )}
      </div>
    </div>
  );
};
