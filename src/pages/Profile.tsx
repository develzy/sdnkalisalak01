import React, { useEffect } from "react";
import { Award, BookOpen, MapPin, CheckCircle, ShieldAlert, Activity } from "lucide-react";

export const Profile: React.FC = () => {
  // Set document title
  useEffect(() => {
    document.title = "Profil & Sejarah Sekolah - SDN Kalisalak 01";
  }, []);
  return (
    <div>
      {/* Page Header */}
      <div className="profile-hero">
        <div className="container">
          <h1>Profil SDN Kalisalak 01</h1>
          <p>Mengenal lebih dekat visi, misi, sejarah, dan identitas pendidikan kami</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
          {/* Main Info */}
          <div>
            {/* Sejarah */}
            <div className="profile-card">
              <h2><BookOpen size={20} style={{ color: "var(--secondary-dark)" }} /> Sejarah Singkat</h2>
              <p style={{ marginBottom: "12px" }}>
                SDN Kalisalak 01 didirikan pada tahun 1982 untuk memenuhi kebutuhan akses pendidikan dasar bagi anak-anak di Desa Kalisalak dan sekitarnya di wilayah Kecamatan Margasari, Kabupaten Tegal.
              </p>
              <p style={{ marginBottom: "12px" }}>
                Seiring berjalannya waktu, sekolah ini terus mengalami perkembangan baik dari segi sarana prasarana maupun mutu pengajaran. Berkat dedikasi para guru dan dukungan berkelanjutan komite sekolah, SDN Kalisalak 01 berhasil meraih status Akreditasi "A" (Unggul) dari Badan Akreditasi Nasional Sekolah/Madrasah.
              </p>
              <p>
                Kini, SDN Kalisalak 01 dipercaya sebagai salah satu sekolah rujukan di Kecamatan Margasari dalam penerapan Perilaku Hidup Bersih Sehat (PHBS) dan sekolah pelaksana Kurikulum Merdeka yang adaptif dan ramah anak.
              </p>
            </div>

            {/* Visi Misi */}
            <div className="profile-card">
              <h2><Award size={20} style={{ color: "var(--secondary-dark)" }} /> Visi & Misi</h2>
              <h3 style={{ fontSize: "16px", color: "var(--primary)", marginBottom: "8px" }}>Visi Sekolah</h3>
              <p style={{ fontStyle: "italic", fontSize: "15px", backgroundColor: "rgba(15, 60, 115, 0.03)", padding: "16px", borderRadius: "8px", borderLeft: "4px solid var(--secondary)", marginBottom: "20px" }}>
                "Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Berprestasi, Sehat, dan Peduli Lingkungan Berlandaskan Nilai-Nilai Pancasila."
              </p>
              
              <h3 style={{ fontSize: "16px", color: "var(--primary)", marginBottom: "10px" }}>Misi Sekolah</h3>
              <ul className="profile-list">
                <li>
                  <CheckCircle size={14} className="profile-list-bullet" />
                  <span>Menanamkan keimanan, ketakwaan, dan pembiasaan akhlak mulia melalui program keagamaan rutin.</span>
                </li>
                <li>
                  <CheckCircle size={14} className="profile-list-bullet" />
                  <span>Menyelenggarakan pembelajaran Kurikulum Merdeka secara aktif, inovatif, kreatif, efektif, dan menyenangkan (PAIKEM).</span>
                </li>
                <li>
                  <CheckCircle size={14} className="profile-list-bullet" />
                  <span>Membina dan memfasilitasi pengembangan potensi, minat, dan bakat siswa di bidang akademis serta non-akademis.</span>
                </li>
                <li>
                  <CheckCircle size={14} className="profile-list-bullet" />
                  <span>Membudayakan perilaku hidup bersih dan sehat (PHBS) serta memelihara lingkungan sekolah agar tetap asri, sejuk, dan higienis.</span>
                </li>
                <li>
                  <CheckCircle size={14} className="profile-list-bullet" />
                  <span>Menjalin kemitraan kolaboratif dengan orang tua, komite sekolah, dan instansi terkait demi tercapainya target mutu pendidikan.</span>
                </li>
              </ul>
            </div>

            {/* Fasilitas */}
            <div className="profile-card">
              <h2><Activity size={20} style={{ color: "var(--secondary-dark)" }} /> Fasilitas Sekolah</h2>
              <p style={{ marginBottom: "16px" }}>Untuk menunjang proses pembelajaran yang kondusif, SDN Kalisalak 01 menyediakan berbagai fasilitas memadai:</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <ul className="profile-list">
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>6 Ruang Kelas yang representatif</span></li>
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>Perpustakaan Sekolah "Pelita Ilmu"</span></li>
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>Unit Kesehatan Sekolah (UKS) Berstandar</span></li>
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>Mushola Sekolah "Al-Ikhlas"</span></li>
                </ul>
                <ul className="profile-list">
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>Laboratorium Komputer & TIK</span></li>
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>Lapangan Olahraga Multiguna</span></li>
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>Kantin Sehat Sekolah</span></li>
                  <li><CheckCircle size={14} className="profile-list-bullet" /> <span>Taman Hidroponik & Apotek Hidup</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div>
            <div className="profile-card">
              <h2><ShieldAlert size={20} style={{ color: "var(--secondary-dark)" }} /> Identitas Sekolah</h2>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Nama Sekolah</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>SD NEGERI KALISALAK 01</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>NPSN</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>20325895</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Akreditasi</td>
                    <td style={{ padding: "8px 0", textAlign: "right", color: "var(--primary-dark)", fontWeight: 700 }}>B</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Bentuk Pendidikan</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>SD</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Status Sekolah</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>NEGERI</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Jenjang Pendidikan</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>DIKDAS</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Tanggal SK Pendirian</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>01-01-1910</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Kurikulum</td>
                    <td style={{ padding: "8px 0", textAlign: "right" }}>Kurikulum Merdeka</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0", fontWeight: 700 }}>Alamat</td>
                    <td style={{ padding: "8px 0", textAlign: "right", fontSize: "11px", color: "var(--text-muted)" }}>
                      Jl. K. Abdul Latif, Kalisalak, Kec. Margasari, Kab. Tegal, Prov. Jawa Tengah
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="profile-card" style={{ textAlign: "center", background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)", color: "white" }}>
              <MapPin size={32} style={{ color: "var(--secondary)", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Alamat Sekolah</h3>
              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
                Kalisalak, Margasari, Kabupaten Tegal, Jawa Tengah 52463, Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
