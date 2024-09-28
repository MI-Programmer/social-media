import { Metadata } from "next";
import Image from "next/image";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

import defaultImgUser from "/public/default-user.jpg";
import PostItem from "@/components/post/PostItem";
import CreateComment from "@/components/post/CreateComment";
import { getPost } from "@/actions/post";
import { getUser } from "@/actions/user";

export const metadata: Metadata = { title: "Post" };

const Post = async ({ params }: Params) => {
  const { postId } = params;

  const user = await getUser();
  const post = await getPost(postId);

  return (
    <div>
      <PostItem user={user} post={post!} />

      <div className="-mt-2 space-y-4 rounded-bl-lg rounded-br-lg bg-white p-4 shadow-md">
        {post?.comments
          ? post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={defaultImgUser}
                    alt="Profile user"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="w-full rounded-xl bg-gray-200/60 p-2">
                  <h3 className="font-semibold">
                    {comment.author.firstName} {comment.author.lastName}
                  </h3>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          : null}

        <CreateComment postId={post!.id} />
      </div>
    </div>
  );
};

export default Post;
