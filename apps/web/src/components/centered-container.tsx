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
    <div className="w-full min-h-screen flex mt-12 sm:mt-16 md:mt-20 justify-center">
      <div className={`max-w-7xl w-full mx-4 sm:mx-6 md:mx-8 ${className}`}>{children}</div>
    </div>
  );
}
