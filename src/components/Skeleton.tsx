import React from "react";

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="card-news" style={{ pointerEvents: "none" }}>
      <div className="skeleton skeleton-rect" style={{ height: "200px" }}></div>
      <div className="card-news-body" style={{ gap: "8px" }}>
        <div className="skeleton skeleton-text" style={{ width: "30%", height: "14px" }}></div>
        <div className="skeleton skeleton-title" style={{ width: "90%", height: "20px" }}></div>
        <div className="skeleton skeleton-title" style={{ width: "70%", height: "20px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "100%", height: "12px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "100%", height: "12px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "40%", height: "12px" }}></div>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="skeleton skeleton-text" style={{ width: "40%", height: "14px" }}></div>
          <div className="skeleton skeleton-text" style={{ width: "20%", height: "14px" }}></div>
        </div>
      </div>
    </div>
  );
};

export const StaffCardSkeleton: React.FC = () => {
  return (
    <div className="staff-card" style={{ pointerEvents: "none" }}>
      <div className="skeleton skeleton-rect" style={{ height: "240px" }}></div>
      <div className="staff-info" style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
        <div className="skeleton skeleton-text" style={{ width: "70%", height: "16px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "50%", height: "12px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "40%", height: "10px" }}></div>
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 0" }}>
      <div className="skeleton skeleton-text" style={{ width: "20%", height: "14px", marginBottom: "16px" }}></div>
      <div className="skeleton skeleton-title" style={{ width: "90%", height: "36px", marginBottom: "16px" }}></div>
      <div className="skeleton skeleton-title" style={{ width: "60%", height: "36px", marginBottom: "24px" }}></div>
      <div
        className="skeleton"
        style={{ width: "100%", height: "400px", borderRadius: "var(--radius)", marginBottom: "32px" }}
      ></div>
      <div className="skeleton skeleton-text" style={{ height: "16px", marginBottom: "12px" }}></div>
      <div className="skeleton skeleton-text" style={{ height: "16px", marginBottom: "12px" }}></div>
      <div className="skeleton skeleton-text" style={{ height: "16px", marginBottom: "12px" }}></div>
      <div className="skeleton skeleton-text" style={{ width: "80%", height: "16px", marginBottom: "12px" }}></div>
    </div>
  );
};

interface SkeletonProps {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = "100%", height = "16px", style }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: "4px",
        ...style
      }}
    ></div>
  );
};
