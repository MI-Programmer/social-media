import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FriendListItem from "@/components/user/FriendListItem";
import { Friend } from "@/types/user";

interface ModalFriendListProps {
  friends: Friend[];
}

const ModalFriendList = ({ friends }: ModalFriendListProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          See all friends
        </Button>
      </DialogTrigger>

      <DialogContent>
        <h2 className="text-lg font-semibold">Friends ({friends.length})</h2>

        <div className="max-h-72 divide-y-2 overflow-auto">
          {friends.map((item: Friend) => (
            <FriendListItem key={item.id} item={item} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFriendList;
