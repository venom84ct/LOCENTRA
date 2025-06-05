
const Logo: React.FC<LogoProps> = ({ size = "md", variant = "full" }) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex items-center">
      <img
        src="/logo.png"
        alt="Locentra Logo"
        className={`${sizeMap[size]} rounded-xl`}
      />
      {variant === "full" && (
        <span className="ml-2 font-bold text-gray-900 text-xl">Locentra</span>
      )}
    </div>
  );
};
