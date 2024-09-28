"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

import defaultImgUser from "/public/default-user.jpg";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ButtonLoading from "@/components/common/ButtonLoading";
import { createPostComment } from "@/actions/post";

interface CreateCommentProps {
  postId: number;
}

const CreateComment = ({ postId }: CreateCommentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState<string | "">("");

  const handleCreateComment = () => {
    startTransition(async () => {
      const data = await createPostComment({ postId, content: comment! });

      if (data.status === "success") {
        setComment("");
        toast.success(data.message);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-1 items-start gap-2">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={defaultImgUser}
            alt="Profile user"
            fill
            className="object-cover"
          />
        </div>

        <Textarea
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          placeholder="Write comment..."
          className="h-20 resize-none"
        />
      </div>

      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button onClick={handleCreateComment}>Add comment</Button>
      )}
    </div>
  );
};

export default CreateComment;
