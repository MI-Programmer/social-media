import { Dispatch, ReactNode, SetStateAction } from "react";
import { formatDistanceToNow } from "date-fns";

import { Textarea } from "@/components/ui/textarea";
import ProfileImage from "@/components/common/ProfileImage";
import { Comment } from "@/types/post";

interface CommentItemProps {
  children: ReactNode;
  comment: Comment;
  editId: number | null;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const CommentItem = ({
  children,
  comment,
  editId,
  content,
  setContent,
}: CommentItemProps) => {
  const {
    author: { firstName, lastName, imageUrl },
  } = comment;
  const fullName = `${firstName} ${lastName}`;
  const isEdit = editId === comment.id;

  return (
    <div className="flex gap-2">
      <ProfileImage src={imageUrl} size="sm" />

      <div className="group flex w-full items-center gap-1 pr-2">
        <div className={`${isEdit ? "flex-1" : "max-w-[92%]"}`}>
          <div className="rounded-xl bg-gray-200 p-2 px-3">
            <h3 className="font-semibold">{fullName}</h3>

            {isEdit ? (
              <Textarea
                variant="transparent"
                className="h-auto"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <p className="text-sm">{comment.content}</p>
            )}
          </div>

          <div className="p-1 px-3 text-xs text-gray-600">
            {formatDistanceToNow(new Date(comment.createdAt))}
          </div>
        </div>

        <div className="flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
};

export default CommentItem;
