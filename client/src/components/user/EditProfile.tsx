"use client";

import { FormEvent, useTransition } from "react";
import { HiPencil } from "react-icons/hi";
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
import FormRow from "@/components/common/FormRow";
import ButtonLoading from "@/components/common/ButtonLoading";
import ProfileImage from "@/components/common/ProfileImage";
import { updateUser } from "@/actions/user";
import { User } from "@/types/user";

interface EditProfileProps {
  user: User;
}

const EditProfile = ({ user }: EditProfileProps) => {
  const [isPending, startTransition] = useTransition();
  const { email, firstName, lastName, imageUrl } = user;

  const handleUpdateUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    startTransition(async () => {
      const data = await updateUser(formData);
      if (data.status === "success") {
        (e.target as HTMLFormElement).reset();
        toast.success(data.message);
      } else toast.error(data.message);
    });
  };

  return (
    <div className="mt-2 flex justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="flex items-center gap-2">
            <HiPencil className="h-5 w-5" /> Edit profile
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdateUser} className="grid gap-4 py-4">
            <ProfileImage src={imageUrl || ""} size="lg" />

            <FormRow label="Profile image">
              <Input
                type="file"
                name="image"
                accept=".png, .jpg, .jpeg"
                disabled={isPending}
              />
            </FormRow>

            <FormRow label="Email">
              <Input value={email} disabled={true} />
            </FormRow>

            <FormRow label="Firstname">
              <Input
                name="firstName"
                defaultValue={firstName}
                disabled={isPending}
              />
            </FormRow>

            <FormRow label="Lastname">
              <Input
                name="lastName"
                defaultValue={lastName}
                disabled={isPending}
              />
            </FormRow>

            {isPending ? (
              <ButtonLoading />
            ) : (
              <Button type="submit">Save</Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
