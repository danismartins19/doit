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
  return (
    <Avatar
      className={cn(className)}
      style={{ width: size, height: size }}
      title={title ?? person.name}
    >
      <AvatarFallback
        style={{ background: person.color, fontSize: size * 0.42 }}
      >
        {initials(person.name)}
      </AvatarFallback>
    </Avatar>
  );
}
