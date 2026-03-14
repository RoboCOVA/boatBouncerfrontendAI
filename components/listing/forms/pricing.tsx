import { updateBasicInfoField } from "features/boat/boatSlice";
import { useDispatch } from "react-redux";
import { returnClass } from "@/components/shared/styles/input";
import { DollarSign, EuroIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

const PricingForm = ({
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

  const updateBasicFields = useDebouncedCallback(
    (key: string, value: number) => {
      dispatch(updateBasicInfoField({ key, value }));
    },
    500,
  );

  return (
    <div className="m-2.5 mt-0 rounded border border-gray-200 px-5 pb-7 pt-5 shadow-custom1 sm:mb-7 sm:mt-2.5 sm:rounded-xl">
      <p className="mb-5 text-xl font-semibold text-gray-900">Set Pricing</p>

      <div className="mb-5 mt-2.5 space-y-5 rounded-lg border border-gray-200 px-2.5 py-[1.15rem] shadow-sm sm:mt-5">
        <div className="flex w-full flex-col items-end gap-4 sm:gap-6 md:flex-row lg:flex-col 2xl:flex-row">
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full min-w-36">
              <div
                className={`text-blue-gray-500 absolute left-3 top-[46%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center opacity-40`}
              >
                {values.currency === "USD" ? (
                  <DollarSign size={18} />
                ) : (
                  <EuroIcon size={18} />
                )}
              </div>
              <input
                type="number"
                id="perHourPrice"
                name="perHourPrice"
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.perHourPrice ?? ""}
                className={`${returnClass()[0]} pl-10 text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0 peer-placeholder-shown:left-6 peer-focus:left-0 peer-focus:mt-0`}
              >
                Price Per Hour
              </label>
              {errors.perHourPrice && touched.perHourPrice && (
                <>
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.perHourPrice as string}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full min-w-36">
              <input
                type="number"
                id="hours"
                name="hours"
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.hours ?? ""}
                className={`${returnClass()[0]} text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0 peer-focus:left-0 peer-focus:mt-0`}
              >
                Minimum Hours
              </label>
              {errors.hours && touched.hours && (
                <>
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.hours as string}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-end gap-4 sm:gap-6 md:flex-row lg:flex-col 2xl:flex-row">
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full min-w-48">
              <input
                type="number"
                id="minHoursForDiscount"
                name="minHoursForDiscount"
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.minHoursForDiscount || ""}
                className={`${returnClass()[0]} text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0`}
              >
                N<span className="mr-1 underline">o</span> of Hours For Discount
              </label>
              {errors.minHoursForDiscount && touched.minHoursForDiscount && (
                <>
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.minHoursForDiscount as string}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full">
              <div
                className={`text-blue-gray-500 absolute left-3 top-[42.5%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center`}
              >
                <span className="text-gray-500">%</span>
              </div>
              <input
                id="hourlyDiscount"
                name="hourlyDiscount"
                className={`${returnClass()[0]} pl-8 text-xl`}
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.hourlyDiscount || ""}
                type="number"
                min={1}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0 after:rounded-none focus:rounded-s-none peer-placeholder-shown:left-5 peer-focus:left-0 peer-focus:mt-0
            `}
              >
                Discount
              </label>

              {errors.hourlyDiscount && touched.hourlyDiscount && (
                <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                  {errors.hourlyDiscount as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 mt-2.5 space-y-5 rounded-lg border border-gray-200 px-2.5 py-[1.15rem] shadow-sm sm:mt-5">
        <div className="flex w-full flex-col items-end gap-4 sm:gap-6 md:flex-row lg:flex-col 2xl:flex-row">
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full min-w-36">
              <div
                className={`text-blue-gray-500 absolute left-3 top-[46%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center opacity-40`}
              >
                {values.currency === "USD" ? (
                  <DollarSign size={18} />
                ) : (
                  <EuroIcon size={18} />
                )}
              </div>
              <input
                type="number"
                id="perDayPrice"
                name="perDayPrice"
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.perDayPrice}
                className={`${returnClass()[0]} pl-10 text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0 peer-placeholder-shown:left-6 peer-focus:left-0 peer-focus:mt-0`}
              >
                Price Per Day
              </label>
              {errors.perDayPrice && touched.perDayPrice && (
                <>
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.perDayPrice as string}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full min-w-36">
              <input
                type="number"
                id="days"
                name="days"
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.days}
                className={`${returnClass()[0]} text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0 peer-focus:left-0 peer-focus:mt-0`}
              >
                Minimum Days
              </label>
              {errors.days && touched.days && (
                <>
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.days as string}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-end gap-4 sm:gap-6 md:flex-row lg:flex-col 2xl:flex-row">
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full  min-w-48">
              <input
                type="number"
                id="minDaysForDiscount"
                name="minDaysForDiscount"
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.minDaysForDiscount}
                className={`${returnClass()[0]} text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0`}
              >
                N<span className="mr-1 underline">o</span> of Days For Discount
              </label>
              {errors.minDaysForDiscount && touched.minDaysForDiscount && (
                <>
                  <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                    {errors.minDaysForDiscount as string}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full">
              <div
                className={`text-blue-gray-500 absolute left-3 top-[42.5%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center`}
              >
                <span className="text-gray-500">%</span>
              </div>
              <input
                id="dailyDiscount"
                name="dailyDiscount"
                className={`${returnClass()[0]} pl-8 text-xl`}
                onChange={(event) => {
                  handleChange(event);
                  updateBasicFields(
                    event.target.name,
                    Number(event.target.value),
                  );
                }}
                value={values.dailyDiscount}
                type="number"
                min={1}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0 after:rounded-none focus:rounded-s-none peer-placeholder-shown:left-5 peer-focus:left-0 peer-focus:mt-0
            `}
              >
                Discount
              </label>

              {errors.dailyDiscount && touched.dailyDiscount && (
                <p className="ml-1 text-xs text-orange-700 sm:text-sm">
                  {errors.dailyDiscount as string}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* security allowance */}
      <div className="mt-4 flex w-full flex-col gap-6 xs:flex-row lg:flex-col xl:flex-row xl:gap-6">
        <div className="relative h-11 w-full">
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
            id="securityAllowance"
            name="securityAllowance"
            value={values.securityAllowance}
            onChange={(event) => {
              handleChange(event);
              updateBasicFields(event.target.name, Number(event.target.value));
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
    </div>
  );
};

export default PricingForm;
