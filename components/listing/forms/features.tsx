import { updateFeaturesList } from "features/boat/boatSlice";
import { useSelector, useDispatch } from "react-redux";
import useFetcher from "@/lib/hooks/use-axios";
import { useEffect, useState } from "react";
import _ from "lodash";

const FeatureForm = ({
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
  const boatInfo = useSelector((state: any) => state.boat.boatInfo);
  const dispatch = useDispatch();
  const { fetchCategories, data } = useFetcher();
  const [features, setFeatures] = useState<any[]>(boatInfo.features);
  const [newFeature, setNewFeature] = useState("");

  const updateFeaturesLists = (key: string, value: boolean) => {
    dispatch(updateFeaturesList({ key, value }));
  };

  const handleFeaturesChange = (checked: boolean) => {
    if (checked) {
      setValues({
        ...values,
        features: ["on"],
      });
    } else {
      if (boatInfo.features.length === 1) {
        setValues({
          ...values,
          features: [],
        });
      } else {
        setValues({
          ...values,
          features: ["on"],
        });
      }
    }
  };

  const handleAddNewFeature = () => {
    setFeatures([...features, newFeature]);
    updateFeaturesLists(newFeature, true);
    setNewFeature("");
  };

  useEffect(() => {
    fetchCategories("/boat/categories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;

    if (
      data?.boatFeaturesEnum &&
      boatInfo.features &&
      Array.isArray(data.boatFeaturesEnum) &&
      Array.isArray(boatInfo.features)
    ) {
      [...data.boatFeaturesEnum, ...boatInfo.features];
      const mergedArray = _.union(data.boatFeaturesEnum, boatInfo.features);
      setFeatures(mergedArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      <div className="m-2.5 mt-0 rounded border border-gray-200 px-6 py-5 shadow-custom1 sm:mb-7 sm:mt-2.5 sm:rounded-xl">
        <p className="mb-5 text-xl font-semibold text-gray-900">
          Features and Amenities
        </p>

        <div className="flex flex-row flex-wrap">
          {features.map((feature: string, index: number) => (
            <div
              className="flex flex-row items-center gap-2 rounded pb-2 pr-10"
              key={`${feature} ${index}`}
            >
              <input
                className="appearance-none focus:ring-0"
                type="checkbox"
                onBlur={handleBlur}
                name="features"
                id={`${feature} ${index}`}
                checked={boatInfo.features.includes(feature)}
                onChange={(event) => {
                  handleFeaturesChange(event.target.checked);
                  updateFeaturesLists(feature, event.target.checked);
                }}
              />
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor={`${feature} ${index}`}
              >
                {feature}
              </label>
            </div>
          ))}
        </div>
        <div className="my-2.5 flex flex-row gap-0">
          <input
            className="min-w-[242px] max-w-64 appearance-none rounded-s border-cyan-600 ring-cyan-800 focus:border-cyan-600 focus:ring-0"
            // type="checkbox"
            onBlur={handleBlur}
            placeholder="Add custom feature/amenity"
            name="features"
            value={newFeature}
            onChange={(event) => {
              setNewFeature(event.target.value);
            }}
          />
          <button
            onClick={handleAddNewFeature}
            type="button"
            className="rounded-e border-2 border-cyan-600 bg-cyan-600 px-3 text-white"
          >
            Add
          </button>
        </div>

        {errors.features && touched.features && (
          <p className="my-1 ml-1 text-xs text-orange-700 sm:text-sm">
            {errors.features as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default FeatureForm;
