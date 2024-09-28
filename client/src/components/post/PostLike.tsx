"use client";

import { ThumbsUp } from "lucide-react";
import { HiThumbUp } from "react-icons/hi";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { likePost, unlikePost } from "@/actions/post";

interface PostLikeProps {
  postId: number;
  likeId: number | null;
}

const PostLike = ({ postId, likeId }: PostLikeProps) => {
  const router = useRouter();

  const handleLikeAction = async () => {
    let data;
    if (likeId) {
      data = await unlikePost({ postId, likeId });
    } else {
      data = await likePost(postId);
    }

    if (data.status === "success") {
      router.refresh();
    }
  };

  return (
    <Button
      onClick={handleLikeAction}
      variant="ghost"
      className={`flex w-full items-center gap-1.5 text-base ${likeId ? "text-blue-600 hover:text-blue-600" : ""}`}
    >
      {likeId ? (
        <HiThumbUp className="h-7 w-7" />
      ) : (
        <ThumbsUp className="h-6 w-6" />
      )}
      <span>Like</span>
    </Button>
  );
};

export default PostLike;
