-- Seed Categories
INSERT OR IGNORE INTO categories (id, name, slug) VALUES 
(1, 'Berita Sekolah', 'berita-sekolah'),
(2, 'Prestasi Siswa', 'prestasi-siswa'),
(3, 'Kegiatan', 'kegiatan-sekolah'),
(4, 'Kurikulum', 'kurikulum');

-- Seed Admins (username: admin, password: admin123 (sha256 hash))
INSERT OR IGNORE INTO admins (id, username, password_hash) VALUES 
(1, 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');

-- Seed News
INSERT OR IGNORE INTO news (id, title, slug, content, image_url, cloudinary_id, category_id, views, author, created_at) VALUES 
(1, 
 'SDN Kalisalak 01 Raih Juara 1 Lomba Sekolah Sehat Tingkat Kabupaten Tegal', 
 'sdn-kalisalak-01-raih-juara-1-lomba-sekolah-sehat-tingkat-kabupaten-tegal', 
 'SDN Kalisalak 01 Kecamatan Margasari berhasil menorehkan prestasi gemilang dengan meraih Juara 1 dalam Lomba Sekolah Sehat (LSS) tingkat Kabupaten Tegal tahun 2026. Penghargaan ini diserahkan langsung oleh Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Tegal di pendopo kabupaten.<br/><br/>Kepala Sekolah SDN Kalisalak 01, Bapak Bambang Setiawan, S.Pd., M.Pd., menyampaikan rasa syukur dan bangganya atas pencapaian ini. "Ini adalah hasil kerja keras seluruh elemen sekolah, mulai dari para guru, staf, siswa, komite sekolah, hingga dukungan penuh dari orang tua murid," ujarnya.<br/><br/>Penilaian Lomba Sekolah Sehat ini mencakup tiga program pokok UKS (Trias UKS), yaitu pendidikan kesehatan, pelayanan kesehatan, dan pembinaan lingkungan sekolah sehat. SDN Kalisalak 01 dinilai berhasil menciptakan lingkungan belajar yang bersih, asri, rindang, serta menerapkan budaya hidup bersih dan sehat (PHBS) secara konsisten di kalangan warga sekolah. Dengan kemenangan ini, SDN Kalisalak 01 akan mewakili Kabupaten Tegal dalam ajang serupa di tingkat Provinsi Jawa Tengah.', 
 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800', 
 'unsplash_default_school_1', 
 2, 
 145, 
 'Bambang Setiawan, S.Pd., M.Pd.', 
 '2026-05-10 08:00:00'),

(2, 
 'Kunjungan Edukatif Siswa Kelas 5 ke Museum Semedo Tegal', 
 'kunjungan-edukatif-siswa-kelas-5-ke-museum-semedo-tegal', 
 'Dalam rangka memperkuat pembelajaran sejarah dan purbakala, puluhan siswa kelas 5 SDN Kalisalak 01 mengadakan kunjungan edukatif ke Situs Purba Semedo di Kedungbanteng, Kabupaten Tegal pada hari Kamis kemarin.<br/><br/>Didampingi oleh wali kelas dan beberapa guru pendamping, para siswa antusias melihat berbagai koleksi fosil fauna purba, alat-alat batu hasil budaya manusia purba (Homo erectus), dan fosil manusia purba yang ditemukan di kawasan Semedo. Pemandu museum menjelaskan secara detail tentang kehidupan zaman Pleistosen yang pernah berlangsung di wilayah Tegal.<br/><br/>Kegiatan ini diharapkan dapat memberikan pengalaman belajar langsung (hands-on learning) yang menyenangkan bagi siswa, sehingga mereka dapat lebih menghargai warisan prasejarah dan budaya bangsa sendiri. Setiap siswa ditugaskan membuat laporan perjalanan sederhana sebagai bentuk evaluasi pembelajaran di luar kelas.', 
 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', 
 'unsplash_default_school_2', 
 3, 
 92, 
 'Tri Wahyuni, S.Pd.', 
 '2026-05-12 09:30:00'),

(3, 
 'Penerapan Proyek P5 Tema Kewirausahaan: Siswa Belajar Membuat Kerajinan Khas Tegal', 
 'penerapan-proyek-p5-tema-kewirausahaan-siswa-belajar-membuat-kerajinan-khas-tegal', 
 'Sebagai bagian dari implementasi Kurikulum Merdeka, SDN Kalisalak 01 menyelenggarakan Proyek Penguatan Profil Pelajar Pancasila (P5) dengan tema Kewirausahaan. Kegiatan ini difokuskan pada pelatihan pembuatan kerajinan tangan tradisional khas Tegal, seperti miniatur gerabah dan anyaman bambu.<br/><br/>Kegiatan ini diikuti oleh siswa kelas 1 dan kelas 4. Sekolah mengundang pengrajin lokal untuk memberikan bimbingan langsung kepada siswa mengenai teknik dasar menganyam dan membentuk tanah liat. Hasil karya siswa nantinya akan dipamerkan dalam acara "Gelar Karya P5" yang akan diadakan pada akhir semester.<br/><br/>Tujuan utama dari proyek ini adalah untuk menanamkan karakter mandiri, kreatif, dan gotong royong sejak dini, serta menumbuhkan jiwa wirausaha dan kecintaan terhadap produk lokal daerah.', 
 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800', 
 'unsplash_default_school_3', 
 4, 
 76, 
 'Dewi Lestari, S.Pd.', 
 '2026-05-15 10:15:00'),

(4, 
 'Prestasi Hebat! Ananda Ahmad Luthfi Meraih Juara 1 Matematika OSN Kecamatan Margasari', 
 'prestasi-hebat-ananda-ahmad-luthfi-meraih-juara-1-matematika-osn-kecamatan-margasari', 
 'Kabar membanggakan kembali datang dari siswa SDN Kalisalak 01. Ananda Ahmad Luthfi, siswa kelas 5, berhasil meraih Juara 1 dalam Olimpiade Sains Nasional (OSN) bidang Matematika tingkat Kecamatan Margasari tahun 2026 yang diselenggarakan awal pekan ini.<br/><br/>Luthfi berhasil menyisihkan puluhan peserta dari berbagai sekolah dasar lainnya di Kecamatan Margasari setelah melalui babak pengerjaan soal pilihan ganda dan esai matematika yang cukup rumit. Berkat prestasinya, Luthfi berhak melaju ke tingkat Kabupaten Tegal untuk mewakili kecamatan Margasari.<br/><br/>Bapak Achmad Fauzi, S.Pd., selaku guru pembimbing olimpiade, menyatakan kebanggaannya. "Luthfi anak yang sangat tekun dan memiliki daya analitis tinggi. Kami akan terus memberikan pembimbingan intensif agar ia siap menghadapi persaingan yang lebih ketat di tingkat kabupaten nanti," tuturnya.', 
 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800', 
 'unsplash_default_school_4', 
 2, 
 180, 
 'Achmad Fauzi, S.Pd.', 
 '2026-05-18 07:45:00');

-- Seed Announcements
INSERT OR IGNORE INTO announcements (id, title, content, created_at) VALUES 
(1, 
 'Informasi Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027', 
 'Diberitahukan kepada seluruh calon wali murid baru bahwa SDN Kalisalak 01 akan membuka Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027.<br/><br/><strong>Jadwal Pelaksanaan:</strong><br/>• Pendaftaran Online/Offline: 15 Juni - 22 Juni 2026<br/>• Verifikasi Berkas: 23 - 25 Juni 2026<br/>• Pengumuman Hasil Seleksi: 29 Juni 2026<br/>• Daftar Ulang: 1 - 3 Juli 2026<br/><br/><strong>Persyaratan Dokumen:</strong><br/>1. Usia calon peserta didik minimal 6 tahun pada tanggal 1 Juli 2026.<br/>2. Fotokopi Akta Kelahiran (2 lembar).<br/>3. Fotokopi Kartu Keluarga (KK) (2 lembar).<br/>4. Fotokopi KTP orang tua/wali.<br/>5. Pas foto ukuran 3x4 berwarna (2 lembar).<br/>6. Mengisi formulir pendaftaran yang disediakan panitia.<br/><br/>Pendaftaran offline dapat dilayani di ruang sekretariat PPDB SDN Kalisalak 01 setiap hari kerja pukul 08.00 - 12.00 WIB.', 
 '2026-05-12 11:00:00'),

(2, 
 'Pemberitahuan Pelaksanaan Penilaian Akhir Tahun (PAT) Semester Genap', 
 'Sehubungan dengan berakhirnya kegiatan pembelajaran Semester Genap Tahun Ajaran 2025/2026, kami beritahukan bahwa pelaksanaan Penilaian Akhir Tahun (PAT) atau Asesmen Akhir Semester Genap akan dilaksanakan pada:<br/><br/><strong>Hari/Tanggal:</strong> Senin, 1 Juni s.d. Sabtu, 6 Juni 2026<br/><strong>Waktu:</strong> Pukul 07.30 WIB - Selesai<br/><strong>Sasaran:</strong> Siswa Kelas 1 sampai Kelas 5<br/><br/>Diharapkan kepada seluruh orang tua/wali murid untuk memantau belajar putra-putrinya di rumah dan memastikan mereka menjaga kesehatan serta hadir tepat waktu selama pelaksanaan ujian berlangsung. Kartu peserta ujian akan dibagikan oleh wali kelas masing-masing.', 
 '2026-05-16 09:00:00'),

(3, 
 'Undangan Rapat Pleno Komite Sekolah Terkait Program Kerja Tahunan', 
 'Mengharap kehadiran Bapak/Ibu Wali Murid Kelas 1 s.d. 6 dan seluruh jajaran Pengurus Komite Sekolah dalam Rapat Pleno yang akan diselenggarakan pada:<br/><br/><strong>Hari/Tanggal:</strong> Sabtu, 23 Mei 2026<br/><strong>Waktu:</strong> Pukul 09.00 WIB s.d. Selesai<br/><strong>Tempat:</strong> Aula SDN Kalisalak 01<br/><strong>Agenda:</strong> Pembahasan Program Kerja Tahunan Sekolah, Evaluasi Kegiatan Belajar, dan Laporan Keuangan UKS.<br/><br/>Mengingat pentingnya acara ini demi kemajuan pendidikan putra-putri kita, kehadiran Bapak/Ibu sangat kami harapkan. Tetap patuhi protokol kesehatan yang berlaku di sekolah.', 
 '2026-05-18 10:00:00');

-- Seed Events/Agenda
INSERT OR IGNORE INTO events (id, title, description, date, location) VALUES 
(1, 'Rapat Pleno Komite & Wali Murid', 'Pembahasan program sekolah untuk tahun ajaran baru dan evaluasi belajar semester genap.', '2026-05-23', 'Aula Pertemuan SDN Kalisalak 01'),
(2, 'Pelaksanaan Penilaian Akhir Tahun (PAT)', 'Ujian akhir semester genap untuk kenaikan kelas bagi siswa kelas 1-5.', '2026-06-01', 'Ruang Kelas 1-5 SDN Kalisalak 01'),
(3, 'Wisuda & Pelepasan Siswa Kelas 6', 'Acara formal pelepasan siswa-siswi kelas 6 angkatan 2025/2026 dan pentas seni perpisahan.', '2026-06-15', 'Halaman Utama SDN Kalisalak 01'),
(4, 'Pembagian Rapor Semester Genap', 'Pengambilan laporan hasil belajar siswa semester genap oleh orang tua/wali murid.', '2026-06-20', 'Ruang Kelas Masing-masing');

-- Seed Staff
INSERT OR IGNORE INTO staff (id, name, role, photo_url, cloudinary_id, nip, order_weight) VALUES 
(1, 'Bambang Setiawan, S.Pd., M.Pd.', 'Kepala Sekolah', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_1', '197405121999031002', 1),
(2, 'Siti Rahayu, S.Pd.', 'Wali Kelas 1', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_2', '198203242009022003', 2),
(3, 'Budi Santoso, S.Pd.', 'Wali Kelas 2', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_3', '198511082012011001', 3),
(4, 'Dewi Lestari, S.Pd.', 'Wali Kelas 3', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_4', '198904122014022002', 4),
(5, 'Eko Prasetyo, S.Pd.', 'Wali Kelas 4', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_5', '197906152005011003', 5),
(6, 'Tri Wahyuni, S.Pd.', 'Wali Kelas 5', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_6', '198307222010012004', 6),
(7, 'Achmad Fauzi, S.Pd.', 'Wali Kelas 6', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_7', '198109052008011002', 7),
(8, 'Syarif Hidayatullah, S.Pd.I.', 'Guru Agama Islam', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_8', '199201152019031005', 8),
(9, 'Rian Hidayat, S.Pd.', 'Guru PJOK / Olahraga', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_9', '199508102022031001', 9),
(10, 'Fitri Handayani, A.Md.', 'Staf Administrasi / TU', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'unsplash_teacher_10', '199810142023022001', 10);

-- Seed Gallery
INSERT OR IGNORE INTO gallery (id, title, description, image_url, cloudinary_id) VALUES 
(1, 'Upacara Peringatan Hari Kemerdekaan RI', 'Siswa dan guru berbaris khidmat memperingati HUT RI ke-80 di halaman sekolah.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800', 'unsplash_gallery_1'),
(2, 'Kegiatan Literasi Bersama di Perpustakaan', 'Membaca buku bersama secara rutin setiap Jumat pagi untuk menumbuhkan minat baca.', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800', 'unsplash_gallery_2'),
(3, 'Praktik Pembelajaran Sains Luar Kelas', 'Siswa kelas 4 mengamati ekosistem kebun sekolah dalam materi IPA.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', 'unsplash_gallery_3'),
(4, 'Senam Kesehatan Jasmani (SKJ) Massal', 'Kegiatan senam bugar ceria seluruh warga SDN Kalisalak 01 setiap Jumat pagi.', 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800', 'unsplash_gallery_4'),
(5, 'Pembiasaan Shalat Dhuha Berjamaah', 'Kegiatan pembiasaan ibadah keagamaan rutin untuk membentuk karakter religius.', 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=800', 'unsplash_gallery_5'),
(6, 'Pentas Seni Kelas 6 & Gelar Karya P5', 'Penampilan bakat tari daerah dan pameran kerajinan daur ulang siswa kelas 6.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800', 'unsplash_gallery_6');
