import Link from "next/link";

import ProfileImage from "@/components/common/ProfileImage";
import ModalFriendList from "@/components/user/ModalFriendList";
import { Friend } from "@/types/user";

interface FriendListGridProps {
  friends: Friend[];
}

const FriendListGrid = ({ friends }: FriendListGridProps) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Friends ({friends.length})</h2>

        <ModalFriendList friends={friends} />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {friends.slice(0, 8).map((item: Friend) => (
          <Link
            href={`/profile/${item.friendId}`}
            key={item.id}
            className="group"
          >
            <ProfileImage src={item.friend.imageUrl} />

            <h3 className="mt-2 text-center text-xs font-medium group-hover:underline">
              {item.friend.firstName} {item.friend.lastName}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendListGrid;
