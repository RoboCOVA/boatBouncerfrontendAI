import axios, { Axios } from "axios";
import ms from "ms";
import { DateObject } from "react-multi-date-picker";
import { LISTING_TYPE } from "./constants";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export function getter<JSON = any>(path: RequestInfo): Promise<JSON> {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
    .then((res) => res.data)
    .catch((err) => err);
}

export function authGetter<JSON = any>(
  Axios: Axios,
  path: RequestInfo,
): Promise<JSON> {
  return Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${path}`)
    .then((res) => res.data)
    .catch((err) => err);
}

export function poster(path: string, body?: any) {
  // FIX FE-01: normalize path to always have a leading slash
  if (path && !path.startsWith("/")) path = "/" + path;
  return axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}${path}`, body)
    .then((response) => response.data)
    .catch((error: any) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (
          error.response.statusText &&
          typeof error.response.statusText === "string"
        ) {
          if (
            error?.response?.data?.errors &&
            Array.isArray(error?.response?.data?.errors)
          ) {
            let message = error?.response?.data?.errors
              .map(({ msg }: { msg: string }) => msg)
              .join(",")
              .split(",");

            throw new Error(message);
          }
          throw new Error(
            `${error.response.data?.message ?? error.response.statusText}`,
          );
        }
        return error.response;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw new Error("The request was made but no response was received");
        return;
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message);
      }
    });
}

export function authPoster(Axios: Axios, path: string, body?: any) {
  // FIX FE-01: normalize path to always have a leading slash
  if (path && !path.startsWith("/")) path = "/" + path;
  return Axios.post(`${process.env.NEXT_PUBLIC_API_URL}${path}`, body)
    .then((response) => response.data)
    .catch((error: any) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        if (
          error.response.statusText &&
          typeof error.response.statusText === "string"
        ) {
          if (
            error?.response?.data?.errors &&
            Array.isArray(error?.response?.data?.errors)
          ) {
            let message = error?.response?.data?.errors
              .map(({ msg }: { msg: string }) => msg)
              .join(",")
              .split(",");

            throw new Error(message);
          }
          throw new Error(
            `${error.response.data?.message ?? error.response.statusText}`,
          );
        }
        return error.response;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw new Error("The request was made but no response was received");
        return;
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(error.message);
      }
    });
}

export function objectDiff(obj1: any, obj2: any) {
  let diffObj: any = {};
  for (let key in obj2) {
    // FIX FE-04: original check `!(obj2?.[key] && obj1?.[key])` incorrectly skips
    // falsy values (0, "", false). Only skip if both are truly absent.
    if (obj2?.[key] === undefined && obj1?.[key] === undefined) {
      continue;
    }
    if (JSON.stringify(obj2?.[key]) == JSON.stringify(obj1?.[key])) {
      continue;
    } else {
      diffObj[key] = obj2[key];
    }
  }

  return diffObj;
}

export function dateToUTC(date: DateObject) {
  return new Date(
    Date.UTC(
      date.year,
      Number(date.month) - 1,
      date.day,
      date.hour,
      date.minute,
      date.second,
      date.millisecond,
    ),
  )
    .toISOString()
    .replace("Z", "+00:00");
}

export const hexToRGBA = (hexCode: string, opacity: string) => {
  let hex = hexCode.replace("#", "");
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function formatPrice(
  currency: string,
  price: any,
  listingType: string,
) {
  if (listingType === LISTING_TYPE.ACTIVITY) {
    return `${currency ? (currency === "USD" ? "$" : "€") : "$"}${
      price.perPerson
    }/person`;
  } else {
    return `${currency ? (currency === "USD" ? "$" : "€") : "$"}${
      price.perHour
    }/hr \t${
      price.perDay
        ? `${currency ? (currency === "USD" ? "$" : "€") : "$"}${
            price.perDay
          }/day`
        : ""
    }`;
  }
}
