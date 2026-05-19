import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, Newspaper, Megaphone, Calendar, Image, School, Users, PhoneCall, LayoutDashboard, Home } from "lucide-react";
import { api } from "../services/api";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const isLoggedIn = api.isLoggedIn();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme application
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const navItems = [
    { name: "Beranda", path: "/", icon: <Home size={16} /> },
    { name: "Berita", path: "/berita", icon: <Newspaper size={16} /> },
    { name: "Pengumuman", path: "/pengumuman", icon: <Megaphone size={16} /> },
    { name: "Agenda", path: "/agenda", icon: <Calendar size={16} /> },
    { name: "Galeri", path: "/galeri", icon: <Image size={16} /> },
    { name: "Profil", path: "/profil", icon: <School size={16} /> },
    { name: "Guru & Staff", path: "/guru-staff", icon: <Users size={16} /> },
    { name: "Kontak", path: "/kontak", icon: <PhoneCall size={16} /> },
  ];

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        <Link to="/" className="logo-link">
          <img src="/icons/logo.png" alt="Logo SDN Kalisalak 01" className="logo-img" />
          <div className="logo-text">
            <h1>SDN KALISALAK 01</h1>
            <p>Margasari, Kabupaten Tegal</p>
          </div>
        </Link>

        <ul className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <li key={item.name}>
                <Link to={item.path} className={`nav-link ${isActive ? "active" : ""}`}>
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
          
          {/* Dashboard Link for Admin */}
          <li>
            <Link
              to="/admin"
              className={`nav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
              style={{ color: "var(--secondary-dark)" }}
            >
              <LayoutDashboard size={16} />
              {isLoggedIn ? "Admin Panel" : "Login Admin"}
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            className="mobile-nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
