/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CircularProgress } from "@mui/material";
import { UploadCloud } from "lucide-react";
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
  const [file, setFile] = useState<string | null>(null);
  
  // FIX: Cast to 'any' so TypeScript allows session._id
  const { data: session, update: sessionUpdate } = useSession() as any;

  const { fetchWithAuthSync, updateUser } = useFetcher();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let uploadedFiles = event.target.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
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
        if (response.data?.uploadedFiles?.length > 0) {
          const imageUrl = response.data.uploadedFiles.map(
            (file: any) => file?.secureUrl
          );
          setFile(imageUrl[0]);
        } else {
          setFile(null);
          ShowToast({
            status: "fail",
            title: "Upload Failed",
            message: "An error occurred while uploading. Please try again.",
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
    // Session._id will now be accepted by the compiler
    updateUser(`user/updateProfilePicture/${session?._id}`, {
      profilePicture: file,
    }).then(() => {
      sessionUpdate({
        profilePicture: file,
      });
      setOpen(false);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-overlayShow"
        />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-[60] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-xl focus:outline-none animate-contentShow"
        >
          <Dialog.Title className="m-0 text-[17px] font-bold text-gray-900">
            Add a profile photo
          </Dialog.Title>
          
          <div className="mt-4 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-200 rounded-lg">
            <label htmlFor="profileUpload" className="cursor-pointer h-full w-full flex items-center justify-center">
              {loading ? (
                <CircularProgress color="inherit" />
              ) : file ? (
                <img
                  className="h-40 w-40 rounded-full object-cover border"
                  src={file}
                  alt="Preview"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="h-10 w-10 text-gray-400" />
                  <p className="text-sm font-medium text-cyan-600">Upload Your Photo</p>
                </div>
              )}
            </label>
          </div>

          <input
            type="file"
            name="profileUpload"
            id="profileUpload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-[25px] flex justify-end gap-3">
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
              >
                Remove
              </button>
            )}
            <button
              onClick={handleUploadPicture}
              disabled={!file || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
