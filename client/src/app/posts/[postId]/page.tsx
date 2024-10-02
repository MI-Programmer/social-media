import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

import PostItem from "@/components/post/PostItem";
import { getPost } from "@/actions/post";
import { getUser } from "@/actions/user";
import { Post as PostType } from "@/types/post";
import PostComments from "@/components/post/PostComments";

export const metadata: Metadata = { title: "Post" };

const Post = async ({ params }: Params) => {
  const { postId } = params;

  const user = await getUser();
  const post: PostType = await getPost(postId);

  return (
    <section>
      <PostItem user={user} post={post!} />

      <PostComments comments={post.comments} postId={post.id} user={user} />
    </section>
  );
};

export default Post;
