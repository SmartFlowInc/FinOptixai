import React from "react";
import { cn } from "@/lib/utils";

type IconVariant = "primary" | "secondary" | "accent" | "warning" | "success" | "danger";

interface IconWrapperProps {
  children: React.ReactNode;
  variant?: IconVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses: Record<IconVariant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  warning: "bg-[#F39C12]/10 text-[#F39C12]",
  success: "bg-[#2ECC71]/10 text-[#2ECC71]",
  danger: "bg-[#E74C3C]/10 text-[#E74C3C]"
};

const sizeClasses = {
  sm: "w-8 h-8 text-base",
  md: "w-10 h-10 text-lg",
  lg: "w-12 h-12 text-xl"
};

export function IconWrapper({
  children,
  variant = "primary",
  size = "md",
  className,
}: IconWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
