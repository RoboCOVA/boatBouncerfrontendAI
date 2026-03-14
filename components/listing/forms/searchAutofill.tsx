import { useEffect, useRef, useState } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";
import { AddressAutofillRetrieveResponse } from "@mapbox/search-js-core";

import { returnClass } from "@/components/shared/styles/input";
import { icons } from "@/components/shared/locationIcon";
import { updateCoordinateField } from "features/boat/boatSlice";
import { useDispatch } from "react-redux";

const SearchAutofill = ({
  page,
  name,
  placeholder,
  onBlur,
  onChange,
  onUpdate,
  value,
  values,
  setValues,
  errors,
  touched,
}: {
  page?: string;
  name?: string;
  placeholder?: string;
  onBlur?: any;
  onChange?: any;
  onUpdate?: any;
  value?: any;
  values?: any;
  setValues?: any;
  errors?: any;
  touched?: any;
}) => {
  const [searchVal, setSearchVal] = useState(value);
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value);
  };

  const handleRetrieve = (res: AddressAutofillRetrieveResponse) => {
    const feature = res.features[0];
    let place_name = feature.properties.address_line1 ?? "";

    setValues({
      ...values,
      address: place_name,
      zipCode: feature.properties.postcode,
      city: feature.properties.address_level2,
      state: (feature.properties as any).region,
      latLng: {
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      },
    });

    onUpdate("address", feature.properties.address_line1);
    onUpdate("zipCode", feature.properties.postcode);
    onUpdate("city", feature.properties.address_level2);
    onUpdate("state", (feature.properties as any).region);
    dispatch(
      updateCoordinateField({
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      }),
    );

    setSearchVal(place_name);
  };

  return (
    <div className="w-full">
      {process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN?.length && (
        <AddressAutofill
          onRetrieve={handleRetrieve}
          onChange={(val) => {
            setValues({
              ...values,
              address: val,
              zipCode: "",
              city: "",
              state: "",
            });
          }}
          accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
          options={{ country: "US" }}
          popoverOptions={{
            offset: 1,
          }}
          theme={{
            variables: {
              borderRadius: "8px",
              padding: "16px 40px 16px 24px",
            },
          }}
        >
          <div className="relative mb-4 h-11 w-full sm:mb-0">
            <input
              name={name}
              type="text"
              autoComplete="address-line1"
              // value={searchVal}
              defaultValue={value}
              className={returnClass()[0]}
              placeholder=" "
              onBlur={onBlur}
              // onChange={handleChange}
            />
            <label className={returnClass()[1]}>Address</label>
            {(errors.latLng ||
              errors.state ||
              errors.zipCode ||
              errors.city ||
              errors.address) &&
              (touched["address address-search"] || touched.address) &&
              (!values.address ||
                !searchVal ||
                searchVal !== values.address) && (
                <p className="ml-0.5 whitespace-nowrap text-xs text-orange-700 sm:text-sm">
                  Select exact address from dropdown only
                </p>
              )}
          </div>
        </AddressAutofill>
      )}
    </div>
  );
};

export default SearchAutofill;
