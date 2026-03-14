import { FormEvent, useEffect, useRef, useState } from "react";
import {
  SearchBox,
  useSearchBoxCore,
  useSearchSession,
} from "@mapbox/search-js-react";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { useRouter } from "next/router";
import { Filter, SearchIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBoxRefType } from "@mapbox/search-js-react/dist/components/SearchBox";
import { SearchBoxSuggestion } from "@mapbox/search-js-core/dist/searchbox/types";
import Filters from "@/components/shared/Filter";
import { icons } from "../../shared/locationIcon";
import useFetcher from "@/lib/hooks/use-axios";
import {
  setActivityType,
  setAmenities,
  setbbox,
  setBoatType,
} from "features/filters/filterSlice";
import { RootState } from "@/components/shared/store";

const Search = ({ page }: { page?: string }) => {
  const [searchVal, setSearchVal] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const searchBoxRef = useRef<SearchBoxRefType>();
  const [suggestion, setSuggestion] = useState<SearchBoxSuggestion | null>(
    null,
  );
  const searchBoxCore = useSearchBoxCore({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
  });
  const { sessionToken: id } = useSearchSession(searchBoxCore);

  const [open, setOpen] = useState(0);

  const handleChange = (value: string) => setSearchVal(value);

  const [features, setFeatures] = useState<string[]>([]);
  const [boatTypes, setBoatTypes] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const filterDivRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const { bbox } = useSelector((state: RootState) => state.filters);

  const { fetchWithAuthSync } = useFetcher();

  const handleRetrieve = (res: SearchBoxRetrieveResponse) => {
    let query: any = {};

    const properties = res.features[0]?.properties;

    if (!properties) return;

    if (properties.feature_type == "place") {
      query.city = properties.name;
      query.state = properties?.context?.region?.name;
    } else if (properties.feature_type == "region") {
      query.state = properties.name;
    } else if (properties.feature_type == "address") {
      query.city = properties?.context?.place?.name;
      query.state = properties?.context?.region?.name;
      query.address = properties.name;
    } else {
      query.address = properties.name;
    }

    if (properties.bbox) {
      query.bbox = JSON.stringify(properties.bbox);

      // if (JSON.stringify(properties.bbox) !== bbox) {
      //   dispatch(setbbox(JSON.stringify(properties.bbox)));
      // }
    } else {
      // dispatch(setbbox(JSON.stringify("")));
    }

    if (properties.coordinates)
      query.coordinates = JSON.stringify(properties.coordinates);

    router.replace({
      pathname: "/",
      query,
    });
  };

  useEffect(() => {
    if (!bbox) return;

    const newQuery = { ...router.query, bbox };
    router.replace({
      pathname: "/",
      query: newQuery,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickSearch = async () => {
    if (!suggestion) return;

    const response = await searchBoxCore.retrieve(suggestion, {
      sessionToken: id,
    });

    handleRetrieve(response);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!suggestion) return;

    const response = await searchBoxCore.retrieve(suggestion, {
      sessionToken: id,
    });

    handleRetrieve(response);
  };

  useEffect(() => {
    const mapBoxSearchBox =
      document.getElementsByTagName("mapbox-search-box")[0];

    const searchBox = mapBoxSearchBox.firstElementChild;
    const searchInput = searchBox?.getElementsByTagName("input")[0];

    searchInput?.classList.add("mapbox-search-box");
    searchBox?.classList.add("mapbox-search-box");
  }, []);

  useEffect(() => {
    fetchWithAuthSync("/boat/activities").then((response) => {
      setActivities(response.data?.boatActivityTypeEnum ?? []);
      dispatch(setActivityType(response.data?.boatActivityTypeEnum ?? []));
    });

    fetchWithAuthSync("/boat/types").then((response) => {
      setBoatTypes(response.data?.boatTypeEnum ?? []);
      dispatch(setBoatType(response.data?.boatTypeEnum ?? []));
    });

    fetchWithAuthSync("/boat/categories").then((response) => {
      setFeatures(response.data?.boatFeaturesEnum ?? []);
      dispatch(setAmenities(response.data?.boatFeaturesEnum ?? []));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      filterDivRef.current &&
      filterButtonRef.current &&
      !filterDivRef.current.contains(event.target as Node) &&
      !filterButtonRef.current.contains(event.target as Node)
    ) {
      setOpen(0); // Close the filter dropdown
    }
  };

  useEffect(() => {
    if (open === 1) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN && (
        <form
          className="flex w-full items-center"
          // action={`/search?address=${searchVal}`}
          onSubmit={handleSubmit}
          method="POST"
          id="searchForm"
        >
          <label className="sr-only">Search</label>
          <div className="relative mx-auto mt-1 w-full">
            <SearchBox
              ref={searchBoxRef}
              accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
              placeholder="Where would you like to travel"
              onRetrieve={handleRetrieve}
              onSuggest={(sugg: { suggestions: any[] }) =>
                setSuggestion(sugg.suggestions[0])
              }
              theme={{
                icons: icons,
                variables: {
                  padding: "0.75rem 1.75rem",
                  borderRadius: "8px",
                },
              }}
              options={{
                country: "US",
                language: "en",
                limit: 5,
              }}
              value={searchVal}
              onChange={handleChange}
            />
            <p className="absolute right-0 top-0 z-10 h-10 w-10 rounded-full"></p>
            <button
              type="button"
              disabled={!searchVal}
              onClick={handleClickSearch}
              className={`z-10 hidden shadow-sm drop-shadow-sm md:block ${
                page == "home"
                  ? "absolute right-1 top-1 h-12 rounded-3xl bg-cyan-600 px-6 py-1 text-sm font-medium text-white shadow-xl drop-shadow-xl hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-300 lg:-right-24 xl:right-1 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  : "ml-2 inline-flex h-11 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 focus:outline-none"
              }`}
            >
              Search
            </button>

            <button
              type="button"
              disabled={!searchVal}
              onClick={handleClickSearch}
              className={`z-10 block shadow-sm drop-shadow-sm md:hidden ${
                page == "home"
                  ? "absolute right-11 top-1 h-9 rounded-3xl bg-cyan-600 px-3 py-1 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-300 md:right-1 md:h-12 md:px-6 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  : "ml-2 inline-flex h-11 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 focus:outline-none"
              }`}
            >
              <SearchIcon className="size-3 md:size-5" />
            </button>

            <button
              type="button"
              ref={filterButtonRef}
              onClick={() => setOpen(open === 1 ? 0 : 1)}
              className={`z-10 shadow-sm drop-shadow-sm md:block ${
                page == "home"
                  ? "absolute right-1.5 top-1 h-9 rounded-3xl bg-cyan-600 px-3 py-1 text-sm font-medium text-white shadow-xl drop-shadow-xl hover:bg-cyan-700 focus:outline-none md:-right-[5.75rem] md:h-12 md:px-5 lg:-right-[11.65rem] xl:-right-[6.25rem] xl:px-6 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  : "ml-2 inline-flex h-9 items-center rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 shadow-xl drop-shadow-xl focus:outline-none md:h-11"
              }`}
            >
              <div className="flex flex-row flex-nowrap items-center gap-1.5">
                <Filter className="size-3 md:hidden md:size-5" />
                <span className="hidden px-1 md:block">Filters</span>
              </div>
            </button>
            {open === 1 && (
              <div
                ref={filterDivRef}
                className="absolute -right-0 top-[3.75rem] shadow-2xl drop-shadow-2xl md:-right-28"
              >
                <Filters
                  features={features}
                  activities={activities}
                  boatTypes={boatTypes}
                  close={() => setOpen(0)}
                />
              </div>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default Search;
