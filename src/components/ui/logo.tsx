import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

const Logo: React.FC<LogoProps> = ({ size = "md", variant = "full" }) => {
  return (
    <div className="flex items-center">
      <img
        src="/logo.png" // or use "/logo.svg" if applicable
        alt="Locentra Logo"
        className={`${sizeMap[size]} object-contain rounded-xl`}
      />
      {variant === "full" && (
        <span className="ml-2 font-bold text-gray-900 text-xl">Locentra</span>
      )}
    </div>
  );
};

export default Logo;
