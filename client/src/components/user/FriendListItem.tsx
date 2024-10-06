import Link from "next/link";

import ProfileImage from "@/components/common/ProfileImage";
import { Friend } from "@/types/user";

interface FriendListItemProps {
  item: Friend;
}

const FriendListItem = ({ item }: FriendListItemProps) => {
  return (
    <Link
      href={`/profile/${item.friendId}`}
      className="group flex items-center gap-4 py-4 font-semibold"
    >
      <ProfileImage src={item.friend.imageUrl} size="sm" className="mx-0" />

      <h3 className="group-hover:underline">
        {item.friend.firstName} {item.friend.lastName}
      </h3>
    </Link>
  );
};

export default FriendListItem;
