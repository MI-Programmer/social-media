import Image from "next/image";

import defaultImgUser from "/public/default-user.jpg";
import CreatePost from "@/components/post/CreatePost";
import PostItems from "@/components/post/PostItems";
import { getPosts } from "@/actions/post";
import { Post } from "@/types/post";

const Home = async () => {
  const posts: Post[] = await getPosts();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md">
        <div>
          <Image
            src={defaultImgUser}
            alt="Profile user"
            className="h-10 w-10"
          />
        </div>

        <CreatePost />
      </div>

      <PostItems posts={posts} />
    </section>
  );
};

export default Home;
