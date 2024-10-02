import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/actions/post";

interface DeletePostProps {
  postId: number;
}

const DeletePost = ({ postId }: DeletePostProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleDeletePost = () => {
    startTransition(async () => {
      const data = await deletePost(postId);

      if (data.status === "success") {
        toast.success(data.message);

        if (pathname.includes("/posts")) router.back();
        else router.refresh();
      } else {
        toast.error(data.message);
      }
    });
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your post.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          variant="destructive"
          onClick={handleDeletePost}
          disabled={isPending}
        >
          Delete
        </Button>
      </AlertDialogFooter>
    </>
  );
};

export default DeletePost;
