"use client";

import {
  BaseSyntheticEvent,
  ChangeEvent,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormRow from "@/components/common/FormRow";
import ButtonLoading from "@/components/common/ButtonLoading";
import { createPost } from "@/actions/post";

interface DataForm {
  content: string;
  image: File;
}

const CreatePost = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<DataForm>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const onSubmit = (_: DataForm, event?: BaseSyntheticEvent) => {
    const formData = new FormData(event?.target);

    startTransition(async () => {
      const data = await createPost(formData);

      if (data.status === "success") {
        toast.success(data.message);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    });
  };

  const resetForm = () => {
    setImagePreview(null);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-full text-gray-600"
            onClick={resetForm}
          >
            What&apos;s on your mind?
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormRow label="Content" error={errors.content?.message}>
            <Textarea
              placeholder="What's on your mind?"
              className="h-24 resize-none"
              {...register("content", {
                required: "Content field is required.",
              })}
            />
          </FormRow>

          <FormRow label="Image" error={errors.image?.message}>
            <Input
              type="file"
              {...register("image", { required: "Image field is required." })}
              onChange={handleChangeImage}
              accept="image/*"
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
            <Button type="submit">Create</Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
