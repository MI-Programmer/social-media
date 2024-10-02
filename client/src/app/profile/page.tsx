import { Metadata } from "next";

import defaultImgUser from "/public/default-user.jpg";
import CreatePost from "@/components/post/CreatePost";
import PostItems from "@/components/post/PostItems";
import EditProfile from "@/components/user/EditProfile";
import ProfileImage from "@/components/common/ProfileImage";
import { getUserPosts } from "@/actions/post";
import { getUser } from "@/actions/user";
import { Post } from "@/types/post";

export const metadata: Metadata = { title: "Profile" };

const Profile = async () => {
  const posts: Post[] = await getUserPosts();
  const user = await getUser();

  const fullName = `${user.firstName} ${user.lastName}`;
  user.imageUrl = user.imageUrl || defaultImgUser;

  return (
    <section className="space-y-6">
      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="flex flex-col items-center">
          <ProfileImage src={user.imageUrl} size="lg" />

          <div className="mt-2">
            <h2 className="text-3xl font-bold">{fullName}</h2>
          </div>

          <EditProfile user={user} />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <ProfileImage src={user.imageUrl} size="sm" />

          <CreatePost />
        </div>
      </div>

      <PostItems posts={posts} isUserPosts={true} />
    </section>
  );
};

export default Profile;
