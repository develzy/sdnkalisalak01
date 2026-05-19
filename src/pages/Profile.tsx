import React, { useEffect, useState } from "react";
import { Award, BookOpen, MapPin, ShieldAlert, Activity } from "lucide-react";
import { api } from "../services/api";
import { Skeleton } from "../components/Skeleton";

interface SchoolProfile {
  nama_sekolah: string;
  npsn: string;
  akreditasi: string;
  bentuk_pendidikan: string;
  status_sekolah: string;
  jenjang_pendidikan: string;
  sk_pendirian: string;
  kurikulum: string;
  alamat: string;
  sejarah: string;
  visi: string;
  misi: string;
  fasilitas: string;
}

const DEFAULT_PROFILE: SchoolProfile = {
  nama_sekolah: "SD NEGERI KALISALAK 01",
  npsn: "20325895",
  akreditasi: "B",
  bentuk_pendidikan: "SD",
  status_sekolah: "NEGERI",
  jenjang_pendidikan: "DIKDAS",
  sk_pendirian: "01-01-1910",
  kurikulum: "Kurikulum Merdeka",
  alamat: "Jl. K. Abdul Latif, Kalisalak, Kec. Margasari, Kab. Tegal, Prov. Jawa Tengah",
  sejarah: `
    <p>SDN Kalisalak 01 didirikan pada tahun 1910 untuk memenuhi kebutuhan akses pendidikan dasar bagi anak-anak di Desa Kalisalak dan sekitarnya di wilayah Kecamatan Margasari, Kabupaten Tegal.</p>
    <p>Seiring berjalannya waktu, sekolah ini terus mengalami perkembangan baik dari segi sarana prasarana maupun mutu pengajaran. Berkat dedikasi para guru dan dukungan berkelanjutan komite sekolah, SDN Kalisalak 01 terus meningkatkan mutu pendidikannya.</p>
    <p>Kini, SDN Kalisalak 01 dipercaya sebagai salah satu sekolah rujukan di Kecamatan Margasari dalam penerapan Perilaku Hidup Bersih Sehat (PHBS) dan sekolah pelaksana Kurikulum Merdeka yang adaptif dan ramah anak.</p>
  `,
  visi: `"Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Berprestasi, Sehat, dan Peduli Lingkungan Berlandaskan Nilai-Nilai Pancasila."`,
  misi: `
    <li>Menanamkan keimanan, ketakwaan, dan pembiasaan akhlak mulia melalui program keagamaan rutin.</li>
    <li>Menyelenggarakan pembelajaran Kurikulum Merdeka secara aktif, inovatif, kreatif, efektif, dan menyenangkan (PAIKEM).</li>
    <li>Membina dan memfasilitasi pengembangan potensi, minat, dan bakat siswa di bidang akademis serta non-akademis.</li>
    <li>Membudayakan perilaku hidup bersih dan sehat (PHBS) serta memelihara lingkungan sekolah agar tetap asri, sejuk, dan higienis.</li>
    <li>Menjalin kemitraan kolaboratif dengan orang tua, komite sekolah, dan instansi terkait demi tercapainya target mutu pendidikan.</li>
  `,
  fasilitas: `
    <li>6 Ruang Kelas yang representatif</li>
    <li>Perpustakaan Sekolah "Pelita Ilmu"</li>
    <li>Unit Kesehatan Sekolah (UKS) Berstandar</li>
    <li>Mushola Sekolah "Al-Ikhlas"</li>
    <li>Laboratorium Komputer & TIK</li>
    <li>Lapangan Olahraga Multiguna</li>
    <li>Kantin Sehat Sekolah</li>
    <li>Taman Hidroponik & Apotek Hidup</li>
  `
};

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<SchoolProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState<boolean>(true);

  // Set document title and load data
  useEffect(() => {
    document.title = "Profil & Sejarah Sekolah - SDN Kalisalak 01";
    
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Gagal memuat profil sekolah:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="profile-hero">
        <div className="container">
          <h1>Profil {loading ? "Sekolah" : profile.nama_sekolah}</h1>
          <p>Mengenal lebih dekat visi, misi, sejarah, dan identitas pendidikan kami</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px", marginTop: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
          {/* Main Info */}
          <div>
            {/* Sejarah */}
            <div className="profile-card">
              <h2><BookOpen size={20} style={{ color: "var(--secondary-dark)" }} /> Sejarah Singkat</h2>
              {loading ? (
                <div>
                  <Skeleton width="100%" height="16px" style={{ marginBottom: "8px" }} />
                  <Skeleton width="100%" height="16px" style={{ marginBottom: "8px" }} />
                  <Skeleton width="80%" height="16px" />
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: profile.sejarah }} className="rich-content" />
              )}
            </div>

            {/* Visi Misi */}
            <div className="profile-card">
              <h2><Award size={20} style={{ color: "var(--secondary-dark)" }} /> Visi & Misi</h2>
              <h3 style={{ fontSize: "16px", color: "var(--primary)", marginBottom: "8px" }}>Visi Sekolah</h3>
              {loading ? (
                <Skeleton width="100%" height="48px" style={{ marginBottom: "20px" }} />
              ) : (
                <p style={{ fontStyle: "italic", fontSize: "15px", backgroundColor: "rgba(15, 60, 115, 0.03)", padding: "16px", borderRadius: "8px", borderLeft: "4px solid var(--secondary)", marginBottom: "20px" }}>
                  {profile.visi}
                </p>
              )}
              
              <h3 style={{ fontSize: "16px", color: "var(--primary)", marginBottom: "10px" }}>Misi Sekolah</h3>
              {loading ? (
                <div>
                  <Skeleton width="90%" height="16px" style={{ marginBottom: "8px" }} />
                  <Skeleton width="95%" height="16px" style={{ marginBottom: "8px" }} />
                  <Skeleton width="85%" height="16px" />
                </div>
              ) : (
                <ul className="profile-list" dangerouslySetInnerHTML={{ __html: profile.misi }} />
              )}
            </div>

            {/* Fasilitas */}
            <div className="profile-card">
              <h2><Activity size={20} style={{ color: "var(--secondary-dark)" }} /> Fasilitas Sekolah</h2>
              <p style={{ marginBottom: "16px" }}>Untuk menunjang proses pembelajaran yang kondusif, sekolah menyediakan berbagai fasilitas memadai:</p>
              {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <Skeleton width="80%" height="16px" style={{ marginBottom: "8px" }} />
                    <Skeleton width="70%" height="16px" />
                  </div>
                  <div>
                    <Skeleton width="75%" height="16px" style={{ marginBottom: "8px" }} />
                    <Skeleton width="85%" height="16px" />
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <ul className="profile-list" dangerouslySetInnerHTML={{ __html: profile.fasilitas }} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div>
            <div className="profile-card">
              <h2><ShieldAlert size={20} style={{ color: "var(--secondary-dark)" }} /> Identitas Sekolah</h2>
              {loading ? (
                <div>
                  <Skeleton width="100%" height="24px" style={{ marginBottom: "12px" }} />
                  <Skeleton width="100%" height="24px" style={{ marginBottom: "12px" }} />
                  <Skeleton width="100%" height="24px" />
                </div>
              ) : (
                <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Nama Sekolah</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{profile.nama_sekolah}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>NPSN</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{profile.npsn}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Akreditasi</td>
                      <td style={{ padding: "8px 0", textAlign: "right", color: "var(--primary-dark)", fontWeight: 700 }}>{profile.akreditasi}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Bentuk Pendidikan</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{profile.bentuk_pendidikan}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Status Sekolah</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{profile.status_sekolah}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Jenjang Pendidikan</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{profile.jenjang_pendidikan}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Tanggal SK Pendirian</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{profile.sk_pendirian}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Kurikulum</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{profile.kurikulum}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 0", fontWeight: 700 }}>Alamat</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontSize: "11px", color: "var(--text-muted)", maxWidth: "160px" }}>
                        {profile.alamat}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="profile-card" style={{ textAlign: "center", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)", color: "white" }}>
              <MapPin size={32} style={{ color: "var(--secondary)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Alamat Sekolah</h3>
              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
                {profile.alamat}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
