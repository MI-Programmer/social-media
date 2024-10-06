import FriendListItem from "@/components/user/FriendListItem";
import ModalFriendList from "@/components/user/ModalFriendList";
import { Friend } from "@/types/user";

interface FriendListProps {
  friends: Friend[];
}

const FriendList = ({ friends }: FriendListProps) => {
  return (
    <div className="absolute right-0 top-0 hidden xl:block">
      <div className="rounded-lg bg-white p-4">
        <div className="flex w-60 items-center justify-between">
          <h2 className="text-lg font-semibold">Friends ({friends.length})</h2>

          <ModalFriendList friends={friends} />
        </div>
        <hr className="mt-4 h-0.5 w-full bg-gray-400" />

        <div className="divide-y-2">
          {friends.slice(0, 10).map((item: Friend) => (
            <FriendListItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
