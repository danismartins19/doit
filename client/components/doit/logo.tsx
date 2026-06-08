import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-[108px] shrink-0 items-center",
        className,
      )}
    >
      <Image
        src="/logo/light.png"
        alt="doit"
        width={2172}
        height={724}
        priority
        className="h-full w-full object-contain block dark:hidden"
      />
      <Image
        src="/logo/dark.png"
        alt="doit"
        width={2172}
        height={724}
        priority
        className="h-full w-full object-contain hidden dark:block"
      />
    </span>
  );
}
