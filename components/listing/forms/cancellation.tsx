import { updateCancellationPolicy } from "features/boat/boatSlice";
import { useDispatch, useSelector } from "react-redux";
import { returnClass } from "@/components/shared/styles/input";
import { useState } from "react";
import { cloneDeep } from "lodash";

const CancellationForm = ({
  values,
  errors,
  setValues,
  isRental,
  touched,
}: {
  values: any;
  errors: any;
  setValues: any;
  isRental?: boolean;
  touched?: string;
}) => {
  const dispatch = useDispatch();

  const [cancellationPolicy, setCancellationPolicy] = useState(
    values.cancelationPolicy === 0 ? [] : values.cancelationPolicy,
  );

  const refundChangeHn = (val: string) => {
    const value = parseInt(val);
    let tempCancellation = cancellationPolicy[0];
    if (tempCancellation) {
      tempCancellation = cloneDeep(tempCancellation);
    }

    if (!val) {
      tempCancellation["refund"] = "";
    }

    if (!tempCancellation) tempCancellation = {};

    if (value <= 0) {
      tempCancellation["refund"] = 0;
    }

    if (value >= 100) {
      tempCancellation["refund"] = 100;
    }

    if (value > 0 && value < 100) {
      tempCancellation["refund"] = value;
    }

    let tempCancellationPolicy = [...cancellationPolicy];
    tempCancellationPolicy[0] = tempCancellation;

    setCancellationPolicy(tempCancellationPolicy);

    dispatch(
      updateCancellationPolicy({ cancellationPolicy: tempCancellationPolicy }),
    );
    setValues({ ...values, cancelationPolicy: tempCancellationPolicy });
  };

  const priorHoursChangeHn = (val: string) => {
    const value = parseInt(val);
    let tempCancellation = cancellationPolicy[0];

    if (tempCancellation) {
      tempCancellation = cloneDeep(tempCancellation);
    }

    if (!value || value <= 0) {
      tempCancellation["priorHours"] = "";
    }

    if (value >= 48) {
      tempCancellation["priorHours"] = 48;
    }

    if (value > 0 && value < 48) {
      tempCancellation["priorHours"] = value;
    }

    let tempCancellationPolicy = [...cancellationPolicy];
    tempCancellationPolicy[0] = tempCancellation;

    setCancellationPolicy(tempCancellationPolicy);

    dispatch(
      updateCancellationPolicy({ cancellationPolicy: tempCancellationPolicy }),
    );
    setValues({ ...values, cancelationPolicy: tempCancellationPolicy });
  };

  return (
    <div className="m-2.5 mt-0 rounded border border-gray-200 px-5 pt-5 shadow-custom1 sm:mt-2.5 sm:rounded-xl">
      <p className="mb-4 text-xl font-semibold text-gray-900">
        Cancellation Policy
      </p>

      <div className={`mb-8`}>
        <div className="flex w-full flex-col items-end gap-6 2xl:flex-row 2xl:gap-6">
          <div className="flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full">
              <div
                className={`text-blue-gray-500 absolute left-3 top-[42.5%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center`}
              >
                <span className="text-gray-500">%</span>
              </div>
              <input
                type="number"
                onChange={(event) => {
                  refundChangeHn(event.target.value);
                }}
                min={0}
                max={100}
                value={cancellationPolicy?.[0]?.refund ?? ""}
                className={`${returnClass()[0]} pl-10 text-xl`}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0
                after:rounded-none focus:rounded-s-none peer-placeholder-shown:left-6 peer-focus:left-0 peer-focus:mt-0
                `}
              >
                Refund
              </label>
              {Object.keys(errors).length === 1 && errors.cancelationPolicy && (
                <p className="ml-1 flex flex-row justify-between text-xs text-orange-700 sm:text-sm">
                  <span>{errors.cancelationPolicy?.[0]?.refund}</span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-2.5 flex w-full flex-col 2xl:w-1/2">
            <div className="relative h-11 w-full">
              <div
                className={`text-blue-gray-500 absolute left-3 top-[42.5%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center`}
              >
                <span className="text-gray-500">hrs</span>
              </div>
              <input
                className={`${returnClass()[0]} pl-11 text-xl`}
                onChange={(event) => {
                  priorHoursChangeHn(event.target.value);
                }}
                value={cancellationPolicy?.[0]?.priorHours ?? ""}
                type="number"
                min={1}
                max={48}
                placeholder=" "
              />
              <label
                className={`${
                  returnClass()[1]
                } before:content[''] after:content[''] left-0 right-0 before:ml-0 before:mr-0 before:rounded-none after:ml-0 after:mr-0
                after:rounded-none focus:rounded-s-none peer-placeholder-shown:left-8 peer-focus:left-0 peer-focus:mt-0
                `}
              >
                <span className="mt-[1.5px]">
                  Prior to {isRental ? "Rental" : "Activity"}
                </span>
              </label>
              {Object.keys(errors).length === 1 && errors.cancelationPolicy && (
                <p className="ml-1 flex flex-row justify-between text-xs text-orange-700 sm:text-sm">
                  <span>{errors.cancelationPolicy?.[0]?.priorHours}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationForm;
