import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { returnClass } from "@/components/shared/styles/input";
import useFetcher from "@/lib/hooks/use-axios";
import {
  updateBasicInfoField,
  updateLocationField,
} from "features/boat/boatSlice";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

const AddressAutoFill = dynamic(async () => await import("./searchAutofill"), {
  suspense: true,
  ssr: false,
});

const BasicInfo = ({
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
  const currentDate = new Date();
  const year = currentDate.getFullYear();
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
    fetchCategories("/boat/types");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-2.5 rounded border border-gray-200 px-6 pb-0 pt-5 shadow-custom1 sm:mt-2.5 sm:rounded-xl">
      <p className="mb-5 text-xl font-semibold text-gray-900">
        Basic Information
      </p>
      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-11 w-full">
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

        <FormControl fullWidth className="relative h-11">
          <InputLabel
            className="!important !-top-[5px] w-[6.3rem] bg-white"
            sx={{
              "&.Mui-focused": {
                color: "#0891b2", // your focus color
              },
            }}
          >
            Boat Type
          </InputLabel>
          <Select
            id="boatType"
            name="boatType"
            value={values.boatType}
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
            {data?.boatTypeEnum?.map((type: string) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>

          {errors.boatType && touched.boatType && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.boatType as string}
            </p>
          )}
        </FormControl>
      </div>

      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-11 w-full">
          <input
            className={returnClass(!!(errors.model && touched.model))[0]}
            placeholder=" "
            type="text"
            onBlur={handleBlur}
            name="model"
            value={values.model}
            onChange={(event) => {
              handleChange(event);
              updateBasicFields(event.target.name, event.target.value);
            }}
          />
          <label className={returnClass(!!(errors.model && touched.model))[1]}>
            Model
          </label>
          {errors.model && touched.model && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.model as string}
            </p>
          )}
        </div>
        <div className="relative h-11 w-full">
          <input
            className={
              returnClass(!!(errors.manufacturer && touched.manufacturer))[0]
            }
            placeholder=" "
            onBlur={handleBlur}
            type="text"
            name="manufacturer"
            value={values.manufacturer}
            onChange={(event) => {
              handleChange(event);
              updateBasicFields(event.target.name, event.target.value);
            }}
          />
          <label
            className={
              returnClass(!!(errors.manufacturer && touched.manufacturer))[1]
            }
          >
            Manufacturer
          </label>
          {errors.manufacturer && touched.manufacturer && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.manufacturer as string}
            </p>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-11 w-full">
          <input
            className={returnClass(!!(errors.length && touched.length))[0]}
            placeholder=" "
            type="number"
            onBlur={handleBlur}
            name="length"
            value={values.length}
            onChange={(event) => {
              handleChange(event);
              updateBasicFields(event.target.name, event.target.value);
            }}
          />
          <label
            className={returnClass(!!(errors.length && touched.length))[1]}
          >
            Length (ft.)
          </label>
          {errors.length && touched.length && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.length as string}
            </p>
          )}
        </div>
        <div className="relative h-11 w-full">
          <input
            className={`${returnClass()[0]} text-xl`}
            placeholder=" "
            type="number"
            onBlur={handleBlur}
            id="maxPassengers"
            name="maxPassengers"
            value={values.maxPassengers ? values.maxPassengers : ""}
            onChange={(event) => {
              handleChange(event);
              updateBasicFields(event.target.name, event.target.value);
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
        <div className="relative h-11 w-full">
          <FormControl fullWidth>
            <InputLabel
              className="!important !-top-[5px] w-[2.25rem] bg-white"
              sx={{
                "&.Mui-focused": {
                  color: "#0891b2", // your focus color
                },
              }}
            >
              Year
            </InputLabel>
            <Select
              id="year"
              name="year"
              value={values.year}
              onChange={(event) => {
                handleChange(event);
                updateBasicFields(event.target.name, event.target.value);
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 225, // Limit the height of the dropdown
                  },
                },
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
              {Array.from({ length: 151 }, (_, i) => year - i).map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.year && touched.year && (
            <p className="ml-1 text-xs text-orange-700 sm:text-sm">
              {errors.year as string}
            </p>
          )}
        </div>
      </div>

      <hr className="mb-8 mt-8 h-px border-0 bg-gray-200" />

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

      <div className="mb-6 flex flex-col gap-0 sm:flex-row">
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

        <div className="invisible relative size-0">
          <input
            className={`${returnClass(!!(errors.year && touched.year))[0]}`}
            placeholder="postal-code"
            onBlur={handleBlur}
            disabled
            name="zipCode"
            type="text"
            readOnly
            value={values.zipCode}
            autoComplete="postal-code"
            // onChange={(event) => {
            //   handleChange(event);
            //   updateLocationFields(event.target.name, event.target.value);
            // }}
          />
          <label className={returnClass()[1]}>Zip Code</label>
        </div>
      </div>

      <div className="invisible mb-6 flex size-0 flex-col gap-0 sm:flex-row">
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

export default BasicInfo;
