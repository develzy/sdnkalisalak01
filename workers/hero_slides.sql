-- Create hero slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  cloudinary_id TEXT,
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_weight INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial slides
INSERT INTO hero_slides (id, image_url, cloudinary_id, badge, title, description, order_weight) VALUES 
(1, 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200', 'unsplash_1', 'Prestasi Utama', 'Selamat Datang di SDN Kalisalak 01', 'Membentuk generasi cerdas, berkarakter, inovatif, dan berakhlak mulia berlandaskan iman dan takwa.', 1),
(2, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200', 'unsplash_2', 'Kegiatan Sekolah', 'Penerapan Kurikulum Merdeka', 'Mengembangkan potensi bakat dan kreativitas anak didik secara optimal melalui Proyek Penguatan Profil Pelajar Pancasila.', 2),
(3, 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200', 'unsplash_3', 'Lingkungan Sehat', 'Juara 1 Lomba Sekolah Sehat', 'Berkomitmen mewujudkan lingkungan belajar yang bersih, rindang, aman, nyaman, dan ramah anak.', 3);
