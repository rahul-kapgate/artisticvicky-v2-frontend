import { AVATARS } from "@/components/avatar/avatars";

interface ArtAvatarProps {
  avatarId: number;
  size?: number;
  className?: string;
}

export default function ArtAvatar({ avatarId, size = 80, className }: ArtAvatarProps) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];

  return (
    <div
      className={className}
      style={{ width: size, height: size, borderRadius: "1rem", overflow: "hidden", flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: avatar.svg }}
    />
  );
}