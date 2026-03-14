import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import Boat from "../boat";
import useFetcher from "@/lib/hooks/use-axios";
import { useSession } from "next-auth/react";
import { authGetter } from "@/lib/utils";
import { ShowToast } from "../shared/CustomToast";
import { PAGE_SIZE } from "@/lib/constants";

const SearchResults = ({
  boats,
  total,
  checked,
}: {
  boats: any;
  total?: number;
  checked?: boolean;
}) => {
  const [pageNo, setPageNo] = useState(1);
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [boatsData, setBoatsData] = useState(boats);

  const { fetchWithAuth, data, loading, error, Axios } = useFetcher();

  useEffect(() => {
    fetchWithAuth(`/boat?pageNo=${pageNo}&size=${PAGE_SIZE}`, null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (!data) return;
    setBoatsData(Array.isArray(data) ? data[0]?.data || [] : []);
  }, [data]);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const favorites = await authGetter(Axios, "boat/favorites");

        if (favorites.total == 0) return;

        const favoriteIds = favorites.data.map(
          (favorite: any) => favorite.boat._id,
        );

        setFavorites(favoriteIds);
      } catch (error: any) {}
    };

    if (!session?.token) return;
    getFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageNo]);

  useEffect(() => {
    if (!error) return;
    ShowToast({
      status: "fail",
      title: "Error Occured",
      message: "Please make sure your internet is working and try again.",
    });
  }, [error]);

  const nextPage = () => {
    setPageNo((page) => page + 1);
  };

  const prevPage = () => {
    setPageNo((page) => page - 1);
  };

  let element = <></>;

  if (pageNo === 1) {
    element =
      boatsData &&
      boatsData.map((boat: any) => (
        <div
          key={boat._id}
          onClick={() => {
            window.open(`/boat/${boat._id}`, "_blank");
          }}
          className="relative mx-1.5 cursor-pointer"
        >
          <Boat
            page="search"
            favorite={favorites.includes(boat._id)}
            checked={checked}
            boatImg={boat.imageUrls[0]}
            boatImgs={boat.imageUrls}
            location={boat.location}
            pricing={boat.pricing}
            boatName={boat.boatName}
            currency={boat.currency}
            captained={boat.captained} // FIX FE-07: use direct boolean field
            markerId={boat._id}
            boatId={boat._id}
            listingType={boat?.listingType}
          >
            {""}
          </Boat>
        </div>
      ));
  }

  if (loading && pageNo !== 1) {
    element = (
      <div className="flex w-full flex-1 flex-col items-center px-2.5">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
          <div className="flex flex-col space-y-10">
            <div className="h-72 rounded-md bg-gray-300 "></div>
            <div className="h-72 rounded-md bg-gray-300 "></div>
            <div className="h-72 rounded-md bg-gray-300 "></div>
          </div>
        </div>
      </div>
    );
  }

  if (pageNo !== 1 && !loading && boatsData) {
    element =
      boatsData &&
      boatsData.map((boat: any) => (
        <div
          key={boat._id}
          onClick={() => {
            window.open(`/boat/${boat._id}`, "popup");
          }}
          className="relative mx-1.5 cursor-pointer"
        >
          <Boat
            page="search"
            boatImg={boat.imageUrls[0]}
            boatImgs={boat.imageUrls}
            location={boat.location}
            pricing={boat.pricing}
            boatName={boat.boatName}
            currency={boat.currency}
            captained={boat.captained} // FIX FE-07: use direct boolean field
            markerId={boat._id}
            listingType={boat?.listingType}
          >
            {""}
          </Boat>
        </div>
      ));
  }

  return (
    <Fragment>
      <div
        className={`grid w-full gap-0 gap-y-5 py-2.5 ${
          checked
            ? "overflow-y-scroll [-ms-overflow-y-style:'none'] [scrollbar-width:'none'] lg:grid-cols-2 [&::-webkit-scrollbar]:hidden"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
        }`}
      >
        {element}
      </div>
      {total && total > 10 && (
        <>
          <hr className="h-px w-full bg-black" />
          <div className="mx-6 my-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-lg">
              Page {pageNo} | ({total} results)
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={prevPage}
                className={`rounded-lg border px-5 py-1.5 text-lg font-medium ${
                  pageNo === 1 ? "opacity-40" : ""
                }`}
                disabled={pageNo === 1}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                className={`rounded-lg border px-5 py-1.5 text-lg font-medium ${
                  pageNo * PAGE_SIZE >= total ? "opacity-40" : ""
                }`}
                disabled={pageNo * PAGE_SIZE >= total}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

export default SearchResults;
