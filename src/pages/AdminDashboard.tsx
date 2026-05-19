import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Calendar,
  Users,
  Image as ImageIcon,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Upload,
  X,
  School
} from "lucide-react";
import { api } from "../services/api";
import { Toast } from "../components/Toast";
import type { ToastMessage } from "../components/Toast";
import { RichTextEditor } from "../components/RichTextEditor";


export const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(api.isLoggedIn());

  // Set document title
  useEffect(() => {
    document.title = "Panel Kontrol Admin - SDN Kalisalak 01";
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"stats" | "news" | "announcements" | "events" | "staff" | "gallery" | "profile">("stats");

  // School Profile Form State
  const [profNama, setProfNama] = useState("");
  const [profNpsn, setProfNpsn] = useState("");
  const [profAkreditasi, setProfAkreditasi] = useState("");
  const [profBentuk, setProfBentuk] = useState("");
  const [profStatus, setProfStatus] = useState("");
  const [profJenjang, setProfJenjang] = useState("");
  const [profSkPendirian, setProfSkPendirian] = useState("");
  const [profKurikulum, setProfKurikulum] = useState("");
  const [profAlamat, setProfAlamat] = useState("");
  const [profSejarah, setProfSejarah] = useState("");
  const [profVisi, setProfVisi] = useState("");
  const [profMisi, setProfMisi] = useState("");
  const [profFasilitas, setProfFasilitas] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Data States
  const [stats, setStats] = useState<any>({ news: 0, announcements: 0, events: 0, staff: 0, gallery: 0, views: 0 });
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<number | null>(null);

  // Form Field States
  // News Form
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSlug, setNewsSlug] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState("");
  const [newsAuthor, setNewsAuthor] = useState("");
  const [newsImageUrl, setNewsImageUrl] = useState("");
  const [newsCloudinaryId, setNewsCloudinaryId] = useState("");
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Announcement Form
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");

  // Event Form
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDesc, setEvtDesc] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtLocation, setEvtLocation] = useState("");

  // Staff Form
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffNip, setStaffNip] = useState("");
  const [staffOrderWeight, setStaffOrderWeight] = useState(0);
  const [staffImageUrl, setStaffImageUrl] = useState("");
  const [staffCloudinaryId, setStaffCloudinaryId] = useState("");
  const [staffFile, setStaffFile] = useState<File | null>(null);

  // Gallery Form
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDesc, setGalleryDesc] = useState("");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");
  const [galleryCloudinaryId, setGalleryCloudinaryId] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: string, type: "success" | "warning" | "danger" | "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message: msg, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-slugify Title
  useEffect(() => {
    if (activeTab === "news" && modalType === "add") {
      const slugified = newsTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setNewsSlug(slugified);
    }
  }, [newsTitle, activeTab, modalType]);

  // Load Initial Tab Data
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "stats") {
          const statsData = await api.getStats();
          setStats(statsData);
        } else if (activeTab === "news") {
          const newsData = await api.getNews();
          setNews(newsData);
          const catData = await api.getCategories();
          setCategories(catData);
          if (catData.length > 0) setNewsCategory(catData[0].id.toString());
        } else if (activeTab === "announcements") {
          const annData = await api.getAnnouncements();
          setAnnouncements(annData);
        } else if (activeTab === "events") {
          const evtData = await api.getEvents();
          setEvents(evtData);
        } else if (activeTab === "staff") {
          const staffData = await api.getStaff();
          setStaff(staffData);
        } else if (activeTab === "gallery") {
          const galData = await api.getGallery();
          setGallery(galData);
        } else if (activeTab === "profile") {
          const profileData = await api.getProfile();
          if (profileData) {
            setProfNama(profileData.nama_sekolah);
            setProfNpsn(profileData.npsn);
            setProfAkreditasi(profileData.akreditasi);
            setProfBentuk(profileData.bentuk_pendidikan);
            setProfStatus(profileData.status_sekolah);
            setProfJenjang(profileData.jenjang_pendidikan);
            setProfSkPendirian(profileData.sk_pendirian);
            setProfKurikulum(profileData.kurikulum);
            setProfAlamat(profileData.alamat);
            setProfSejarah(profileData.sejarah);
            setProfVisi(profileData.visi);
            setProfMisi(profileData.misi);
            setProfFasilitas(profileData.fasilitas);
          }
        }
      } catch (err: any) {
        console.error(err);
        addToast(err.message || "Gagal memuat data", "danger");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, activeTab]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      addToast("Harap masukkan username dan password!", "warning");
      return;
    }

    setIsLoggingIn(true);
    try {
      await api.login(username, password);
      setIsLoggedIn(true);
      setActiveTab("stats");
      addToast("Login berhasil! Selamat datang Admin.", "success");
    } catch (err: any) {
      addToast(err.message || "Username atau password salah", "danger");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    addToast("Anda telah keluar dari panel admin.", "info");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.updateProfile({
        nama_sekolah: profNama,
        npsn: profNpsn,
        akreditasi: profAkreditasi,
        bentuk_pendidikan: profBentuk,
        status_sekolah: profStatus,
        jenjang_pendidikan: profJenjang,
        sk_pendirian: profSkPendirian,
        kurikulum: profKurikulum,
        alamat: profAlamat,
        sejarah: profSejarah,
        visi: profVisi,
        misi: profMisi,
        fasilitas: profFasilitas
      });
      addToast("Profil sekolah berhasil diperbarui!", "success");
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Gagal memperbarui profil", "danger");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Open modals with prefilled data or reset states
  const handleOpenAddModal = () => {
    setModalType("add");
    setEditId(null);
    
    // Reset Form Fields
    setNewsTitle("");
    setNewsSlug("");
    setNewsContent("");
    setNewsAuthor(localStorage.getItem("admin_username") || "Admin");
    setNewsImageUrl("");
    setNewsCloudinaryId("");
    setNewsFile(null);

    setAnnTitle("");
    setAnnContent("");

    setEvtTitle("");
    setEvtDesc("");
    setEvtDate("");
    setEvtLocation("");

    setStaffName("");
    setStaffRole("");
    setStaffNip("");
    setStaffOrderWeight(staff.length + 1);
    setStaffImageUrl("");
    setStaffCloudinaryId("");
    setStaffFile(null);

    setGalleryTitle("");
    setGalleryDesc("");
    setGalleryImageUrl("");
    setGalleryCloudinaryId("");
    setGalleryFiles(null);

    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setModalType("edit");
    setEditId(item.id);

    if (activeTab === "news") {
      setNewsTitle(item.title);
      setNewsSlug(item.slug);
      setNewsContent(item.content);
      setNewsCategory(item.category_id?.toString() || "");
      setNewsAuthor(item.author);
      setNewsImageUrl(item.image_url || "");
      setNewsCloudinaryId(item.cloudinary_id || "");
      setNewsFile(null);
    } else if (activeTab === "announcements") {
      setAnnTitle(item.title);
      setAnnContent(item.content);
    } else if (activeTab === "events") {
      setEvtTitle(item.title);
      setEvtDesc(item.description);
      setEvtDate(item.date);
      setEvtLocation(item.location);
    } else if (activeTab === "staff") {
      setStaffName(item.name);
      setStaffRole(item.role);
      setStaffNip(item.nip || "");
      setStaffOrderWeight(item.order_weight || 0);
      setStaffImageUrl(item.photo_url || "");
      setStaffCloudinaryId(item.cloudinary_id || "");
      setStaffFile(null);
    }

    setIsModalOpen(true);
  };

  // Upload handler for Cloudinary
  const handleCloudinaryUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const result = await api.uploadImage(file);
      addToast("Gambar berhasil diunggah ke Cloudinary!", "success");
      return result; // contains { url, public_id }
    } catch (err: any) {
      addToast(err.message || "Gagal mengunggah gambar", "danger");
      throw err;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Submit Handler for Form (Creates or Updates)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // -------------------------------------------------------------
      // NEWS CRUD
      // -------------------------------------------------------------
      if (activeTab === "news") {
        let finalUrl = newsImageUrl;
        let finalCloudinaryId = newsCloudinaryId;

        // If file uploaded, upload to Cloudinary first
        if (newsFile) {
          const uploadRes = await handleCloudinaryUpload(newsFile);
          finalUrl = uploadRes.url;
          finalCloudinaryId = uploadRes.public_id;
        }

        const dataPayload = {
          title: newsTitle,
          slug: newsSlug,
          content: newsContent,
          category_id: parseInt(newsCategory),
          author: newsAuthor,
          image_url: finalUrl || undefined,
          cloudinary_id: finalCloudinaryId || undefined,
        };

        if (modalType === "add") {
          await api.createNews(dataPayload);
          addToast("Kabar berita berhasil ditambahkan!", "success");
        } else {
          await api.updateNews(editId!, dataPayload);
          addToast("Kabar berita berhasil diperbarui!", "success");
        }
        
        // Refresh list
        const newsData = await api.getNews();
        setNews(newsData);
      }
      
      // -------------------------------------------------------------
      // ANNOUNCEMENTS CRUD
      // -------------------------------------------------------------
      else if (activeTab === "announcements") {
        const dataPayload = { title: annTitle, content: annContent };

        if (modalType === "add") {
          await api.createAnnouncement(dataPayload);
          addToast("Pengumuman berhasil dipublikasikan!", "success");
        } else {
          await api.updateAnnouncement(editId!, dataPayload);
          addToast("Pengumuman berhasil diperbarui!", "success");
        }

        const annData = await api.getAnnouncements();
        setAnnouncements(annData);
      }

      // -------------------------------------------------------------
      // EVENTS CRUD
      // -------------------------------------------------------------
      else if (activeTab === "events") {
        const dataPayload = {
          title: evtTitle,
          description: evtDesc,
          date: evtDate,
          location: evtLocation,
        };

        if (modalType === "add") {
          await api.createEvent(dataPayload);
          addToast("Agenda kegiatan berhasil didaftarkan!", "success");
        } else {
          await api.updateEvent(editId!, dataPayload);
          addToast("Agenda kegiatan berhasil diperbarui!", "success");
        }

        const evtData = await api.getEvents();
        setEvents(evtData);
      }

      // -------------------------------------------------------------
      // STAFF CRUD
      // -------------------------------------------------------------
      else if (activeTab === "staff") {
        let finalUrl = staffImageUrl;
        let finalCloudinaryId = staffCloudinaryId;

        if (staffFile) {
          const uploadRes = await handleCloudinaryUpload(staffFile);
          finalUrl = uploadRes.url;
          finalCloudinaryId = uploadRes.public_id;
        }

        const dataPayload = {
          name: staffName,
          role: staffRole,
          nip: staffNip || undefined,
          order_weight: staffOrderWeight,
          photo_url: finalUrl || undefined,
          cloudinary_id: finalCloudinaryId || undefined,
        };

        if (modalType === "add") {
          await api.createStaff(dataPayload);
          addToast("Data guru berhasil ditambahkan!", "success");
        } else {
          await api.updateStaff(editId!, dataPayload);
          addToast("Data guru berhasil diperbarui!", "success");
        }

        const staffData = await api.getStaff();
        setStaff(staffData);
      }

      // -------------------------------------------------------------
      // GALLERY CRUD (With Multi-Image support)
      // -------------------------------------------------------------
      else if (activeTab === "gallery") {
        if (modalType === "add") {
          if (galleryFiles && galleryFiles.length > 0) {
            // Multiple images upload loop
            addToast(`Memulai proses upload ${galleryFiles.length} foto kegiatan...`, "info");
            
            for (let i = 0; i < galleryFiles.length; i++) {
              const file = galleryFiles[i];
              try {
                // 1. Upload to Cloudinary
                const uploadRes = await api.uploadImage(file);
                
                // 2. Save entry to D1
                await api.createGalleryItem({
                  title: galleryTitle || file.name.split(".")[0],
                  description: galleryDesc || `Dokumentasi foto kegiatan SDN Kalisalak 01`,
                  image_url: uploadRes.url,
                  cloudinary_id: uploadRes.public_id,
                });
                
                addToast(`[${i + 1}/${galleryFiles.length}] Foto "${file.name}" terunggah!`, "success");
              } catch (err) {
                console.error(err);
                addToast(`Gagal mengunggah foto: ${file.name}`, "danger");
              }
            }
          } else {
            // Single URL entry (no file selected)
            if (!galleryImageUrl) {
              addToast("Pilih file gambar atau masukkan URL gambar!", "warning");
              setIsLoading(false);
              return;
            }
            await api.createGalleryItem({
              title: galleryTitle,
              description: galleryDesc,
              image_url: galleryImageUrl,
              cloudinary_id: galleryCloudinaryId || undefined,
            });
            addToast("Item galeri berhasil ditambahkan!", "success");
          }
        }

        const galData = await api.getGallery();
        setGallery(galData);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Gagal menyimpan perubahan", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Action Handler (D1 item deletion triggers worker API which deletes from Cloudinary too)
  const handleDeleteItem = async (id: number) => {
    const confirmDel = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmDel) return;

    setIsLoading(true);
    try {
      if (activeTab === "news") {
        await api.deleteNews(id);
        setNews((prev) => prev.filter((item) => item.id !== id));
      } else if (activeTab === "announcements") {
        await api.deleteAnnouncement(id);
        setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      } else if (activeTab === "events") {
        await api.deleteEvent(id);
        setEvents((prev) => prev.filter((item) => item.id !== id));
      } else if (activeTab === "staff") {
        await api.deleteStaff(id);
        setStaff((prev) => prev.filter((item) => item.id !== id));
      } else if (activeTab === "gallery") {
        await api.deleteGalleryItem(id);
        setGallery((prev) => prev.filter((item) => item.id !== id));
      }
      addToast("Data berhasil dihapus dari database & Cloudinary!", "success");
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Gagal menghapus data", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const formatSqlDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Render Login screen if unauthorized
  if (!isLoggedIn) {
    return (
      <div className="container" style={{ padding: "80px 24px", maxWidth: "420px" }}>
        {/* Toast Notifier */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </div>

        <div className="profile-card" style={{ padding: "32px", border: "2px solid var(--secondary)" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div className="logo-icon" style={{ margin: "0 auto 16px auto", width: "56px", height: "56px", fontSize: "24px" }}>SD</div>
            <h1 style={{ fontSize: "22px", color: "var(--primary)" }}>Login Admin Portal</h1>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>SDN KALISALAK 01 MARGASARI</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <UserIcon size={14} /> Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Lock size={14} /> Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "44px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                  }}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "12px" }} disabled={isLoggingIn}>
              {isLoggingIn ? "Mengautentikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>
          
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 24px 80px 24px" }}>
      {/* Toast Notifier */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--border)", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", color: "var(--primary)", fontWeight: 800 }}>Admin Control Panel</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Selamat datang, {localStorage.getItem("admin_username")}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <button onClick={() => setActiveTab("stats")} className={`dashboard-tab-btn ${activeTab === "stats" ? "active" : ""}`}>
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("news")} className={`dashboard-tab-btn ${activeTab === "news" ? "active" : ""}`}>
            <Newspaper size={16} /> Kelola Berita
          </button>
          <button onClick={() => setActiveTab("announcements")} className={`dashboard-tab-btn ${activeTab === "announcements" ? "active" : ""}`}>
            <Megaphone size={16} /> Kelola Pengumuman
          </button>
          <button onClick={() => setActiveTab("events")} className={`dashboard-tab-btn ${activeTab === "events" ? "active" : ""}`}>
            <Calendar size={16} /> Kelola Agenda
          </button>
          <button onClick={() => setActiveTab("staff")} className={`dashboard-tab-btn ${activeTab === "staff" ? "active" : ""}`}>
            <Users size={16} /> Kelola Guru & Staf
          </button>
          <button onClick={() => setActiveTab("gallery")} className={`dashboard-tab-btn ${activeTab === "gallery" ? "active" : ""}`}>
            <ImageIcon size={16} /> Kelola Galeri
          </button>
          <button onClick={() => setActiveTab("profile")} className={`dashboard-tab-btn ${activeTab === "profile" ? "active" : ""}`}>
            <School size={16} /> Profil Sekolah
          </button>
        </aside>

        {/* Content Panel */}
        <main className="dashboard-content">
          {/* STATS PANEL */}
          {activeTab === "stats" && (
            <div>
              <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "var(--primary)" }}>Statistik Data Portal</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon"><Newspaper size={20} /></div>
                  <div className="stat-info">
                    <h4>Total Berita</h4>
                    <p>{stats.news}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: "var(--secondary-dark)" }}><Eye size={20} /></div>
                  <div className="stat-info">
                    <h4>Total View</h4>
                    <p>{stats.views}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: "var(--success)" }}><Megaphone size={20} /></div>
                  <div className="stat-info">
                    <h4>Pengumuman</h4>
                    <p>{stats.announcements}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: "var(--warning)" }}><Calendar size={20} /></div>
                  <div className="stat-info">
                    <h4>Agenda</h4>
                    <p>{stats.events}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: "#8b5cf6" }}><Users size={20} /></div>
                  <div className="stat-info">
                    <h4>Guru & Staff</h4>
                    <p>{stats.staff}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: "#ec4899" }}><ImageIcon size={20} /></div>
                  <div className="stat-info">
                    <h4>Foto Galeri</h4>
                    <p>{stats.gallery}</p>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h3>Integrasi Penyimpanan & Hosting</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
                  Sistem database utama disimpan menggunakan <strong>Cloudflare D1 SQL Database</strong> yang cepat dan aman. 
                  Semua aset foto kegiatan sekolah disimpan di <strong>Cloudinary CDN</strong> untuk optimasi media loading otomatis. 
                  Saat menghapus berita atau guru di panel admin ini, gambar lama yang tersimpan di Cloudinary otomatis ikut dibersihkan (Destroy API).
                </p>
              </div>
            </div>
          )}

          {/* CRUD TABLES (News, Ann, Event, Staff, Gallery) */}
          {activeTab !== "stats" && activeTab !== "profile" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "20px", color: "var(--primary)", textTransform: "capitalize" }}>
                  Daftar {activeTab === "news" ? "Kabar Berita" : activeTab === "staff" ? "Guru & Staf" : activeTab}
                </h2>
                
                {/* Add button (Gallery only has Add, others have full CRUD) */}
                <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                  <Plus size={16} /> Tambah Data
                </button>
              </div>

              {isLoading && <p style={{ color: "var(--text-muted)" }}>Memproses data...</p>}

              <div className="admin-table-wrap">
                <table className="admin-table">
                  {/* NEWS TABLE */}
                  {activeTab === "news" && (
                    <>
                      <thead>
                        <tr>
                          <th>Judul Berita</th>
                          <th>Kategori</th>
                          <th>Penulis</th>
                          <th>Pembaca</th>
                          <th>Tanggal Rilis</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {news.map((item) => (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 600 }}>{item.title}</td>
                            <td>{item.category_name}</td>
                            <td>{item.author}</td>
                            <td>{item.views} views</td>
                            <td>{formatSqlDate(item.created_at)}</td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleOpenEditModal(item)} className="btn-icon" style={{ color: "var(--primary)" }} title="Edit"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="btn-icon" style={{ color: "var(--danger)" }} title="Hapus"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* ANNOUNCEMENTS TABLE */}
                  {activeTab === "announcements" && (
                    <>
                      <thead>
                        <tr>
                          <th>Judul Pengumuman</th>
                          <th>Tanggal Rilis</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.map((item) => (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 600 }}>{item.title}</td>
                            <td>{formatSqlDate(item.created_at)}</td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleOpenEditModal(item)} className="btn-icon" style={{ color: "var(--primary)" }}><Edit size={16} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="btn-icon" style={{ color: "var(--danger)" }}><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* EVENTS TABLE */}
                  {activeTab === "events" && (
                    <>
                      <thead>
                        <tr>
                          <th>Judul Agenda</th>
                          <th>Tanggal Kegiatan</th>
                          <th>Lokasi</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((item) => (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 600 }}>{item.title}</td>
                            <td>{formatSqlDate(item.date)}</td>
                            <td>{item.location}</td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleOpenEditModal(item)} className="btn-icon" style={{ color: "var(--primary)" }}><Edit size={16} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="btn-icon" style={{ color: "var(--danger)" }}><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* TEACHERS TABLE */}
                  {activeTab === "staff" && (
                    <>
                      <thead>
                        <tr>
                          <th>Nama Lengkap</th>
                          <th>Jabatan / Peran</th>
                          <th>NIP</th>
                          <th>Urutan Bobot</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((item) => (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 600 }}>{item.name}</td>
                            <td>{item.role}</td>
                            <td>{item.nip || "-"}</td>
                            <td>{item.order_weight}</td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => handleOpenEditModal(item)} className="btn-icon" style={{ color: "var(--primary)" }}><Edit size={16} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="btn-icon" style={{ color: "var(--danger)" }}><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {/* GALLERY TABLE */}
                  {activeTab === "gallery" && (
                    <>
                      <thead>
                        <tr>
                          <th>Preview Gambar</th>
                          <th>Judul Foto</th>
                          <th>Keterangan</th>
                          <th>Cloudinary ID</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gallery.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <img src={item.image_url} alt="" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                            </td>
                            <td style={{ fontWeight: 600 }}>{item.title}</td>
                            <td>{item.description || "-"}</td>
                            <td style={{ fontFamily: "monospace", fontSize: "11px" }}>{item.cloudinary_id || "URL Luar"}</td>
                            <td>
                              <button onClick={() => handleDeleteItem(item.id)} className="btn-icon" style={{ color: "var(--danger)" }}><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            </div>
          )}

          {/* PROFILE PANEL */}
          {activeTab === "profile" && (
            <div>
              <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "var(--primary)" }}>Edit Profil & Identitas Sekolah</h2>
              
              <form onSubmit={handleSaveProfile} className="profile-card">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="form-group">
                    <label className="form-label">Nama Sekolah</label>
                    <input type="text" className="form-control" value={profNama} onChange={(e) => setProfNama(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NPSN</label>
                    <input type="text" className="form-control" value={profNpsn} onChange={(e) => setProfNpsn(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Akreditasi</label>
                    <input type="text" className="form-control" value={profAkreditasi} onChange={(e) => setProfAkreditasi(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bentuk Pendidikan</label>
                    <input type="text" className="form-control" value={profBentuk} onChange={(e) => setProfBentuk(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status Sekolah</label>
                    <input type="text" className="form-control" value={profStatus} onChange={(e) => setProfStatus(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jenjang Pendidikan</label>
                    <input type="text" className="form-control" value={profJenjang} onChange={(e) => setProfJenjang(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal SK Pendirian</label>
                    <input type="text" className="form-control" value={profSkPendirian} onChange={(e) => setProfSkPendirian(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kurikulum</label>
                    <input type="text" className="form-control" value={profKurikulum} onChange={(e) => setProfKurikulum(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label className="form-label">Alamat Lengkap</label>
                  <textarea rows={2} className="form-control" value={profAlamat} onChange={(e) => setProfAlamat(e.target.value)} required />
                </div>

                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label className="form-label">Visi Sekolah</label>
                  <textarea rows={2} className="form-control" value={profVisi} onChange={(e) => setProfVisi(e.target.value)} required />
                </div>

                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label className="form-label">Sejarah Sekolah (Gunakan editor visual)</label>
                  <RichTextEditor value={profSejarah} onChange={setProfSejarah} placeholder="Tulis sejarah lengkap..." height="200px" />
                </div>

                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label className="form-label">Misi Sekolah (HTML list item, gunakan &lt;li&gt;per baris&lt;/li&gt;)</label>
                  <RichTextEditor value={profMisi} onChange={setProfMisi} placeholder="<li>Misi 1</li>..." height="150px" />
                </div>

                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label className="form-label">Fasilitas Sekolah (HTML list item, gunakan &lt;li&gt;per baris&lt;/li&gt;)</label>
                  <RichTextEditor value={profFasilitas} onChange={setProfFasilitas} placeholder="<li>Fasilitas 1</li>..." height="150px" />
                </div>

                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" className="btn btn-primary" disabled={isSavingProfile}>
                    {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan Profil"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* CRUD POPUP MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 style={{ fontSize: "18px", color: "var(--primary)" }}>
                {modalType === "add" ? "Tambah Data" : "Edit Data"} - {activeTab.toUpperCase()}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmitForm}>
              {/* NEWS FORM FIELDS */}
              {activeTab === "news" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Berita</label>
                    <input type="text" className="form-control" value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug Link (Auto)</label>
                    <input type="text" className="form-control" value={newsSlug} onChange={(e) => setNewsSlug(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kategori Berita</label>
                    <select className="form-control" value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} required>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Isi Konten Berita (Gunakan toolbar untuk format teks)</label>
                    <RichTextEditor value={newsContent} onChange={setNewsContent} placeholder="Tulis konten berita lengkap di sini..." />
                    <textarea
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      required
                      style={{ opacity: 0, height: 0, width: 0, padding: 0, margin: 0, border: "none", position: "absolute", pointerEvents: "none" }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Penulis / Author</label>
                    <input type="text" className="form-control" value={newsAuthor} onChange={(e) => setNewsAuthor(e.target.value)} required />
                  </div>
                  
                  {/* File Upload to Cloudinary */}
                  <div className="form-group">
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Upload size={14} /> Upload Gambar ke Cloudinary</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setNewsFile(e.target.files ? e.target.files[0] : null)} />
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Atau masukkan URL Gambar alternatif di bawah jika tidak upload file.
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL Gambar Cadangan</label>
                    <input type="text" className="form-control" value={newsImageUrl} onChange={(e) => setNewsImageUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </>
              )}

              {/* ANNOUNCEMENT FORM FIELDS */}
              {activeTab === "announcements" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Pengumuman</label>
                    <input type="text" className="form-control" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Konten Pengumuman (Gunakan toolbar untuk format teks)</label>
                    <RichTextEditor value={annContent} onChange={setAnnContent} placeholder="Tulis isi pengumuman lengkap di sini..." height="200px" />
                    <textarea
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      required
                      style={{ opacity: 0, height: 0, width: 0, padding: 0, margin: 0, border: "none", position: "absolute", pointerEvents: "none" }}
                    />
                  </div>
                </>
              )}

              {/* EVENT FORM FIELDS */}
              {activeTab === "events" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Judul Agenda Kegiatan</label>
                    <input type="text" className="form-control" value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Pelaksanaan</label>
                    <input type="date" className="form-control" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lokasi Kegiatan</label>
                    <input type="text" className="form-control" value={evtLocation} onChange={(e) => setEvtLocation(e.target.value)} placeholder="Contoh: Aula Sekolah" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Keterangan / Deskripsi</label>
                    <textarea rows={3} className="form-control" value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} required></textarea>
                  </div>
                </>
              )}

              {/* STAFF FORM FIELDS */}
              {activeTab === "staff" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap & Gelar</label>
                    <input type="text" className="form-control" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jabatan / Wali Kelas</label>
                    <input type="text" className="form-control" value={staffRole} onChange={(e) => setStaffRole(e.target.value)} placeholder="Contoh: Wali Kelas 4" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NIP (Opsional)</label>
                    <input type="text" className="form-control" value={staffNip} onChange={(e) => setStaffNip(e.target.value)} placeholder="Contoh: 19820324..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bobot Urutan Tampil (Semakin kecil tampil pertama)</label>
                    <input type="number" className="form-control" value={staffOrderWeight} onChange={(e) => setStaffOrderWeight(parseInt(e.target.value))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Upload Foto ke Cloudinary</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setStaffFile(e.target.files ? e.target.files[0] : null)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Atau URL Foto Langsung</label>
                    <input type="text" className="form-control" value={staffImageUrl} onChange={(e) => setStaffImageUrl(e.target.value)} />
                  </div>
                </>
              )}

              {/* GALLERY FORM FIELDS (Multi-upload support) */}
              {activeTab === "gallery" && (
                <>
                  <div className="form-group">
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Upload size={14} /> Pilih Multiple File Foto Kegiatan</label>
                    <input type="file" className="form-control" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} />
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Pilih satu atau beberapa file sekaligus untuk diunggah langsung ke Cloudinary!
                    </p>
                  </div>
                  
                  <div style={{ borderTop: "1px dashed var(--border)", padding: "16px 0 8px 0" }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>ATAU INPUT SECARA MANUAL</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Judul Foto Kegiatan</label>
                    <input type="text" className="form-control" value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} placeholder="Contoh: Lomba HUT RI" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Keterangan Singkat</label>
                    <input type="text" className="form-control" value={galleryDesc} onChange={(e) => setGalleryDesc(e.target.value)} placeholder="Contoh: Siswa antusias mengikuti lomba makan kerupuk" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL Foto Langsung (Jika tidak upload file)</label>
                    <input type="text" className="form-control" value={galleryImageUrl} onChange={(e) => setGalleryImageUrl(e.target.value)} placeholder="https://..." />
                  </div>
                </>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" disabled={isUploadingImage}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={isUploadingImage}>
                  {isUploadingImage ? "Mengunggah..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
