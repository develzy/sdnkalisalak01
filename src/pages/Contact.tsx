import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Toast } from "../components/Toast";
import type { ToastMessage } from "../components/Toast";


export const Contact: React.FC = () => {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = "Hubungi Kami - SDN Kalisalak 01";
  }, []);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: string, type: "success" | "warning" | "danger" | "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message: msg, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || !subject.trim() || !message.trim()) {
      addToast("Harap isi semua kolom wajib (*)!", "warning");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      addToast("Pesan Anda berhasil dikirim! Terima kasih.", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div>
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

      {/* Page Header */}
      <div className="profile-hero" style={{ padding: "40px 0" }}>
        <div className="container">
          <h1>Hubungi Kami</h1>
          <p>Kirimkan saran, pertanyaan, atau masukan untuk layanan pendidikan SDN Kalisalak 01</p>
        </div>
      </div>

      <div className="container" style={{ marginBottom: "60px" }}>
        <div className="contact-grid">
          {/* Contact Details */}
          <div>
            <div className="profile-card">
              <h2 style={{ fontSize: "20px", color: "var(--primary)" }}>Informasi Kontak</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
                Gunakan kontak di bawah ini untuk konsultasi, pengaduan siswa, atau kunjungan kemitraan ke sekolah.
              </p>

              <ul className="footer-contact" style={{ color: "var(--text)" }}>
                <li style={{ fontSize: "15px", marginBottom: "20px" }}>
                  <MapPin size={24} style={{ color: "var(--secondary-dark)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block" }}>Alamat Lengkap:</strong>
                    <span>Jl. K. Abdul Latif, Kalisalak, Margasari, Kabupaten Tegal, Jawa Tengah 52463</span>
                  </div>
                </li>
                <li style={{ fontSize: "15px", marginBottom: "20px" }}>
                  <Phone size={24} style={{ color: "var(--secondary-dark)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block" }}>Telepon / WhatsApp:</strong>
                    <span>+62 283 123456</span>
                  </div>
                </li>
                <li style={{ fontSize: "15px", marginBottom: "20px" }}>
                  <Mail size={24} style={{ color: "var(--secondary-dark)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block" }}>Email Resmi:</strong>
                    <span>info@sdnkalisalak01.sch.id</span>
                  </div>
                </li>
                <li style={{ fontSize: "15px" }}>
                  <Clock size={24} style={{ color: "var(--secondary-dark)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block" }}>Jam Pelayanan Tata Usaha:</strong>
                    <span>Senin - Sabtu: 07:00 - 13:00 WIB</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="profile-card">
              <h2 style={{ fontSize: "20px", color: "var(--primary)" }}>Formulir Hubungi Kami</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Ahmad Fauzi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Anda (Opsional)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Contoh: ahmad@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subjek / Perihal *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Pertanyaan PPDB 2026"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Isi Pesan *</label>
                  <textarea
                    rows={5}
                    className="form-control"
                    placeholder="Tuliskan pesan detail Anda di sini..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isSubmitting}>
                  {isSubmitting ? "Mengirim..." : (
                    <>
                      Kirim Pesan Sekarang <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="profile-card" style={{ padding: "16px" }}>
          <h2 style={{ fontSize: "18px", color: "var(--primary)", borderBottom: "none", marginBottom: "16px" }}>
            Lokasi SDN Kalisalak 01 di Google Maps
          </h2>
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.454798945321!2d109.0089271!3d-7.073151299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f9786aaaaaaab%3A0x45f8b81204413f68!2sSD%20Negeri%20Kalisalak%2001!5e0!3m2!1sid!2sid!4v1779193275466!5m2!1sid!2sid"
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SDN Kalisalak 01 Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
