-- Drop old table if exists
DROP TABLE IF EXISTS school_profile;

-- Create school profile table
CREATE TABLE school_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  nama_sekolah TEXT NOT NULL,
  npsn TEXT NOT NULL,
  akreditasi TEXT NOT NULL,
  bentuk_pendidikan TEXT NOT NULL,
  status_sekolah TEXT NOT NULL,
  jenjang_pendidikan TEXT NOT NULL,
  sk_pendirian TEXT NOT NULL,
  kurikulum TEXT NOT NULL,
  alamat TEXT NOT NULL,
  sejarah TEXT NOT NULL,
  visi TEXT NOT NULL,
  misi TEXT NOT NULL,
  fasilitas TEXT NOT NULL,
  sambutan_nama TEXT NOT NULL,
  sambutan_jabatan TEXT NOT NULL,
  sambutan_foto TEXT NOT NULL,
  sambutan_judul TEXT NOT NULL,
  sambutan_isi TEXT NOT NULL
);

-- Seed initial values
INSERT OR REPLACE INTO school_profile (
  id, nama_sekolah, npsn, akreditasi, bentuk_pendidikan, status_sekolah,
  jenjang_pendidikan, sk_pendirian, kurikulum, alamat, sejarah, visi, misi, fasilitas,
  sambutan_nama, sambutan_jabatan, sambutan_foto, sambutan_judul, sambutan_isi
) VALUES (
  1,
  'SD NEGERI KALISALAK 01',
  '20325895',
  'B',
  'SD',
  'NEGERI',
  'DIKDAS',
  '01-01-1910',
  'Kurikulum Merdeka',
  'Jl. K. Abdul Latif, Kalisalak, Kec. Margasari, Kab. Tegal, Prov. Jawa Tengah',
  '<p>SDN Kalisalak 01 didirikan pada tahun 1910 untuk memenuhi kebutuhan akses pendidikan dasar bagi anak-anak di Desa Kalisalak dan sekitarnya di wilayah Kecamatan Margasari, Kabupaten Tegal.</p><p>Seiring berjalannya waktu, sekolah ini terus mengalami perkembangan baik dari segi sarana prasarana maupun mutu pengajaran. Berkat dedikasi para guru dan dukungan berkelanjutan komite sekolah, SDN Kalisalak 01 terus meningkatkan mutu pendidikannya.</p><p>Kini, SDN Kalisalak 01 dipercaya sebagai salah satu sekolah rujukan di Kecamatan Margasari dalam penerapan Perilaku Hidup Bersih Sehat (PHBS) dan sekolah pelaksana Kurikulum Merdeka yang adaptif dan ramah anak.</p>',
  '"Terwujudnya Peserta Didik yang Berakhlak Mulia, Cerdas, Berprestasi, Sehat, dan Peduli Lingkungan Berlandaskan Nilai-Nilai Pancasila."',
  '<li>Menanamkan keimanan, ketakwaan, dan pembiasaan akhlak mulia melalui program keagamaan rutin.</li><li>Menyelenggarakan pembelajaran Kurikulum Merdeka secara aktif, inovatif, kreatif, efektif, dan menyenangkan (PAIKEM).</li><li>Membina dan memfasilitasi pengembangan potensi, minat, dan bakat siswa di bidang akademis serta non-akademis.</li><li>Membudayakan perilaku hidup bersih dan sehat (PHBS) serta memelihara lingkungan sekolah agar tetap asri, sejuk, dan higienis.</li><li>Menjalin kemitraan kolaboratif dengan orang tua, komite sekolah, dan instansi terkait demi tercapainya target mutu pendidikan.</li>',
  '<li>6 Ruang Kelas yang representatif</li><li>Perpustakaan Sekolah "Pelita Ilmu"</li><li>Unit Kesehatan Sekolah (UKS) Berstandar</li><li>Mushola Sekolah "Al-Ikhlas"</li><li>Laboratorium Komputer & TIK</li><li>Lapangan Olahraga Multiguna</li><li>Kantin Sehat Sekolah</li><li>Taman Hidroponik & Apotek Hidup</li>',
  'Bambang Setiawan, S.Pd., M.Pd.',
  'Kepala Sekolah SDN Kalisalak 01',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
  'Mewujudkan Sekolah Sehat & Berprestasi',
  '<p>Assalamu''alaikum Warahmatullahi Wabarakatuh,</p><p>Salam sejahtera bagi kita semua. Kami ucapkan selamat datang di website portal resmi SDN Kalisalak 01 Margasari. Melalui platform digital ini, kami berkomitmen untuk menyediakan sarana informasi yang cepat, transparan, dan terpercaya bagi seluruh wali murid, guru, staf, serta masyarakat umum mengenai seluruh kegiatan dan perkembangan di sekolah kami.</p><p>Sebagai salah satu sekolah dasar unggulan di Kabupaten Tegal, kami berdedikasi tinggi untuk melahirkan tunas-tunas bangsa yang berkarakter islami/religius, sehat fisik dan mental, serta kompetitif dalam prestasi akademis maupun non-akademis. Kami percaya sinergi yang kuat antara sekolah, orang tua, and masyarakat adalah kunci utama kesuksesan belajar anak didik kita.</p>'
);
