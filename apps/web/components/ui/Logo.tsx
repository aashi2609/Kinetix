import Image from "next/image";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/**
 * GrowEasy logo with glowing effect
 */
export function Logo({ size = 28, showWordmark = true, className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div 
          className="absolute inset-0 animate-pulse blur-md opacity-60"
          style={{
            background: "radial-gradient(circle, var(--brand) 0%, transparent 70%)",
          }}
        />
        {/* Logo image */}
        <Image
          src="/logo.svg"
          alt="GrowEasy"
          width={size}
          height={size}
          className="relative z-10 drop-shadow-[0_0_8px_var(--brand)]"
        />
      </div>
      {showWordmark && (
        <span className="font-sans text-lg font-bold tracking-tight">Kinetix</span>
      )}
    </div>
  );
}