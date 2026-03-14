import mapboxgl from "mapbox-gl";
import { Dispatch, SetStateAction, createContext } from "react";

export const MapContext = createContext<{
  map: mapboxgl.Map | null;
  setMap: Dispatch<SetStateAction<mapboxgl.Map | null>>;
}>({
  map: null,
  setMap: () => {},
});
