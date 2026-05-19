const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:8787" : "");

// Helper for authenticated requests
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("admin_token");
  const headers: HeadersInit = {};
  
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// API Services
export const api = {
  // ----------------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------------
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login gagal");
    }
    const data = await res.json();
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_username", data.username);
    return data;
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
  },

  isLoggedIn: () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return false;
    
    // Check expiration by decoding the token (simple btoa decode)
    try {
      const decoded = atob(token);
      const parts = decoded.split(":");
      if (parts.length < 2) return false;
      const expiry = parseInt(parts[1]);
      return Date.now() < expiry;
    } catch {
      return false;
    }
  },

  getStats: async () => {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil statistik");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // CATEGORIES
  // ----------------------------------------------------------------
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/api/categories`);
    if (!res.ok) throw new Error("Gagal mengambil kategori");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // NEWS
  // ----------------------------------------------------------------
  getNews: async (filters: { category?: string; q?: string; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.q) params.append("q", filters.q);
    if (filters.limit) params.append("limit", filters.limit.toString());

    const res = await fetch(`${API_BASE}/api/news?${params.toString()}`);
    if (!res.ok) throw new Error("Gagal mengambil berita");
    return await res.json();
  },

  getNewsDetail: async (slug: string) => {
    const res = await fetch(`${API_BASE}/api/news/${slug}`);
    if (!res.ok) throw new Error("Berita tidak ditemukan");
    return await res.json();
  },

  createNews: async (newsData: {
    title: string;
    slug: string;
    content: string;
    image_url?: string;
    cloudinary_id?: string;
    category_id: number;
    author: string;
  }) => {
    const res = await fetch(`${API_BASE}/api/news`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(newsData),
    });
    if (!res.ok) throw new Error("Gagal membuat berita");
    return await res.json();
  },

  updateNews: async (
    id: number,
    newsData: {
      title: string;
      slug: string;
      content: string;
      image_url?: string;
      cloudinary_id?: string;
      category_id: number;
      author: string;
    }
  ) => {
    const res = await fetch(`${API_BASE}/api/news/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(newsData),
    });
    if (!res.ok) throw new Error("Gagal memperbarui berita");
    return await res.json();
  },

  deleteNews: async (id: number) => {
    const res = await fetch(`${API_BASE}/api/news/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus berita");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // COMMENTS
  // ----------------------------------------------------------------
  getComments: async (newsId: number) => {
    const res = await fetch(`${API_BASE}/api/news/${newsId}/comments`);
    if (!res.ok) throw new Error("Gagal mengambil komentar");
    return await res.json();
  },

  addComment: async (newsId: number, comment: { author_name: string; comment_text: string }) => {
    const res = await fetch(`${API_BASE}/api/news/${newsId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error("Gagal menambahkan komentar");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // ANNOUNCEMENTS
  // ----------------------------------------------------------------
  getAnnouncements: async () => {
    const res = await fetch(`${API_BASE}/api/announcements`);
    if (!res.ok) throw new Error("Gagal mengambil pengumuman");
    return await res.json();
  },

  createAnnouncement: async (data: { title: string; content: string }) => {
    const res = await fetch(`${API_BASE}/api/announcements`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal membuat pengumuman");
    return await res.json();
  },

  updateAnnouncement: async (id: number, data: { title: string; content: string }) => {
    const res = await fetch(`${API_BASE}/api/announcements/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal memperbarui pengumuman");
    return await res.json();
  },

  deleteAnnouncement: async (id: number) => {
    const res = await fetch(`${API_BASE}/api/announcements/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus pengumuman");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // EVENTS
  // ----------------------------------------------------------------
  getEvents: async () => {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error("Gagal mengambil agenda");
    return await res.json();
  },

  createEvent: async (data: { title: string; description: string; date: string; location: string }) => {
    const res = await fetch(`${API_BASE}/api/events`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal membuat agenda");
    return await res.json();
  },

  updateEvent: async (
    id: number,
    data: { title: string; description: string; date: string; location: string }
  ) => {
    const res = await fetch(`${API_BASE}/api/events/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal memperbarui agenda");
    return await res.json();
  },

  deleteEvent: async (id: number) => {
    const res = await fetch(`${API_BASE}/api/events/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus agenda");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // STAFF
  // ----------------------------------------------------------------
  getStaff: async () => {
    const res = await fetch(`${API_BASE}/api/staff`);
    if (!res.ok) throw new Error("Gagal mengambil data guru");
    return await res.json();
  },

  createStaff: async (data: {
    name: string;
    role: string;
    photo_url?: string;
    cloudinary_id?: string;
    nip?: string;
    order_weight?: number;
  }) => {
    const res = await fetch(`${API_BASE}/api/staff`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal menambah data staf");
    return await res.json();
  },

  updateStaff: async (
    id: number,
    data: {
      name: string;
      role: string;
      photo_url?: string;
      cloudinary_id?: string;
      nip?: string;
      order_weight?: number;
    }
  ) => {
    const res = await fetch(`${API_BASE}/api/staff/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal memperbarui data staf");
    return await res.json();
  },

  deleteStaff: async (id: number) => {
    const res = await fetch(`${API_BASE}/api/staff/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus data staf");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // GALLERY
  // ----------------------------------------------------------------
  getGallery: async () => {
    const res = await fetch(`${API_BASE}/api/gallery`);
    if (!res.ok) throw new Error("Gagal mengambil galeri");
    return await res.json();
  },

  createGalleryItem: async (data: {
    title: string;
    description?: string;
    image_url: string;
    cloudinary_id?: string;
  }) => {
    const res = await fetch(`${API_BASE}/api/gallery`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal menambahkan foto galeri");
    return await res.json();
  },

  deleteGalleryItem: async (id: number) => {
    const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus foto galeri");
    return await res.json();
  },

  // ----------------------------------------------------------------
  // IMAGE UPLOAD (CLOUDINARY SERVICE BACKEND PROXY)
  // ----------------------------------------------------------------
  uploadImage: async (file: File): Promise<{ url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/api/admin/upload`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Gagal mengunggah gambar ke Cloudinary");
    }

    return await res.json();
  },
};
