import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { HiThumbUp } from "react-icons/hi";
import { Dot, MessageCircle } from "lucide-react";

import PostLike from "@/components/post/PostLike";
import PostMenu from "@/components/post/PostMenu";
import { Button } from "@/components/ui/button";
import ProfileImage from "@/components/common/ProfileImage";
import { createFriend } from "@/actions/user";
import { Post } from "@/types/post";
import { User } from "@/types/user";

interface PostItemProps {
  post: Post;
  user: User;
}

const PostItem = ({ post, user }: PostItemProps) => {
  const { id, content, imageUrl, likes, comments, author, createdAt } = post;
  const isAuthorized = post.author.id === user.id;
  const isFriend = user.friends.some((item) => item.friendId === author.id);
  const isPostAuth = post.author.id === user.id;

  return (
    <div className="space-y-2 rounded-md bg-card p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProfileImage src={author.imageUrl} size="sm" />

          <div>
            <div className="flex items-center">
              <Link
                href={`/profile/${author.id}`}
                className="font-semibold hover:underline"
              >
                {author.firstName} {author.lastName}
              </Link>

              {!isPostAuth && (
                <div className="flex items-center">
                  <Dot className="h-4 w-4" />

                  {isFriend ? (
                    <p className="text-xs font-medium">Friend</p>
                  ) : (
                    <form action={createFriend}>
                      <input
                        type="hidden"
                        name="friendId"
                        value={post.author.id}
                      />

                      <Button variant="link" size="sm" className="p-0">
                        Add friend
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs font-medium text-gray-600">
              {format(new Date(createdAt), "d MMMM 'at' HH:mm")}
            </p>
          </div>
        </div>

        <PostMenu post={post} isAuthorized={isAuthorized} isFriend={isFriend} />
      </div>

      <div>{content}</div>

      <Link
        href={`/posts/${id}`}
        className="relative block aspect-square overflow-hidden rounded-2xl"
      >
        <Image src={imageUrl} fill alt="Image post" className="object-cover" />
      </Link>

      <div className="flex items-center justify-between py-1">
        <div className="flex items-center">
          {likes[0] && (
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-600 p-1 text-white">
                <HiThumbUp className="h-4 w-4" />
              </div>
              <span className="text-gray-700">
                {likes[0].user.firstName} {likes[0].user.lastName}
              </span>
            </div>
          )}

          {likes[1] && (
            <div className="text-gray-700">
              , {likes.length === 2 && "and"} {likes[1].user.firstName}{" "}
              {likes[1].user.lastName}
            </div>
          )}

          {likes.length > 2 && (
            <div className="text-gray-700">, and {likes.length - 2} others</div>
          )}
        </div>

        {comments.length ? (
          <Link href={`/posts/${id}`} className="text-gray-700">
            {comments.length} comment{comments.length > 1 && "s"}
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-gray-300 p-1 px-2">
        <PostLike
          postId={id}
          likeId={likes.find((like) => like.user.id === user.id)?.id || null}
        />

        <Link href={`/posts/${id}`}>
          <Button
            variant="ghost"
            className="flex w-full items-center gap-1.5 text-base"
          >
            <MessageCircle className="h-6 w-6" />
            <span>Comment</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
