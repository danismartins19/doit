import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/date-utils";
import type { Person } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  person: Person;
  size?: number;
  className?: string;
  title?: string;
}

/** Colored initials avatar. Size drives both the circle and the font. */
export function UserAvatar({ person, size = 26, className, title }: UserAvatarProps) {
  const palette = ["#3d7ff5", "#8b5cf6", "#1f9d63", "#e0901a", "#e5557a", "#0ea5b7"];
  const color = palette[
    Array.from(person.id).reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      palette.length
  ];

  return (
    <Avatar
      className={cn(className)}
      style={{ width: size, height: size }}
      title={title ?? person.name}
    >
      <AvatarFallback
        style={{ background: color, fontSize: size * 0.42 }}
      >
        {initials(person.name)}
      </AvatarFallback>
    </Avatar>
  );
}
