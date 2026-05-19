import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install banner
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also check if already dismissed in this session
    const isDismissed = sessionStorage.getItem("pwa_dismissed") === "true";
    if (isDismissed) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, clear it
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="container" style={{ margin: "24px auto 0 auto" }}>
      <div className="pwa-banner">
        <div className="pwa-banner-text">
          <h3>Pasang Aplikasi SDN Kalisalak 01</h3>
          <p>Dapatkan informasi sekolah lebih cepat dan mudah langsung dari layar beranda HP Anda.</p>
        </div>
        <div className="pwa-banner-actions">
          <button className="btn btn-secondary" onClick={handleInstallClick}>
            <Download size={16} />
            Install Sekarang
          </button>
          <button
            className="btn-icon"
            onClick={handleDismiss}
            style={{ color: "white", backgroundColor: "rgba(255,255,255,0.1)" }}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
