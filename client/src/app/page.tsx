import CreatePost from "@/components/post/CreatePost";
import PostItems from "@/components/post/PostItems";
import ProfileImage from "@/components/common/ProfileImage";
import FriendList from "@/components/user/FriendList";
import { getPosts } from "@/actions/post";
import { getUser } from "@/actions/user";
import { Post } from "@/types/post";
import { User } from "@/types/user";

const Home = async () => {
  const user: User = await getUser();
  const posts: Post[] = await getPosts();

  return (
    <section className="relative">
      <div className="mx-auto max-w-xl space-y-3 sm:space-y-4 md:space-y-6">
        <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md">
          <ProfileImage src={user.imageUrl} size="sm" />

          <CreatePost />
        </div>

        <PostItems posts={posts} />
      </div>

      <FriendList friends={user.friends} />
    </section>
  );
};

export default Home;
