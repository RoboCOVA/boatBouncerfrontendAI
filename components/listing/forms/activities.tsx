import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Router from "next/router";

import useFetcher from "@/lib/hooks/use-axios";
import { LoadingDots } from "@/components/shared/icons";
import { objectDiff } from "@/lib/utils";
import { SaveIcon } from "@/components/shared/icons/save";
import { resetBoat } from "features/boat/boatSlice";
import GalleryForm from "./gallery";
import CancellationForm from "./cancellation";
import BasicActivities from "./basicActivities";
import { activitySchema } from "../schemas/activitySchema";
import ActivitiesPricingForm from "./activitiesPricing";
import { ShowToast } from "@/components/shared/CustomToast";

const BoatForm = ({ cancelHn }: { cancelHn: (status: any) => void }) => {
  const boatInfo = useSelector((state: any) => state.boat.boatInfo);
  const editableBoat = useSelector((state: any) => state.boat.editableBoat);
  const { fetchWithAuth, data, loading, error, updateBoat } = useFetcher();
  const [changesMade, setChangesMade] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      ShowToast({
        title: "Operation Failed",
        message: "Error occured while saving activity",
        status: "fail",
      });
    }

    if (!loading && !error && data) {
      ShowToast({
        title: "Operation Successful",
        message: "Activity has been successfully saved",
        status: "success",
      });

      setTimeout(() => {
        Router.push({
          pathname: "/listings",
        });
        cancelHn(false);
        dispatch(resetBoat());
      }, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading, data]);

  return (
    <div>
      <Formik
        initialValues={{
          boatName: boatInfo.boatName,
          activityType: boatInfo.activityType,
          activityDuration: boatInfo.activityDuration,
          description: boatInfo.description,
          imageUrls: boatInfo.imageUrls[0],
          city: boatInfo.location.city,
          state: boatInfo.location.state,
          address: boatInfo.location.address,
          zipCode: boatInfo.location.zipCode,
          securityAllowance: boatInfo.securityAllowance,
          maxPassengers: boatInfo.maxPassengers,
          currency: boatInfo.currency,
          minPeople: boatInfo.minPeople,
          discount: boatInfo.discount,
          perPerson: boatInfo.perPerson,
          latLng: {
            latitude: boatInfo?.latLng?.coordinates
              ? boatInfo?.latLng?.coordinates[1]
              : editableBoat || boatInfo?.latLng?.latitude
              ? boatInfo.latLng.latitude
              : null,
            longitude: boatInfo.latLng?.coordinates
              ? boatInfo?.latLng?.coordinates[0]
              : editableBoat || boatInfo?.latLng.longitude
              ? boatInfo.latLng.longitude
              : null,
          },
          cancelationPolicy: boatInfo.cancelationPolicy,
        }}
        onSubmit={(values: any, { setSubmitting }: { setSubmitting: any }) => {
          let activitiesValues = {
            boatName: boatInfo.boatName,
            description: boatInfo.description,
            address: boatInfo.location.address,
            securityAllowance: boatInfo.securityAllowance,
            location: {
              city: boatInfo.location.city,
              state: boatInfo.location.state,
              address: boatInfo.location.address,
              zipCode: boatInfo.location.zipCode,
            },
            maxPassengers: boatInfo.maxPassengers,
            currency: boatInfo.currency,
            imageUrls: boatInfo.imageUrls.filter((img: string) => img),
            latLng: boatInfo.latLng,
            listingType: "activity",
            activityTypes: [
              {
                type: boatInfo.activityType,
                durationHours: Number(boatInfo.activityDuration),
              },
            ],
            cancelationPolicy: boatInfo.cancelationPolicy,
            pricing: {
              perPerson: boatInfo.perPerson,
              discountPercentage: [
                {
                  percentage:
                    Number(boatInfo.discount) && Number(boatInfo.minPeople)
                      ? Number(boatInfo.discount)
                      : "",
                  minPeople:
                    Number(boatInfo.discount) && Number(boatInfo.minPeople)
                      ? Number(boatInfo.minPeople)
                      : "",
                },
              ],
            },
          };

          if (editableBoat) {
            let difference = objectDiff(editableBoat, boatInfo);

            const oldDiscount = editableBoat.minPeople && editableBoat.discount;
            const newDiscount = boatInfo.minPeople && boatInfo.discount;

            if (
              Object.keys(difference).length === 0 &&
              oldDiscount === newDiscount
            ) {
              ShowToast({
                title: "no changes detected",
                message: "you haven't made any modifications to save.",
                status: "warning",
              });
            } else {
              if (!(Number(boatInfo.discount) && Number(boatInfo.minPeople))) {
                if (activitiesValues?.pricing?.discountPercentage) {
                  delete (activitiesValues.pricing as any).discountPercentage;
                }
              }
              updateBoat(`boat/${editableBoat._id}`, activitiesValues);
            }
          } else {
            if (!(Number(boatInfo.discount) && Number(boatInfo.minPeople))) {
              if (activitiesValues?.pricing?.discountPercentage) {
                delete (activitiesValues.pricing as any).discountPercentage;
              }
            }

            fetchWithAuth("/boat", activitiesValues);
          }

          setSubmitting(false);
        }}
        validationSchema={activitySchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setValues,
        }: {
          values: any;
          errors: any;
          touched: any;
          handleChange: any;
          handleBlur: any;
          handleSubmit: any;
          setValues: any;
        }) => {
          return (
            <form
              onSubmit={handleSubmit}
              className="sm:mx-10 md:mx-12 lg:mx-14 xl:mx-16 2xl:mx-20"
            >
              <div className="mb-4 flex flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center lg:mb-6">
                <div className="flex flex-col items-start gap-0">
                  <h2 className="text-3xl font-medium text-gray-900">
                    {editableBoat ? "Update Your" : "Add New"} Activity
                  </h2>
                  {!editableBoat && (
                    <p className="text-gray-500">
                      Add a new listing to your listings
                    </p>
                  )}
                </div>
                <div className="relative hidden w-full flex-col gap-5 sm:w-fit sm:flex-row lg:flex">
                  {changesMade && (
                    <p className="absolute -bottom-6 right-1/3 text-end text-base font-medium text-gray-700 sm:right-0">
                      No changes Made!
                    </p>
                  )}
                  <button
                    type="button"
                    className="rounded-lg border border-solid border-gray-200 px-9 py-2.5 text-center font-medium text-gray-700 shadow-sm drop-shadow-sm sm:w-fit"
                    onClick={() => cancelHn(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex flex-row items-center justify-center gap-2 rounded-lg bg-cyan-600 px-7 py-2.5 font-medium text-white shadow-sm drop-shadow-sm hover:bg-cyan-700 active:translate-y-[1.5px] sm:w-fit"
                  >
                    <SaveIcon />
                    {!loading ? (
                      !data ? (
                        <p className="font-inter">Save Activity</p>
                      ) : (
                        <p className="flex flex-row items-center gap-px">
                          Successfully Saved <CheckCircle2 />
                        </p>
                      )
                    ) : (
                      <p>
                        Saving <LoadingDots />
                      </p>
                    )}
                  </button>
                </div>
              </div>

              {/* <hr className="mt-6 h-px border-0 bg-gray-200 sm:mt-0" /> */}
              <div className="flex flex-col lg:w-full lg:flex-row lg:gap-4">
                <div className="w-full lg:w-[56.5%]">
                  <BasicActivities
                    {...{
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setValues,
                    }}
                  />
                </div>

                <div className="hidden border-[0.5px] border-dashed border-cyan-600 lg:block"></div>

                <div className="lg:w-[43.5%]">
                  <ActivitiesPricingForm
                    {...{
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setValues,
                    }}
                  />

                  <div className="h-5" />

                  <CancellationForm
                    {...{
                      values,
                      errors,
                      setValues,
                    }}
                  />
                </div>
              </div>

              <GalleryForm
                {...{
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setValues,
                }}
              />

              <div className="relative mt-6 flex w-full flex-col justify-center gap-3 px-4 md:flex-row lg:hidden">
                {changesMade && (
                  <p className="absolute -bottom-6 right-1/3 text-end text-base font-medium text-gray-700 sm:right-0">
                    No changes Made!
                  </p>
                )}
                <div className="flex w-full flex-col gap-5 md:w-full md:flex-row md:gap-7 lg:gap-10">
                  <button
                    type="button"
                    className="w-full rounded-lg border border-solid border-gray-200  py-3 text-center text-lg font-medium text-gray-700 shadow-sm drop-shadow-sm"
                    onClick={() => cancelHn(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-cyan-600 px-[14px] py-3 text-lg font-medium text-white shadow-sm drop-shadow-sm hover:bg-cyan-700 active:translate-y-[1.5px]"
                  >
                    <SaveIcon />
                    {!loading ? (
                      !data ? (
                        <p className="font-inter">Save Listing</p>
                      ) : (
                        <p className="flex flex-row items-center gap-px">
                          Successfully Saved <CheckCircle2 />
                        </p>
                      )
                    ) : (
                      <p>
                        Saving <LoadingDots />
                      </p>
                    )}
                  </button>
                  {error && (
                    <p className="absolute -bottom-6 right-1/3 text-end text-base text-orange-700 sm:right-3">
                      Error occured!
                    </p>
                  )}
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default BoatForm;
