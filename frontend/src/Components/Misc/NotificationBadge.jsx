import React from "react";

const NotificationBadge = ({ children, count}) => {
  return (
    <div className="badge-block">
      {children}
      {count ? (
        <span
          className="e-badge e-badge-success e-badge-overlap e-badge-notification"
          style={{
            color: "white",
            background: "red",
            border: "1px solid black",
            borderRadius: "100px",
          }}
        >
          {count > 100 ? "100 +" : count}
        </span>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationBadge;
