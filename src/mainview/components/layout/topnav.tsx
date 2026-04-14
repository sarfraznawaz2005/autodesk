import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TopNavProps {
  title: string;
  children?: ReactNode;
}

export function TopNav({ title, children }: TopNavProps) {
  return (
    <header
      className={cn(
        "h-14 shrink-0 flex items-center justify-between px-6",
        "border-b border-gray-200 bg-white"
      )}
    >
      <h1 className="text-lg font-semibold text-gray-900 truncate">
        {title}
      </h1>
      {children && (
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {children}
        </div>
      )}
    </header>
  );
}
