import Axios from "axios";
import { setActiveId } from "features/bookmark/bookmarkSlice";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

function useFetcher() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<any>(null);
  const dispatch = useDispatch();

  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    if (session?.token) {
      Axios.defaults.headers.common = {
        Authorization: `Bearer ${session?.token}`,
      };
    }
  }, [session?.token]);

  function updateBoat(path: string, body?: any) {
    setError(null);
    setLoading(true);
    setData(null);

    if (body) {
      Axios.put(path, body)
        .then((res) => {
          setLoading(false);
          setError(null);
          setData(res);
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          setData(null);
        });
    }
  }

  async function deleteBoat(path: string, boat: any) {
    try {
      let deleteBoat = await Axios.delete(path);
      if (deleteBoat.status == 200) {
        let filteredData = data.filter((d: any) => d._id !== boat._id);
        setData(filteredData);
      }
    } catch (error) {
      toast.error("unable to delete a boat", { position: "bottom-center" });
    }
  }

  async function cancelBooking(path: string, book: any) {
    try {
      let deleteBooking = await Axios.put(path);
      if (deleteBooking.status == 200) {
        let filteredData = data.filter((d: any) => d._id !== book._id);
        const filteredIndex = data.findIndex((d: any) => d._id === book._id);
        setData(filteredData);
        if (filteredData.length === 1) {
          dispatch(setActiveId(filteredData[0]._id));
        } else if (filteredData.length === 0) {
          dispatch(setActiveId(null));
        } else {
          if (filteredIndex === filteredData.length) {
            dispatch(setActiveId(filteredData[filteredIndex - 1]._id));
          } else {
            dispatch(setActiveId(filteredData[filteredIndex]._id));
          }
        }
      }
    } catch (error) {
      toast.error("unable to cancel a booking", { position: "bottom-center" });
    }
  }

  function fetchWithAuth(path: string, body?: any, flag?: boolean) {
    setError(null);
    setLoading(true);
    setData(null);
    if (body) {
      Axios.post(path, body)
        .then((res) => {
          setLoading(false);
          setError(null);
          setData(res);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          setData(null);
        });
    } else {
      Axios.get(path)
        .then((res) => {
          setLoading(false);
          setError(null);
          setData(flag ? res?.data : res.data?.data);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          setData(null);
        });
    }
  }

  function fetchWithAuthWCancellation(path: string) {
    setError(null);
    setLoading(true);
    setData(null);

    Axios.get(path)
      .then((res) => {
        setLoading(false);
        setError(null);
        setData(res?.data?.data);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        setData(null);
      });
  }

  function fetchCategories(path: string) {
    setError(null);
    setLoading(true);
    setData(null);

    Axios.get(path)
      .then((res) => {
        setLoading(false);
        setError(null);
        setData(res?.data);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        setData(null);
      });
  }

  function attachPaymentCard(path: string) {
    return Axios.post(path);
  }

  function getPaymentCards(path: string) {
    return Axios.get(path);
  }

  function updateOffer(path: string, body: any) {
    return Axios.put(path, body);
  }

  function updateUser(path: string, body: any) {
    return Axios.put(path, body);
  }

  function acceptOffer(path: string) {
    return Axios.put(path);
  }

  function deleteApi(path: string) {
    return Axios.delete(path);
  }

  function fetchWithAuthSync(path: string, body?: any, method?: string) {
    if (method === "PATCH") {
      return Axios.patch(path, body);
    }
    if (body) {
      return Axios.post(path, body);
    } else {
      return Axios.get(path);
    }
  }

  return {
    Axios,
    fetchWithAuth,
    fetchCategories,
    fetchWithAuthSync,
    attachPaymentCard,
    fetchWithAuthWCancellation,
    getPaymentCards,
    cancelBooking,
    updateOffer,
    acceptOffer,
    updateBoat,
    deleteBoat,
    updateUser,
    setData,
    loading,
    error,
    data,
    deleteApi,
  };
}

export default useFetcher;
