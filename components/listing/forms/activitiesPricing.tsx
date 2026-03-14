import { useDispatch } from "react-redux";
import { DollarSign, EuroIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import {
  updateBasicInfoField,
  updatePerPerson,
  updateSecurityAllowance,
} from "features/boat/boatSlice";
import { returnClass } from "@/components/shared/styles/input";

const ActivitiesPricingForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: {
  values: any;
  errors: any;
  touched: any;
  handleChange: any;
  handleBlur: any;
}) => {
  const dispatch = useDispatch();

  const updateBasicFields = useDebouncedCallback(
    (key: string, value: string) => {
      dispatch(updateBasicInfoField({ key, value }));
    },
    500,
  );

  return (
    <div className="m-2.5 mt-7 rounded border border-gray-200 px-5 py-5 shadow-custom1 sm:rounded-xl lg:mt-2.5">
      <p className="mb-5 text-xl font-semibold text-gray-900">Set Pricing</p>

      <div className="mb-4 flex w-full flex-col gap-6 xs:flex-row lg:flex-col xl:flex-row xl:gap-6">
        <div className="relative flex h-11 w-full flex-col gap-0 sm:mb-0">
          <input
            className={`${returnClass()[0]} text-xl`}
            placeholder=" "
            type="number"
            onBlur={handleBlur}
            name="perPerson"
            id="perPerson"
            value={values.perPerson}
            onChange={(event) => {
              handleChange(event);
              dispatch(updatePerPerson(event.target.value));
            }}
          />
          <label
            className={`${
              returnClass()[1]
            } left-0 peer-focus:left-0 peer-focus:mt-0`}
          >
            Price Per Person
          </label>
          {errors.perPerson && touched.perPerson && (
            <p className="mb-4 ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.perPerson as string}
            </p>
          )}
        </div>

        <div className="relative flex h-11 w-full flex-col gap-0 sm:mb-0">
          <div
            className={`text-blue-gray-500 absolute left-3 top-[50%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center opacity-40`}
          >
            {values.currency === "USD" ? (
              <DollarSign size={18} />
            ) : (
              <EuroIcon size={18} />
            )}
          </div>
          <input
            className={`${returnClass()[0]} pl-10 text-xl`}
            placeholder=" "
            type="number"
            onBlur={handleBlur}
            name="securityAllowance"
            value={values.securityAllowance ? values.securityAllowance : ""}
            onChange={(event) => {
              handleChange(event);
              dispatch(updateSecurityAllowance(event.target.value));
            }}
          />
          <label
            className={`${
              returnClass()[1]
            } left-0 right-0 mt-0.5 peer-placeholder-shown:left-6 peer-focus:left-0 peer-focus:mt-0`}
          >
            Deposit
          </label>

          {errors.securityAllowance && touched.securityAllowance && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.securityAllowance as string}
            </p>
          )}
        </div>
      </div>

      <div className="mb-5 mt-2.5 sm:mt-5">
        <div className="flex w-full  flex-col gap-6 xs:flex-row lg:flex-col xl:flex-row xl:gap-6">
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full">
              <input
                type="number"
                id="minPeople"
                name="minPeople"
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(event.target.name, event.target.value);
                }}
                value={values.minPeople ?? ""}
                className={`${returnClass()[0]} text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0`}
              >
                N<span className="mr-1 underline">o</span> of People For
                Discount
              </label>
              {errors.minPeople && touched.minPeople && (
                <>
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.minPeople as string}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full">
              <div
                className={`text-blue-gray-500 absolute left-3 top-[45%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center`}
              >
                <span className="text-gray-500">%</span>
              </div>
              <input
                id="discount"
                name="discount"
                className={`${returnClass()[0]} pl-10 text-xl`}
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(event.target.name, event.target.value);
                }}
                value={values.discount}
                type="number"
                min={1}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] mt-0.5 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0 after:rounded-none focus:rounded-s-none peer-placeholder-shown:left-6 peer-focus:left-0 peer-focus:mt-0
                    `}
              >
                Discount
              </label>

              {errors.discount && touched.discount && (
                <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                  {errors.discount as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPricingForm;
