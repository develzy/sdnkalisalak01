import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

export type ToastType = "success" | "warning" | "danger" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} style={{ color: "var(--success)", flexShrink: 0 }} />;
      case "warning":
        return <AlertTriangle size={18} style={{ color: "var(--warning)", flexShrink: 0 }} />;
      case "danger":
        return <XCircle size={18} style={{ color: "var(--danger)", flexShrink: 0 }} />;
      default:
        return <Info size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      {getIcon()}
      <span style={{ flexGrow: 1 }}>{message}</span>
    </div>
  );
};
