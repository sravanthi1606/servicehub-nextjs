import { cx } from "@/lib/cx";
import { getInitials } from "@/lib/format";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Initials avatar. Profile images can be added once uploads exist (spec: User.profileImage).
export default function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <span className={cx("avatar", size !== "md" && `avatar--${size}`, className)} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}
