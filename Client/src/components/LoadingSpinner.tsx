import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  text = "Loading...",
}) => {
  const sizeClass = {
    small: "spinner-border-sm",
    medium: "",
    large: "spinner-border-lg",
  }[size];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-3">
      <div className={`spinner-border ${sizeClass} text-primary`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <p className="mt-2 mb-0">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
