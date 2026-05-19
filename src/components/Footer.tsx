import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* School Intro */}
        <div className="footer-col footer-about">
          <div className="footer-logo">
            <img src="/icons/logo.png" alt="Logo SDN Kalisalak 01" className="logo-img-footer" />
            <h2 style={{ fontSize: "18px", color: "white", fontWeight: 700 }}>SDN KALISALAK 01</h2>
          </div>
          <p>
            Mendidik dengan hati, membentuk karakter unggul, cerdas, berprestasi, dan berakhlak mulia 
            berlandaskan Profil Pelajar Pancasila di lingkungan belajar yang sehat dan asri.
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Facebook">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V2h-3a5 5 0 00-5 5v1z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Instagram">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Youtube">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2c-.3-1.1-1.1-2-2.2-2.2C19.3 3.6 12 3.6 12 3.6s-7.3 0-9.3.4c-1.1.3-2 1.1-2.2 2.2C.1 8.2.1 12 .1 12s0 3.8.4 5.8c.3 1.1 1.1 2 2.2 2.2 2 2 9.3 2 9.3 2s7.3 0 9.3-.4c1.1-.3 2-1.1 2.2-2.2.4-2 .4-5.8.4-5.8s0-3.8-.4-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Twitter">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Tautan Pintar</h3>
          <ul className="footer-links">
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/berita">Kabar Berita</Link></li>
            <li><Link to="/pengumuman">Pengumuman</Link></li>
            <li><Link to="/agenda">Agenda Kegiatan</Link></li>
            <li><Link to="/galeri">Galeri Foto</Link></li>
          </ul>
        </div>

        {/* Info Links */}
        <div className="footer-col">
          <h3>Informasi</h3>
          <ul className="footer-links">
            <li><Link to="/profil">Profil Sekolah</Link></li>
            <li><Link to="/guru-staff">Guru & Staf</Link></li>
            <li><Link to="/kontak">Kontak Kami</Link></li>
            <li><Link to="/admin">Dashboard Admin</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h3>Kontak Sekolah</h3>
          <ul className="footer-contact">
            <li>
              <MapPin size={18} className="footer-contact-icon" />
              <span>Kalisalak, Margasari, Kabupaten Tegal, Jawa Tengah 52463</span>
            </li>
            <li>
              <Phone size={18} className="footer-contact-icon" />
              <span>+62 283 123456</span>
            </li>
            <li>
              <Mail size={18} className="footer-contact-icon" />
              <span>info@sdnkalisalak01.sch.id</span>
            </li>
            <li>
              <Clock size={18} className="footer-contact-icon" />
              <span>Senin - Sabtu: 07:00 - 13:00 WIB</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container footer-bottom">
        <p>&copy; {currentYear} SDN KALISALAK 01. Hak Cipta Dilindungi.</p>
        <p>
          Dikembangkan Oleh Develzy untuk kemajuan pendidikan Indonesia.
        </p>
      </div>
    </footer>
  );
};
