import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { redirect } from "next/navigation";

import PostItem from "@/components/post/PostItem";
import { getPost } from "@/actions/post";
import { getUser } from "@/actions/user";
import { Post as PostType } from "@/types/post";
import PostComments from "@/components/post/PostComments";

interface PostData extends PostType {
  status?: string;
}

export const metadata: Metadata = { title: "Post" };

const Post = async ({ params }: Params) => {
  const { postId } = params;

  const user = await getUser();
  const post: PostData = await getPost(postId);
  if (post?.status === "error") {
    return redirect("/404");
  }

  return (
    <section className="mx-auto max-w-xl">
      <PostItem user={user} post={post!} />

      <PostComments comments={post.comments} postId={post.id} user={user} />
    </section>
  );
};

export default Post;
