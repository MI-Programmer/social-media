import Image from "next/image";
import { twMerge } from "tailwind-merge";

import defaultImgUser from "/public/default-user.jpg";

interface ProfileImageProps {
  src?: string | null | undefined;
  size?: "sm" | "base" | "lg";
  className?: string;
}

const sizes = { sm: "w-10 h-10", base: "w-20 h-20", lg: "w-40 h-40" };

const ProfileImage = ({ src, size = "base", className }: ProfileImageProps) => {
  return (
    <div
      className={twMerge(
        "relative mx-auto overflow-hidden rounded-full",
        sizes[size],
        className,
      )}
    >
      <Image
        src={src || defaultImgUser}
        alt="Profile user"
        className="object-cover"
        fill
      />
    </div>
  );
};

export default ProfileImage;
