
"use client";

import { Button } from "@/components/ui/button";
import { Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PanicButtonProps {
  className?: string;
  size?: "default" | "lg" | "sm";
  showLabel?: boolean;
  buttonText?: string;
  onClick?: () => void;
}

export function PanicButton({ 
  className, 
  size = "lg", 
  showLabel = true, 
  buttonText = "PANIC",
  onClick 
}: PanicButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/emergency-alert");
    }
  };
  
  const sizeClasses = {
    sm: "h-20 w-20 text-2xl",
    default: "h-32 w-32 text-4xl",
    lg: "h-40 w-40 text-5xl p-4"
  };

  const iconSizeClasses = {
    sm: "h-8 w-8",
    default: "h-12 w-12",
    lg: "h-16 w-16"
  }

  return (
    <Button
      variant="destructive"
      className={cn(
        "rounded-full animate-pulse-red flex flex-col items-center justify-center",
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      aria-label="Panic Button"
    >
      <Siren className={cn(iconSizeClasses[size])} />
      {showLabel && <span className="mt-2 text-sm font-semibold">{buttonText}</span>}
    </Button>
  );
}
