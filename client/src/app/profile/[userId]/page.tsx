import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { redirect } from "next/navigation";
import { FaUserCheck, FaUserMinus, FaUserPlus } from "react-icons/fa6";

import defaultImgUser from "/public/default-user.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ProfileImage from "@/components/common/ProfileImage";
import CreatePost from "@/components/post/CreatePost";
import PostItems from "@/components/post/PostItems";
import EditProfile from "@/components/user/EditProfile";
import FriendListGrid from "@/components/user/FriendListGrid";
import { getUserPosts } from "@/actions/post";
import {
  createFriend,
  deleteFriend,
  getUser,
  getUserById,
} from "@/actions/user";
import { Post } from "@/types/post";
import { User } from "@/types/user";

export const metadata: Metadata = { title: "Profile" };

const Profile = async ({ params }: Params) => {
  const userId = +params.userId || 0;

  const authUser: User = await getUser();
  const user = await getUserById(userId);
  const posts: Post[] = await getUserPosts(userId);

  if (user.status === "error") {
    return redirect("/404");
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const isFriend = authUser.friends.some((item) => item.friendId === user.id);
  const isProfileAuth = user.id === authUser.id;
  user.imageUrl = user.imageUrl || defaultImgUser;

  return (
    <section className="mx-auto max-w-xl space-y-3 sm:space-y-4 md:space-y-6">
      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="flex flex-col items-center">
          <ProfileImage src={user.imageUrl} size="lg" />

          <div className="mt-2">
            <h2 className="text-3xl font-bold">{fullName}</h2>
          </div>

          <div className="mt-2">
            {!isProfileAuth ? (
              isFriend ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="flex items-center gap-2"
                      variant="secondary"
                      size="sm"
                    >
                      <FaUserCheck className="h-5 w-5" /> Friend
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <form action={deleteFriend}>
                        <input type="hidden" name="friendId" value={user.id} />

                        <button className="flex items-center gap-2">
                          <FaUserMinus className="h-5 w-5" /> Unfriend
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <form action={createFriend}>
                  <input type="hidden" name="friendId" value={user.id} />

                  <Button
                    className="flex items-center gap-2"
                    variant="secondary"
                    size="sm"
                  >
                    <FaUserPlus className="h-5 w-5" /> Add friend
                  </Button>
                </form>
              )
            ) : null}
          </div>

          {userId === authUser.id && <EditProfile user={user} />}
        </div>
      </div>

      <FriendListGrid friends={user.friends} />

      {isProfileAuth && (
        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md">
          <ProfileImage src={user.imageUrl} size="sm" />

          <CreatePost />
        </div>
      )}

      <PostItems posts={posts} isUserPosts={true} />
    </section>
  );
};

export default Profile;
