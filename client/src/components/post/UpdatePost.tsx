import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import FormRow from "@/components/common/FormRow";
import ButtonLoading from "@/components/common/ButtonLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updatePost } from "@/actions/post";
import { Post } from "@/types/post";

interface UpdatePostProps {
  post: Post;
}

const UpdatePost = ({ post }: UpdatePostProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [content, setContent] = useState<string>(post.content);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isDisabled =
    (content === post.content && !imagePreview) || content === "";

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    startTransition(async () => {
      const updatePostWithId = updatePost.bind(null, formData);
      const data = await updatePostWithId(post.id);

      if (data.status === "success") {
        toast.success(data.message);
        router.refresh();
      } else toast.error(data.message);
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Update a post</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleUpdatePost} className="grid gap-4 py-4">
        <FormRow label="Content">
          <Textarea
            placeholder="What's on your mind?"
            className="h-24"
            name="content"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            disabled={isPending}
          />
        </FormRow>

        <FormRow label="Image">
          <Input
            type="file"
            onChange={handleChangeImage}
            name="image"
            accept=".png, .jpg, .jpeg"
            disabled={isPending}
          />
        </FormRow>

        {imagePreview && (
          <div>
            <img
              src={imagePreview}
              alt="preview"
              className="mx-auto h-48 w-60 rounded-lg object-cover"
            />
          </div>
        )}

        {isPending ? (
          <ButtonLoading />
        ) : (
          <Button type="submit" disabled={isDisabled}>
            Save
          </Button>
        )}
      </form>
    </>
  );
};

export default UpdatePost;
