import Image, { StaticImageData } from "next/image";
import { twMerge } from "tailwind-merge";

interface ProfileImageProps {
  src: string | StaticImageData;
  size?: "sm" | "base" | "lg";
}

const sizes = { sm: "w-10 h-10", base: "w-20 h-20", lg: "w-40 h-40" };

const ProfileImage = ({ src, size = "base" }: ProfileImageProps) => {
  return (
    <div
      className={twMerge(
        "relative mx-auto overflow-hidden rounded-full",
        sizes[size],
      )}
    >
      <Image src={src} alt="Profile user" className="object-cover" fill />
    </div>
  );
};

export default ProfileImage;
