import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

const Logo: React.FC<LogoProps> = ({ size = "md", variant = "full" }) => {
  // Size mappings
  const sizeMap = {
    sm: {
      icon: "h-6 w-6",
      text: "text-lg",
      circle: "h-2 w-2",
      spacing: "ml-1.5",
    },
    md: {
      icon: "h-8 w-8",
      text: "text-xl",
      circle: "h-3 w-3",
      spacing: "ml-2",
    },
    lg: {
      icon: "h-10 w-10",
      text: "text-2xl",
      circle: "h-3.5 w-3.5",
      spacing: "ml-2.5",
    },
  };

  const { icon, text, circle, spacing } = sizeMap[size];

  return (
    <div className="flex items-center">
      <div
        className={`${icon} bg-red-600 rounded-md flex items-center justify-center relative`}
      >
        <span className="text-white font-bold">L</span>
        <div
          className={`absolute top-0 right-0 ${circle} bg-white rounded-full transform translate-x-1 -translate-y-1`}
        ></div>
      </div>
      {variant === "full" && (
        <span className={`${text} font-bold ${spacing} text-gray-900`}>
          Locentra
        </span>
      )}
    </div>
  );
};

export default Logo;
