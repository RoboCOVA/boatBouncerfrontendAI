import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";

import bgImage from "public/location.png";
import { MapContext } from "features/context/mapContext";
import formatPrice from "@/lib/utils";
import { LISTING_TYPE } from "@/lib/constants";
import { useRouter } from "next/router";

export default function MapContainer(props: any) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useContext(MapContext);
  const { data: serverData } = props;
  const [data, setData] = useState(serverData);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const lastBboxRef = useRef<number[] | null>(null);
  const router = useRouter();
  // const [searchOverMap, setSearchOverMap] = useState(true);

  // const hasQueryParams = Object.keys(router.query).length > 0;

  useEffect(() => {
    setData(serverData);
    // dispatch(setBoats(serverData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverData]);

  // useEffect(() => {
  //   if (!window) return;

  //   const searchOverMapValue = localStorage.getItem("search-over-map");

  //   if (searchOverMapValue === null) {
  //     setSearchOverMap(false);
  //   } else {
  //     setSearchOverMap(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [typeof window]);

  function removeElementsByClass(className: string) {
    let elements = document.getElementsByClassName(className);
    while (elements.length > 0 && elements[0].parentNode) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  // const toggleSearchOverMapHn = () => {
  //   if (searchOverMap) {
  //     localStorage.removeItem("search-over-map");
  //   } else {
  //     localStorage.setItem("search-over-map", "yes");
  //   }
  //   setSearchOverMap((s) => !s);
  // };

  useEffect(() => {
    if (markers.length > 0) {
      markers.forEach((marker: mapboxgl.Marker) => {
        marker.remove();
      });
    }

    if (!map || typeof window === "undefined") return;

    const bounds = new mapboxgl.LngLatBounds();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const bbox = urlParams.get("bbox");
    const coordinate = urlParams.get("coordinates");

    if (bbox) {
      map.fitBounds(JSON.parse(bbox));
    } else {
      if (!Array.isArray(data?.data) || data.data.length === 0) {
        if (coordinate) {
          try {
            const coords = JSON.parse(coordinate); // should be [lng, lat]
            map.flyTo({
              center: [coords.longitude, coords.latitude],
              zoom: 9,
            });
          } catch (e) {
            console.error("Invalid coordinates:", e);
          }
        }
        return;
      }

      data.data.forEach((d: any) => {
        if (d.latLng.coordinates[0] && d.latLng.coordinates[1]) {
          bounds.extend([d.latLng.coordinates[0], d.latLng.coordinates[1]]);
        }
      });

      map.fitBounds(bounds, { padding: 50 });
    }

    if (!data || !data.data || data.data.length === 0) return;

    setMarkers([]);
    removeElementsByClass("marker-div");

    // Group listings by coordinates
    const grouped: Record<string, any[]> = {};
    data.data.forEach((d: any) => {
      const key = `${d.latLng.coordinates[0]},${d.latLng.coordinates[1]}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(d);
    });

    const mrks: mapboxgl.Marker[] = [];
    const markerRefs: Record<string, mapboxgl.Marker> = {};

    Object.entries(grouped).forEach(([coordsKey, listings]) => {
      const [lng, lat] = coordsKey.split(",").map(Number);
      let div = document.createElement("div");
      div.classList.add("marker-div");
      div.style.position = "absolute";
      div.style.cursor = "pointer";

      if (listings.length === 1) {
        // Single marker (original style)
        let el = document.createElement("img");
        let p = document.createElement("p");
        p.classList.add("marker-p");
        el.classList.add("marker-image");
        div.classList.add(
          listings[0].listingType === LISTING_TYPE.ACTIVITY
            ? "activity"
            : "rental",
        );
        div.setAttribute("id", listings[0]._id);
        p.innerText = formatPrice(
          listings[0].currency,
          listings[0].pricing,
          listings[0].listingType,
        );
        el.src = bgImage.src;
        div.appendChild(el);
        div.appendChild(p);
        div.addEventListener("mouseenter", function () {
          this.classList.add("active_div");
        });
        div.addEventListener("mouseleave", function () {
          this.classList.remove("active_div");
        });
        let marker = new mapboxgl.Marker(div).setLngLat([lng, lat]).setPopup(
          new mapboxgl.Popup().setHTML(
            `
                <a href="/boat/${
                  listings[0]._id
                }" target="_blank" class="marker-link">
                  <div>
                    <div>
                      <img height="3rem" width="auto" src=${
                        listings[0].imageUrls[0]
                      } alt="" />
                    </div>
                    <div>
                      <p style="font-size:12px;font-weight:bold;margin-top:0.4rem">
                        ${listings[0].boatName}
                      </p>
                      <p style="font-size:12px;font-weight:bold;margin-top:0.4rem">
                        ${
                          listings[0].listingType === "rental"
                            ? `${listings[0].currency == "USD" ? "$" : "€"}${
                                listings[0].pricing.perHour
                              }/hour`
                            : ""
                        }
                        ${
                          listings[0].listingType !== "rental"
                            ? `${listings[0].currency == "USD" ? "$" : "€"}${
                                listings[0].pricing.perPerson
                              }/person`
                            : ""
                        }    
                        ${
                          listings[0].listingType === "rental" &&
                          listings[0].pricing.perDay
                            ? `${listings[0].currency == "USD" ? "$" : "€"}${
                                listings[0].pricing.perDay
                              }/day`
                            : ""
                        }
                      </p>
                    </div>
                  </div>
                </a>
              `,
          ),
        );
        mrks.push(marker);
        markerRefs[listings[0]._id] = marker;
      } else {
        div.classList.remove("marker-div");
        div.classList.add("cluster-marker-div");
        // Cluster marker
        div.innerHTML = `<div style="color:white;border-radius:100%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.15);">${listings.length}</div>`;
        // Popup with list of listings
        let popupContent = `
          <style>
            .mapboxgl-popup-content.custom-popup-style {
              border-radius: 1.1em !important;
              box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10);
              padding: 0 !important;
              background: #fff;
              border: none;
            }
            .mapboxgl-popup-close-button.custom-close-style {
              top: 0.7em !important;
              right: 0.9em !important;
              font-size: 1.3em !important;
              color: #64748b !important;
              background: #f1f5f9 !important;
              border-radius: 50%;
              width: 2em;
              height: 2em;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 1px 4px rgba(0,0,0,0.07);
              border: 1px solid #e0e7ef;
              transition: background 0.15s;
            }
            .mapboxgl-popup-close-button.custom-close-style:hover {
              background: #e0e7ef !important;
              color: #1e293b !important;
            }
          </style>
          <div class='custom-popup-style' style="min-width:220px;max-width:350px;padding:0.5em 0.5em 0.25em 0.5em;">
            <div style="display:flex;align-items:center;gap:0.75em;margin-bottom:0.5em;">
              <span style="display:inline-flex;align-items:center;gap:0.3em;">
                <span style="display:inline-block;width:1.2em;height:1.2em;background:#fef9c3;border:1.5px solid #fde68a;border-radius:0.4em;"></span>
                <span style="font-size:0.97em;color:#b45309;font-weight:600;">Rental</span>
              </span>
              <span style="display:inline-flex;align-items:center;gap:0.3em;">
                <span style="display:inline-block;width:1.2em;height:1.2em;background:#dbeafe;border:1.5px solid #60a5fa;border-radius:0.4em;"></span>
                <span style="font-size:0.97em;color:#2563eb;font-weight:600;">Activity</span>
              </span>
            </div>
            <div style="font-weight:600;font-size:1.05em;margin-bottom:0.5em;">${
              listings.length
            } listings at this location:</div>
            <ul style="margin:0;padding:0;list-style:none;max-height:260px;overflow-y:auto;" class="boat-wrapper">
              ${listings
                .map((l) => {
                  let price = "";
                  if (l.listingType === "rental") {
                    price += `${l.currency == "USD" ? "$" : "€"}${
                      l.pricing.perHour
                    }/hour`;
                    if (l.pricing.perDay)
                      price += `, ${l.currency == "USD" ? "$" : "€"}${
                        l.pricing.perDay
                      }/day`;
                  } else {
                    price += `${l.currency == "USD" ? "$" : "€"}${
                      l.pricing.perPerson
                    }/person`;
                  }
                  // Background for type
                  const bg =
                    l.listingType === "rental"
                      ? "background:#fef9c3;border:1px solid #fde68a;color:#b45309;"
                      : "background:#dbeafe;border:1px solid #60a5fa;color:#1d4ed8;";
                  return `
                    <li style="margin:0 0 0.5em 0;padding:0;">
                      <a href="/boat/${
                        l._id
                      }" target="_blank" style="display:flex;align-items:center;gap:0.75em;padding:0.65em 0.75em;${bg}border-radius:0.75em;box-shadow:0 1px 4px rgba(0,0,0,0.04);transition:box-shadow 0.2s,background 0.2s;text-decoration:none;cursor:pointer;" onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';" onmouseout="this.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)';" data-id="${
                    l._id
                  }">
                        <img src="${
                          l.imageUrls?.[0] || "/location.png"
                        }" alt="" style="width:38px;height:38px;object-fit:cover;border-radius:0.5em;border:1px solid #e0e7ef;background:#fff;" />
                        <div style="flex:1;min-width:0;">
                          <div style="font-weight:600;font-size:1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${
                            l.boatName
                          }</div>
                          <div style="color:inherit;font-size:0.97em;margin-top:0.1em;">${price}</div>
                        </div>
                      </a>
                    </li>`;
                })
                .join("")}
            </ul>
          </div>`;
        let marker = new mapboxgl.Marker(div)
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(popupContent));
        mrks.push(marker);
        marker.on("popupopen", () => {
          setTimeout(() => {
            const popupContent = document.querySelector(
              ".mapboxgl-popup-content",
            );
            if (popupContent) popupContent.classList.add("custom-popup-style");
            const closeBtn = document.querySelector(
              ".mapboxgl-popup-close-button",
            );
            if (closeBtn) closeBtn.classList.add("custom-close-style");
          }, 0);
          const popupNode = document.querySelector(
            ".mapboxgl-popup-content ul",
          );
          if (popupNode) {
            popupNode.querySelectorAll("a[data-id]").forEach((a) => {
              a.addEventListener("click", (e) => {
                // Let the link open in a new tab, but also show the popup for that listing
                const id = a.getAttribute("data-id");
                const listing = listings.find((l) => l._id === id);
                if (listing) {
                  // Close the cluster popup
                  marker.getPopup().remove();
                  // Create a new popup for the selected listing
                  const singlePopup = new mapboxgl.Popup({ closeOnClick: true })
                    .setLngLat([lng, lat])
                    .setHTML(
                      `
                        <a href="/boat/${
                          listing._id
                        }" target="_blank" class="marker-link">
                          <div>
                            <div>
                              <img height="3rem" width="auto" src=${
                                listing.imageUrls[0]
                              } alt="" />
                            </div>
                            <div>
                              <p style="font-size:12px;font-weight:bold;margin-top:0.4rem">
                                ${listing.boatName}
                              </p>
                              <p style="font-size:12px;font-weight:bold;margin-top:0.4rem">
                                ${
                                  listing.listingType === "rental"
                                    ? `${
                                        listing.currency == "USD" ? "$" : "€"
                                      }${listing.pricing.perHour}/hour`
                                    : ""
                                }
                                ${
                                  listing.listingType !== "rental"
                                    ? `${
                                        listing.currency == "USD" ? "$" : "€"
                                      }${listing.pricing.perPerson}/person`
                                    : ""
                                }    
                                ${
                                  listing.listingType === "rental" &&
                                  listing.pricing.perDay
                                    ? `${
                                        listing.currency == "USD" ? "$" : "€"
                                      }${listing.pricing.perDay}/day`
                                    : ""
                                }
                              </p>
                            </div>
                          </div>
                        </a>
                      `,
                    );
                  singlePopup.addTo(map);
                  // Do not preventDefault, let the link open in a new tab
                }
              });
            });
          }
        });
      }
    });

    setMarkers(mrks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, map, typeof window]);

  useEffect(() => {
    if (markers.length && map) {
      for (const marker of markers) {
        const container = map.getCanvasContainer();
        if (container) marker.addTo(map);
      }
    }

    return () => {
      if (markers.length) {
        for (const marker of markers) {
          marker.remove();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, map, typeof window]);

  const routerQueryRef = useRef(router.query);

  useEffect(() => {
    routerQueryRef.current = router.query;
  }, [router.query]);

  useEffect(() => {
    const node = mapContainer.current;
    if (typeof window === "undefined" || node === null) return;

    const mapInstance = new mapboxgl.Map({
      accessToken: `${process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}`,
      container: node,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-120.740135, 47.751076],
      attributionControl: false,
      zoom: 9,
    });

    function hasBboxChanged(
      newBbox: number[],
      oldBbox: number[] | null,
      epsilon = 0.0001,
    ) {
      if (!oldBbox) return true;
      return newBbox.some((val, i) => Math.abs(val - oldBbox[i]) > epsilon);
    }

    const debouncedHandleZoomOrMove = () => {
      const bounds = mapInstance.getBounds();
      const [[westLng, southLat], [eastLng, northLat]] = bounds.toArray();
      const flatBbox = [westLng, southLat, eastLng, northLat];

      if (!hasBboxChanged(flatBbox, lastBboxRef.current)) return;

      lastBboxRef.current = flatBbox;

      const routeQuery = { ...routerQueryRef.current };
      delete routeQuery.bbox;

      if (Object.keys(routeQuery).length !== 0) {
        router.push({
          pathname: "/",
          query: {
            ...routeQuery,
            bbox: JSON.stringify(flatBbox),
          },
        });
      }
    };

    setMap(mapInstance);

    mapInstance.on("zoomend", debouncedHandleZoomOrMove);
    mapInstance.on("moveend", debouncedHandleZoomOrMove);

    return () => {
      mapInstance.off("zoomend", debouncedHandleZoomOrMove);
      mapInstance.off("moveend", debouncedHandleZoomOrMove);
      mapInstance.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof window]);

  useEffect(() => {
    if (!map || !mapContainer.current) return;

    let resizeTimeout: string | number | NodeJS.Timeout | undefined;

    const container = mapContainer.current;
    const observer = new ResizeObserver(() => {
      container.classList.add("resizing");

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          map.resize();
          container.classList.remove("resizing");
        });
      }, 0);
    });

    observer.observe(container);

    return () => {
      clearTimeout(resizeTimeout);
      observer.disconnect();
    };
  }, [map]);

  return (
    <div
      ref={mapContainer}
      className="absolute bottom-0 left-0 right-0 top-20 min-h-[75vh] w-full lg:h-[calc(100vh-5rem)] lg:min-h-[50vh]"
    >
      {/* {hasQueryParams ? (
        <div className="relative z-10 m-1 ml-auto flex w-fit flex-row items-center gap-2 rounded bg-white px-2.5 py-1.5">
          <label htmlFor="search-over-map" className="text-base font-medium">
            Search as map moves
          </label>
          <input
            type="checkbox"
            checked={searchOverMap}
            id="search-over-map"
            onClick={toggleSearchOverMapHn}
          />
        </div>
      ) : null} */}
    </div>
  );
}
