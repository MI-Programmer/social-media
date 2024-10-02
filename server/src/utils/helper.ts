import cloudinary from "../lib/cloudinary";

export interface CustomError extends Error {
  status?: number;
  data?: any;
}

export const error = new Error() as CustomError;

type CloudinaryUploadResult =
  | {
      secure_url: string;
    }
  | undefined;

export const uploadImage = (folder: string, buffer: Buffer) => {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      })
      .end(buffer);
  });
};

export const deleteImageCloudinary = async (
  imageUrl: string,
  folder: "posts" | "profile"
) => {
  let regexImg;
  if (folder === "posts") regexImg = /\/(social-media\/posts\/[^.]+)\./;
  else regexImg = /\/(social-media\/user-profile\/[^.]+)\./;
  const matchImg = imageUrl.match(regexImg);
  const publicId = matchImg ? matchImg[1] : "";

  await cloudinary.uploader.destroy(publicId);
};
