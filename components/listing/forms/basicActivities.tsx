import { returnClass } from "@/components/shared/styles/input";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import {
  updateBasicInfoField,
  updateLocationField,
} from "features/boat/boatSlice";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import useFetcher from "@/lib/hooks/use-axios";
import { useEffect } from "react";
import CustomActivitySelector from "./customActivities";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddressAutoFill = dynamic(async () => await import("./searchAutofill"), {
  suspense: true,
  ssr: false,
});

const BasicActivities = ({
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

  const { fetchCategories, data } = useFetcher();

  const updateBasicFields = useDebouncedCallback(
    (key: string, value: string) => {
      dispatch(updateBasicInfoField({ key, value }));
    },
    500,
  );

  const updateLocationFields = (key: string, value: string) => {
    dispatch(updateLocationField({ key, value }));
  };

  useEffect(() => {
    fetchCategories("/boat/activities");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-2.5 rounded border border-gray-200 px-6 pb-0 pt-5 shadow-custom1 sm:mt-2.5 sm:rounded-xl">
      <p className="mb-5 text-xl font-semibold text-gray-900">
        Basic Information
      </p>
      <div className="mb-2.5 flex flex-col gap-6 sm:mb-6 md:flex-row lg:flex-col xl:flex-row">
        <div className="relative mb-4 h-11 w-full sm:mb-0">
          <input
            className={returnClass(!!(errors.boatName && touched.boatName))[0]}
            placeholder=" "
            onBlur={handleBlur}
            name="boatName"
            type="text"
            value={values.boatName}
            onChange={(event) => {
              handleChange(event);
              updateBasicFields(event.target.name, event.target.value);
            }}
          />
          <label
            className={returnClass(!!(errors.boatName && touched.boatName))[1]}
          >
            Title
          </label>
          {errors.boatName && touched.boatName && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.boatName as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 sm:my-8 sm:flex-row">
        <FormControl fullWidth className="relative h-11">
          <InputLabel
            className="!important !-top-[5px] w-[6.3rem] bg-white"
            sx={{
              "&.Mui-focused": {
                color: "#0891b2", // your focus color
              },
            }}
          >
            <span className="text-[0.9375rem] !text-gray-400">
              Activity Type
            </span>
          </InputLabel>
          <Select
            id="activityType"
            name="activityType"
            value={values.activityType}
            label="Boat Type"
            onChange={(event) => {
              handleChange(event);
              updateBasicFields(event.target.name, event.target.value);
            }}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #d1d5db",
              },
              width: "100%",
              border: "none",
              height: "2.75rem",
              padding: 0,
              backgroundColor: "white",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #d1d5db",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "2px solid #0891b2",
              },
            }}
          >
            {(data?.boatActivityTypeEnum || [])?.map((type: string) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>

          {errors.activityType && touched.activityType && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.activityType as string}
            </p>
          )}
        </FormControl>

        <div className="relative h-11 w-full">
          <div
            className={`text-blue-gray-500 absolute left-3 top-[40%] z-10 grid h-5 w-5 -translate-y-2/4 place-items-center`}
          >
            <span className="text-gray-500">hrs</span>
          </div>
          <input
            className={`${
              returnClass(
                !!(errors.activityDuration && touched.activityDuration),
              )[0]
            } pl-11`}
            placeholder=" "
            onBlur={handleBlur}
            name="activityDuration"
            type="number"
            value={values.activityDuration}
            onChange={(event) => {
              if (!event.target.value || Number(event.target.value) >= 0) {
                handleChange(event);
                updateBasicFields(event.target.name, event.target.value);
              }
            }}
          />
          <label
            className={`${
              returnClass(
                !!(errors.activityDuration && touched.activityDuration),
              )[1]
            } 
            after:rounded-none focus:rounded-s-none peer-placeholder-shown:left-8 peer-focus:left-0 peer-focus:mt-0`}
          >
            Activity Duration
          </label>
          {errors.activityDuration && touched.activityDuration && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.activityDuration as string}
            </p>
          )}
        </div>
      </div>

      <div className="my-6 flex flex-col gap-6 md:flex-row lg:flex-col xl:flex-row">
        <div className="relative mb-5 flex h-11 w-full flex-col gap-0 overflow-visible sm:mb-0">
          <input
            className={`${returnClass()[0]} text-xl`}
            placeholder=" "
            type="number"
            onBlur={handleBlur}
            name="maxPassengers"
            value={values.maxPassengers ? values.maxPassengers : ""}
            onChange={(event) => {
              handleChange(event);
              updateBasicFields("maxPassengers", event.target.value);
            }}
          />
          <label
            className={`${
              returnClass()[1]
            } left-0 peer-focus:left-0 peer-focus:mt-0`}
          >
            Maximum Passengers
          </label>

          {errors.maxPassengers && touched.maxPassengers && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.maxPassengers as string}
            </p>
          )}
        </div>
      </div>

      {errors.maxPassengers && touched.maxPassengers && (
        <div className="sm:h-4" />
      )}

      <div className="relative mb-6 w-full">
        <textarea
          className={`${
            returnClass(!!(errors.year && touched.year))[0]
          } description-text px-[14px] py-[10px]`}
          placeholder=" "
          onBlur={handleBlur}
          name="description"
          value={values.description}
          onChange={(event) => {
            handleChange(event);
            updateBasicFields(event.target.name, event.target.value);
          }}
          rows={5}
        />
        <label className={returnClass(!!(errors.year && touched.year))[1]}>
          Add description
        </label>
        {errors.description && touched.description && (
          <p className="ml-1 text-xs text-orange-700 sm:text-sm">
            {errors.description as string}
          </p>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-6 md:flex-row lg:flex-col xl:flex-row">
        <AddressAutoFill
          name="address"
          placeholder=" "
          onBlur={handleBlur}
          onChange={handleChange}
          onUpdate={updateLocationFields}
          values={values}
          value={values.address}
          setValues={setValues}
          errors={errors}
          touched={touched}
        />

        <div className="invisible relative size-0 h-11 w-full">
          <input
            className={returnClass(!!(errors.year && touched.year))[0]}
            placeholder="postal-code"
            onBlur={handleBlur}
            disabled
            name="zipCode"
            type="text"
            readOnly
            value={values.zipCode}
            autoComplete="postal-code"
          />
          <label className={returnClass()[1]}>Zip Code</label>
        </div>
      </div>

      <div className="invisible mb-6 flex size-0 flex-col gap-6 md:flex-row lg:flex-col xl:flex-row">
        <div className="relative h-11 w-full">
          <input
            className={returnClass()[0]}
            placeholder="city"
            onBlur={handleBlur}
            name="city"
            type="text"
            disabled
            readOnly
            autoComplete="address-level2"
            value={values.city}
            // onChange={(event) => {
            //   handleChange(event);
            //   updateLocationFields(event.target.name, event.target.value);
            // }}
          />
          <label className={returnClass()[1]}>City</label>
        </div>
        <div className="relative h-11 w-full">
          <input
            className={returnClass()[0]}
            placeholder="state"
            onBlur={handleBlur}
            autoComplete="address-level1"
            name="state"
            type="text"
            disabled
            readOnly
            value={values.state}
            // onChange={(event) => {
            //   handleChange(event);
            //   updateLocationFields(event.target.name, event.target.value);
            // }}
          />
          <label className={returnClass()[1]}>State</label>
        </div>
      </div>
    </div>
  );
};

export default BasicActivities;
