import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const Logo: React.FC<LogoProps> = ({ size = "md", variant = "full" }) => {
  return (
    <div className="flex items-center">
      {/* ✅ Inline SVG logo (converted from your uploaded image) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className={`${sizeMap[size]} rounded-xl`}
      >
        <rect width="256" height="256" rx="48" fill="#e11d48" />
        <text
          x="50%"
          y="56%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="130"
          fontWeight="bold"
          fill="white"
          fontFamily="Arial, sans-serif"
        >
          L
        </text>
      </svg>

      {/* Optional text beside icon */}
      {variant === "full" && (
        <span className="ml-2 font-bold text-gray-900 text-xl">Locentra</span>
      )}
    </div>
  );
};

export default Logo;
