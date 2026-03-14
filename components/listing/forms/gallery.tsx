/* eslint-disable @next/next/no-img-element */
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "../imageUpload";
import {
  deleteImageUrl,
  makeCoverPhoto,
  updateImageUrls,
} from "features/boat/boatSlice";
import { X } from "lucide-react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

const GalleryForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setValues,
}: {
  values: any;
  errors: any;
  touched: any;
  handleChange: any;
  handleBlur: any;
  setValues: any;
}) => {
  const dispatch = useDispatch();
  const boatInfo = useSelector((state: any) => state.boat.boatInfo);

  const removeImgHn = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(deleteImageUrl({ key: index }));

    if (index === 0 && setValues) {
      setValues({ ...values, imageUrls: "" });
    }
  };

  return (
    <div className="m-2.5 rounded border border-gray-200 px-5 pb-0 pt-5 shadow-custom1 sm:mt-7 sm:rounded-xl">
      <p className="mb-5 text-xl font-semibold text-gray-900">Gallery</p>

      <div className="mb-5 w-full">
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {boatInfo.imageUrls.map((url: string, index: number) => (
            <div
              key={url}
              className="relative h-full w-full overflow-hidden rounded-lg border p-[1px] shadow-custom1"
            >
              <img src={url} alt="" className="h-full rounded-lg bg-center" />

              <div className="absolute right-1.5 top-1.5">
                <button
                  type="button"
                  className="flex rounded bg-white active:translate-y-0.5"
                  onClick={() =>
                    setValues({
                      ...values,
                      [`optionsOpen${index}`]: !values[`optionsOpen${index}`],
                    })
                  }
                >
                  <p className="flex flex-row items-center rounded border-2 border-gray-300 py-0.5 text-sm text-gray-900">
                    <EllipsisVerticalIcon className="size-5" />
                  </p>
                </button>
                {values[`optionsOpen${index}`] && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg">
                    <ul className="py-1 text-sm text-gray-700">
                      {index !== 0 && (
                        <li>
                          <button
                            type="button"
                            onClick={(event) => {
                              removeImgHn(event, index);
                              setValues({
                                ...values,
                                [`optionsOpen${index}`]: false,
                              });
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Remove
                          </button>
                        </li>
                      )}
                      {index !== 0 && (
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(makeCoverPhoto({ key: index }));
                              setValues({
                                ...values,
                                [`optionsOpen${index}`]: false,
                              });
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Make Cover Photo
                          </button>
                        </li>
                      )}
                      {index === 0 && (
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(deleteImageUrl({ key: index }));
                              setValues({
                                ...values,
                                [`optionsOpen${index}`]: false,
                              });
                            }}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Remove Photo
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="relative flex min-h-[15rem] w-full items-center rounded-lg border px-1 py-0.5 shadow-sm drop-shadow-sm">
            <ImageUpload
              name="mainPic"
              index={0}
              {...{
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setValues,
              }}
            />
            {errors.imageUrls && touched.imageUrls && (
              <p className="absolute bottom-2.5 mx-auto -mt-2.5 w-full text-center font-serif text-sm text-orange-700">
                {errors.imageUrls as string}
              </p>
            )}
          </div>
        </div>
        {/* <div className="mt-3 flex w-full flex-col gap-3 lg:flex-row ">
          <div className="flex w-full flex-col gap-3 lg:w-2/3 lg:flex-row">
            <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
              {boatInfo.imageUrls.length >= 3 && (
                <div className="min-h-[12rem] w-full rounded-lg border px-1 py-0.5 shadow-sm drop-shadow-sm lg:min-h-[15rem]">
                  <ImageUpload
                    name="subPic3"
                    index={3}
                    {...{
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                    }}
                  />
                </div>
              )}
              {boatInfo.imageUrls.length >= 4 && (
                <div className="min-h-[12rem] w-full rounded-lg border px-1 py-0.5 shadow-sm drop-shadow-sm lg:min-h-[7rem] xl:min-h-[10rem]">
                  <ImageUpload
                    name="subPic4"
                    index={4}
                    {...{
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {boatInfo.imageUrls.length >= 5 && (
            <div className="flex min-h-[12rem] w-full items-center rounded-lg border px-1 py-0.5 shadow-sm drop-shadow-sm lg:min-h-[7rem] lg:w-1/3 xl:min-h-[10rem]">
              <ImageUpload
                name="subPic5"
                index={5}
                {...{
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                }}
              />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default GalleryForm;
