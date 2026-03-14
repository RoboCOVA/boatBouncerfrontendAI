/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CircularProgress } from "@mui/material";
import { UploadCloud, X } from "lucide-react";
import useFetcher from "@/lib/hooks/use-axios";
import { useSession } from "next-auth/react";
import { ShowToast } from "@/components/shared/CustomToast";

const ProfileUploadDialog = ({
  children,
  setOpen,
  open,
}: {
  children: ReactNode;
  setOpen: (val: boolean) => void;
  open: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { data: session, update: sessionUpdate } = useSession();

  const { fetchWithAuthSync, updateUser } = useFetcher();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let uploadedFiles = event.target.files;

    if (!uploadedFiles) {
      ShowToast({
        status: "fail",
        title: "No file selected",
        message: "Please choose a file to upload.",
      });
      return;
    }

    const formData = new FormData();

    formData.append("pictures", uploadedFiles[0]);

    setLoading(true);
    setFile(null);

    fetchWithAuthSync("/upload/public/BOAT", formData)
      .then((response: any) => {
        setLoading(false);
        if (
          response.data?.uploadedFiles?.length &&
          response.data?.uploadedFiles?.length > 0
        ) {
          let imageUrl = response.data?.uploadedFiles?.map(
            (file: any) => file?.secureUrl,
          );

          setFile(imageUrl[0]);
        } else {
          setFile(null);
          ShowToast({
            status: "fail",
            title: "Upload Failed",
            message:
              "An error occurred while uploading the profile picture. Please try again.",
          });
        }
      })
      .catch(() => {
        ShowToast({
          title: "Error uploading image",
          message: "Failed to upload image, please try again",
          status: "fail",
        });

        setLoading(false);
        setFile(null);
      });
  };

  const handleUploadPicture = () => {
    updateUser(`user/updateProfilePicture/${session?._id}`, { // FIX FE-05: session stores _id not id
      profilePicture: file,
    }).then(() => {
      sessionUpdate({
        profilePicture: file,
      });
      setOpen(false);
    });
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={() => setOpen(false)}
          className={`fixed inset-0 bg-blackA6 backdrop-brightness-50 data-[state=open]:animate-overlayShow`}
        />
        <Dialog.Content
          className={`fixed left-[50%] top-[50%] z-10 w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow`}
        >
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Add a profile photo
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-mauve11"></Dialog.Description>
          <label htmlFor="profileUpload" className="h-full w-full">
            {loading && (
              <div className="flex h-full w-full items-center justify-center text-cyan-600">
                <CircularProgress color="inherit" size="5vh" />
              </div>
            )}
            {!loading && !file && (
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex w-fit items-center justify-center rounded-full bg-gray-50 p-[10px]">
                    <UploadCloud className="h-10 w-10 rounded-full bg-gray-100 p-[10px]" />
                  </div>
                  <p className="cursor-pointer text-center text-sm font-medium text-cyan-600">
                    Upload Your Photo ...
                  </p>
                </div>
              </div>
            )}

            {!loading && !!file && (
              <div className="relative h-full w-full">
                <img
                  className="h-full w-full rounded object-cover"
                  src={file}
                  alt=""
                />
              </div>
            )}
          </label>
          <input
            type="file"
            name="profileUpload"
            id="profileUpload"
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
            accept="image/svg, image/png, image/jpg, image/jpeg, image/gif"
            onChange={(event) => handleFileChange(event)}
            className="invisible hidden h-fit"
          />
          <div className="mt-[25px] flex justify-end gap-5">
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-green4 px-[15px] font-medium leading-none text-red-700 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 focus:outline-none"
              >
                Remove
              </button>
            )}

            <button
              onClick={handleUploadPicture}
              className="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-green4 px-[25px] font-medium leading-none text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 focus:outline-none"
            >
              Save
            </button>
          </div>
          <Dialog.Close asChild onClick={() => setOpen(false)}>
            <button
              className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProfileUploadDialog;
