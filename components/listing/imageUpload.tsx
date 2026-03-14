/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useEffect, useState } from "react";
import { UploadCloud, X, XSquare } from "lucide-react";
import useFetcher from "@/lib/hooks/use-axios";
import { useDispatch, useSelector } from "react-redux";
import { updateImageUrls } from "features/boat/boatSlice";
import SyncLoading from "../shared/syncLoading";
import { ShowToast } from "../shared/CustomToast";

const ImageUpload = ({
  handleChange,
  errors,
  touched,
  index,
  values,
  name,
  setValues,
}: {
  handleChange: any;
  errors: any;
  touched: any;
  name: string;
  values: any;
  index: number;
  setValues?: any;
}) => {
  const dispatch = useDispatch();
  const { fetchWithAuthSync } = useFetcher();

  const [isUploading, setIsUploading] = useState(false);

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

    if (uploadedFiles.length > 20) {
      ShowToast({
        title: "File limit exceeded",
        status: "fail",
        message: "You can only upload up to 20 photos at a time",
      });
      return;
    }

    const formData = new FormData();

    Array.from(uploadedFiles).forEach((file) => {
      formData.append("pictures", file);
    });

    setIsUploading(true);
    fetchWithAuthSync("/upload/public/BOAT", formData)
      .then((response: any) => {
        if (
          response.data?.uploadedFiles?.length &&
          response.data?.uploadedFiles?.length > 0
        ) {
          let imageUrls = response.data?.uploadedFiles?.map(
            (file: any) => file?.secureUrl,
          );

          dispatch(updateImageUrls({ key: index, imageUrl: imageUrls }));
        } else {
          ShowToast({
            status: "fail",
            title: "Upload Failed",
            message:
              "An error occurred while uploading the photos. Please try again.",
          });
        }
      })
      .catch(() => {
        ShowToast({
          status: "fail",
          title: "Upload Failed",
          message:
            "An error occurred while uploading the file. Please try again.",
        });
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <div className="grid h-full w-full grid-cols-1">
      <label htmlFor={name} className="h-full w-full">
        {!isUploading && (
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex w-fit items-center justify-center rounded-full bg-gray-50 p-[10px]">
                <UploadCloud className="h-10 w-10 rounded-full bg-gray-100 p-[10px]" />
              </div>
              <p className="cursor-pointer text-center text-sm font-medium text-cyan-600">
                Click to upload
              </p>
              <p className="text-center text-xs">SVG, PNG, JPG or GIF</p>
            </div>
          </div>
        )}
      </label>

      {isUploading && <SyncLoading />}

      <input
        id={name}
        multiple
        type="file"
        name={index === 0 ? "imageUrls" : name}
        accept="image/svg, image/png, image/jpg, image/jpeg, image/gif, image/heic, .heic"
        onClick={(e) => {
          (e.target as HTMLInputElement).value = "";
        }}
        onChange={(event) => {
          index === 0 ? handleChange(event) : null;
          handleFileChange(event);
        }}
        className="invisible hidden h-fit"
      />
    </div>
  );
};

export default ImageUpload;
