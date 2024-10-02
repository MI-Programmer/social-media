"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ProfileImage from "@/components/common/ProfileImage";
import { createPostComment } from "@/actions/post";

interface CreateCommentProps {
  postId: number;
  profileImage: string | StaticImageData;
}

const CreateComment = ({ postId, profileImage }: CreateCommentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState<string | "">("");
  const isDisabled = isPending || !comment;

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
        <ProfileImage src={profileImage} size="sm" />

        <Textarea
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          placeholder="Write comment..."
          className="h-20"
        />
      </div>

      <Button onClick={handleCreateComment} disabled={isDisabled}>
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CreateComment;
