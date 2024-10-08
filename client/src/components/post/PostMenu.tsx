"use client";

import Link from "next/link";
import { Edit, Ellipsis, Eye, Trash2, UserMinus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import DeletePost from "@/components/post/DeletePost";
import UpdatePost from "@/components/post/UpdatePost";
import { Post } from "@/types/post";
import { deleteFriend } from "@/actions/user";

interface PostMenuProps {
  post: Post;
  isAuthorized: boolean;
  isFriend: boolean;
}

const PostMenu = ({ post, isAuthorized, isFriend }: PostMenuProps) => {
  const { id, author } = post;

  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis className="h-6 w-6 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                href={`/posts/${id}`}
                className="flex w-full items-center gap-2"
              >
                <Eye className="h-5 w-5" /> View
              </Link>
            </DropdownMenuItem>

            {isFriend && (
              <DropdownMenuItem>
                <form action={deleteFriend}>
                  <input type="hidden" name="friendId" value={author.id} />

                  <button className="flex w-full items-center gap-2">
                    <UserMinus className="h-5 w-5" />
                    Unfriend
                  </button>
                </form>
              </DropdownMenuItem>
            )}

            {isAuthorized && (
              <>
                <DropdownMenuSeparator />
                <DialogTrigger asChild className="w-full">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Edit className="h-5 w-5" /> Edit
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />
                <AlertDialogTrigger className="w-full">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <DeletePost postId={id} />
        </AlertDialogContent>
      </AlertDialog>

      <DialogContent>
        <UpdatePost post={post} />
      </DialogContent>
    </Dialog>
  );
};

export default PostMenu;
