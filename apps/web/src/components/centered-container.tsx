import type React from "react";

interface CenteredContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function CenteredContainer({
  children,
  className = "",
}: CenteredContainerProps) {
  return (
    <div className="w-full min-h-screen flex mt-20 justify-center">
      <div className={`max-w-7xl w-full mx-8 ${className}`}>{children}</div>
    </div>
  );
}
