"use client";

import { SendHorizonal } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";

import CreateComment from "@/components/post/CreateComment";
import CommentItem from "@/components/post/CommentItem";
import CommentMenu from "@/components/post/CommentMenu";
import { Button } from "@/components/ui/button";
import { deletePostComment, updatePostComment } from "@/actions/post";
import { Comment } from "@/types/post";
import { User } from "@/types/user";

interface PostCommentsProps {
  comments: Comment[] | [];
  postId: number;
  user: User;
}

const PostComments = ({ comments, postId, user }: PostCommentsProps) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticComments, optimisticDelete] = useOptimistic(
    comments,
    (curComments, { id, action, content }) => {
      let nextComments;
      if (action === "update")
        nextComments = curComments.map((comment) =>
          comment.id === id ? { ...comment, content } : comment,
        );
      if (action === "delete")
        nextComments = curComments.filter((comment) => comment.id !== id);

      return nextComments!;
    },
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [content, setContent] = useState<string>("");
  const isDisabled = isPending || content === "";

  const handleEditComment = (id: number) => {
    setContent(comments.find((comment) => comment.id === id)?.content || "");
    setEditId(id);
  };

  const cancelEditComment = () => {
    setContent("");
    setEditId(null);
  };

  const handleUpdate = async () => {
    startTransition(() =>
      optimisticDelete({ id: editId, action: "update", content }),
    );
    await updatePostComment({ postId, commentId: editId, content });
    setEditId(null);
  };

  const handleDelete = async (id: Number) => {
    startTransition(() =>
      optimisticDelete({ id, action: "delete", content: "" }),
    );
    await deletePostComment({ postId, commentId: id });
  };

  return (
    <div className="-mt-2 space-y-4 rounded-bl-lg rounded-br-lg bg-white p-4 shadow-md">
      {optimisticComments.length
        ? optimisticComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              editId={editId}
              content={content}
              setContent={setContent}
            >
              {comment.authorId === user.id && (
                <CommentMenu
                  commentId={comment.id}
                  onDelete={handleDelete}
                  onEditComment={handleEditComment}
                />
              )}

              {editId === comment.id && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUpdate}
                    disabled={content === comment.content || isDisabled}
                  >
                    <SendHorizonal className="h-4 w-4" />
                  </Button>

                  <button
                    className="mt-auto pl-2 text-sm font-medium text-red-600 transition-colors hover:text-red-500"
                    onClick={cancelEditComment}
                  >
                    Cancel
                  </button>
                </>
              )}
            </CommentItem>
          ))
        : null}

      <CreateComment postId={postId} profileImage={user.imageUrl} />
    </div>
  );
};

export default PostComments;
