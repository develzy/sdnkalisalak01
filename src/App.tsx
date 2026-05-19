import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { NewsList } from "./pages/NewsList";
import { NewsDetail } from "./pages/NewsDetail";
import { Announcements } from "./pages/Announcements";
import { Events } from "./pages/Events";
import { Gallery } from "./pages/Gallery";
import { Profile } from "./pages/Profile";
import { Staff } from "./pages/Staff";
import { Contact } from "./pages/Contact";
import { AdminDashboard } from "./pages/AdminDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Sticky Navbar */}
        <Navbar />

        {/* PWA Prompt Banner */}
        <PWAInstallPrompt />

        {/* Page Content */}
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/berita" element={<NewsList />} />
            <Route path="/berita/:slug" element={<NewsDetail />} />
            <Route path="/pengumuman" element={<Announcements />} />
            <Route path="/agenda" element={<Events />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/guru-staff" element={<Staff />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Professional Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
