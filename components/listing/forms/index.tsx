import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { formUpdateSchema } from "../schemas/validation";
import FeatureForm from "./features";
import { CheckCircle2 } from "lucide-react";
import GalleryForm from "./gallery";
import PricingForm from "./pricing";
import useFetcher from "@/lib/hooks/use-axios";
import { LoadingDots } from "@/components/shared/icons";
import Router from "next/router";
import { objectDiff } from "@/lib/utils";
import { useEffect, useState } from "react";
import BasicInfos from "./basic";
import { SaveIcon } from "@/components/shared/icons/save";
import { resetBoat } from "features/boat/boatSlice";
import CancellationForm from "./cancellation";
import { ShowToast } from "@/components/shared/CustomToast";

const BoatForm = ({
  cancelHn,
  isRental,
}: {
  cancelHn: (status: any) => void;
  isRental: boolean;
}) => {
  const boatInfo = useSelector((state: any) => state.boat.boatInfo);
  const editableBoat = useSelector((state: any) => state.boat.editableBoat);
  const { fetchWithAuth, data, loading, error, updateBoat } = useFetcher();
  const [changesMade, setChangesMade] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      ShowToast({
        title: "Operation Failed",
        message: "Error occured while saving the listing",
        status: "fail",
      });
    }

    if (!loading && !error && data) {
      ShowToast({
        title: "Operation Successful",
        message: "Listing has been successfully saved",
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
          boatType: boatInfo.boatType,
          description: boatInfo.description,
          manufacturer: boatInfo.manufacturer,
          model: boatInfo.model,
          year: boatInfo.year,
          length: boatInfo?.["length"],
          maxPassengers: boatInfo.maxPassengers,
          listingType: "rental",
          imageUrls: boatInfo.imageUrls[0],
          city: boatInfo.location.city,
          state: boatInfo.location.state,
          address: boatInfo.location.address,
          zipCode: boatInfo.location.zipCode,
          features: boatInfo.features,
          securityAllowance: boatInfo.securityAllowance,
          captained: boatInfo.captained,
          currency: boatInfo.currency,
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
          pricing: boatInfo.pricing,
          cancelationPolicy: boatInfo.cancelationPolicy,
          perHourPrice: boatInfo.perHourPrice,
          perDayPrice: boatInfo.perDayPrice,
          hours: boatInfo.hours,
          days: boatInfo.days,
          hourlyDiscount: boatInfo.hourlyDiscount,
          dailyDiscount: boatInfo.dailyDiscount,
          minHoursForDiscount: boatInfo.minHoursForDiscount,
          minDaysForDiscount: boatInfo.minDaysForDiscount,
        }}
        onSubmit={(values: any, { setSubmitting }: { setSubmitting: any }) => {
          const rentalValues = {
            boatName: boatInfo.boatName,
            securityAllowance: `${boatInfo.securityAllowance}`,
            description: boatInfo.description,
            address: boatInfo.location.address,
            location: {
              city: boatInfo.location.city,
              state: boatInfo.location.state,
              address: boatInfo.location.address,
              zipCode: boatInfo.location.zipCode,
            },
            maxPassengers: boatInfo.maxPassengers,
            imageUrls: boatInfo.imageUrls.filter((img: string) => img),
            latLng: boatInfo.latLng,
            listingType: "rental",
            boatType: boatInfo.boatType,
            year: boatInfo.year,
            length: boatInfo?.["length"],
            manufacturer: boatInfo.manufacturer,
            model: boatInfo.model,
            pricing: {
              perDay: boatInfo.perDayPrice,
              perHour: boatInfo.perHourPrice,
              dayDiscount: [
                {
                  discountPercentage: boatInfo.dailyDiscount,
                  minDaysForDiscount: boatInfo.minDaysForDiscount,
                },
              ],
              hourDiscount: [
                {
                  discountPercentage: boatInfo.hourlyDiscount,
                  minHoursForDiscount: boatInfo.minHoursForDiscount,
                },
              ],
              minDays: boatInfo.days,
              minHours: boatInfo.hours,
            },
            features: boatInfo.features,
            cancelationPolicy: boatInfo.cancelationPolicy,
            currency: boatInfo.currency,
          };

          if (!rentalValues.pricing.perDay) {
            delete (rentalValues.pricing as any).dayDiscount;
            delete (rentalValues.pricing as any).minDays;
            delete (rentalValues.pricing as any).perDay;
          }

          if (
            !rentalValues?.pricing?.dayDiscount?.[0]?.discountPercentage ||
            !rentalValues?.pricing?.dayDiscount?.[0]?.minDaysForDiscount
          ) {
            delete (rentalValues.pricing as any).dayDiscount;
          }

          if (
            !rentalValues?.pricing?.hourDiscount?.[0]?.discountPercentage ||
            !rentalValues?.pricing?.hourDiscount?.[0]?.minHoursForDiscount
          ) {
            delete (rentalValues.pricing as any).hourDiscount;
          }

          if (editableBoat) {
            let difference = objectDiff(editableBoat, boatInfo);

            if (Object.keys(difference).length === 0) {
              ShowToast({
                title: "No Changes Detected",
                message: "You haven't made any modifications to save.",
                status: "warning",
              });
            } else {
              updateBoat(`boat/${editableBoat._id}`, rentalValues);
            }
          } else {
            fetchWithAuth("/boat", rentalValues);
          }

          setSubmitting(false);
        }}
        validationSchema={formUpdateSchema}
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
                    {editableBoat ? "Update Your" : "Add New"} Listing
                  </h2>
                  {!editableBoat && (
                    <p className="text-gray-500">
                      Add a new listing to your listings
                    </p>
                  )}
                </div>
                <div className="relative hidden w-full flex-col gap-5 sm:w-fit sm:flex-row lg:flex">
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
                </div>
              </div>

              {/* <hr className="mt-6 h-px border-0 bg-gray-200 sm:mt-0" /> */}
              <div className="flex flex-col lg:w-full lg:flex-row lg:gap-4">
                <div className="w-full lg:w-[57.5%]">
                  <BasicInfos
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

                <div className="lg:w-[42.5%]">
                  <FeatureForm
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

                  <PricingForm
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

                  <CancellationForm
                    {...{
                      values,
                      errors,
                      setValues,
                      isRental,
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
