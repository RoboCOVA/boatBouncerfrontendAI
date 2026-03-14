import { useContext, useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { MapContext } from "features/context/mapContext";
import { useRouter } from "next/router";

// Define listing types locally since we can't access the constants
const LISTING_TYPE = {
  RENTAL: "rental",
  ACTIVITY: "activity",
};

// Define TypeScript interfaces
interface Listing {
  _id: string;
  boatName: string;
  listingType: string;
  currency: string;
  pricing: {
    perHour?: number;
    perDay?: number;
    perPerson?: number;
  };
  latLng: {
    coordinates: [number, number];
  };
  imageUrls?: string[];
}

interface MapWithClusteringProps {
  data: {
    data: Listing[];
  };
}

// Convert listings to GeoJSON format
const toGeoJSON = (listings: Listing[]) => ({
  type: "FeatureCollection" as const,
  features: listings.map((listing) => ({
    type: "Feature" as const,
    properties: {
      id: listing._id,
      boatName: listing.boatName,
      listingType: listing.listingType,
      currency: listing.currency,
      pricing: listing.pricing,
      image: listing.imageUrls?.[0] || "/location.png",
    },
    geometry: {
      type: "Point" as const,
      coordinates: [
        listing.latLng.coordinates[0],
        listing.latLng.coordinates[1],
      ],
    },
  })),
});

const MapWithClustering: React.FC<MapWithClusteringProps> = ({ data }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useContext(MapContext);
  const router = useRouter();
  const mapInitialized = useRef(false);
  const routerQueryRef = useRef(router.query);

  // Format price based on listing type
  const formatListingPrice = (
    listingType: string,
    pricing: any,
    currency: string,
    includePerDay: boolean = false,
  ): { displayText: string; perHour?: string; perDay?: string } => {
    if (!pricing) return { displayText: "Price not available" };

    // Handle case where pricing is a string
    if (typeof pricing === "string") {
      try {
        pricing = JSON.parse(pricing);
      } catch (e) {
        return { displayText: "Price on request" };
      }
    }

    // Simple price formatter
    const formatPriceValue = (value: number) => {
      if (!value) return "0";
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    };

    const symbol = currency === "USD" ? "$" : "€";

    if (listingType === LISTING_TYPE.RENTAL) {
      const perHour = pricing.perHour;
      const perDay = pricing.perDay;

      if (!perHour && !perDay) return { displayText: "Price on request" };

      const result: { displayText: string; perHour?: string; perDay?: string } =
        {
          displayText: "",
        };

      if (perHour) {
        const perHourText = `${symbol}${formatPriceValue(perHour)}/hr`;
        result.displayText = perHourText;
        result.perHour = perHourText;
      }

      if (perDay) {
        const perDayText = `${symbol}${formatPriceValue(perDay)}/day`;
        result.displayText = result.displayText
          ? `${result.displayText}, ${perDayText}`
          : perDayText;
        result.perDay = perDayText;
      }

      return result;
    } else {
      const price = pricing.perPerson;
      if (!price) return { displayText: "Price on request" };
      const priceText = `${symbol}${formatPriceValue(price)}/person`;
      return {
        displayText: priceText,
      };
    }
  };

  // Update router query ref when it changes
  useEffect(() => {
    routerQueryRef.current = router.query;
  }, [router.query]);

  // Initialize map with clustering
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current) {
      return undefined;
    }

    // Only initialize map once
    if (mapInitialized.current) {
      return undefined;
    }

    const { latSum, lngSum, count } = data.data.reduce(
      (acc, item) => {
        const [lng, lat] = item.latLng.coordinates;
        acc.latSum += lat;
        acc.lngSum += lng;
        acc.count += 1;
        return acc;
      },
      { latSum: 0, lngSum: 0, count: 0 },
    );

    // Default to Texas coordinates when no boats are available
    const avgLat = count !== 0 ? latSum / count : 31.9686;
    const avgLng = count !== 0 ? lngSum / count : -99.9018;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [avgLng, avgLat],
      zoom: 6,
      maxZoom: 18,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
    });

    mapInstance.addControl(new mapboxgl.NavigationControl());
    setMap(mapInstance);

    // Fit map to bounds of all markers after the map loads
    mapInstance.on("load", () => {
      if (!data.data.length) return;

      // Create a 'LngLatBounds' to hold the coordinates
      const bounds = new mapboxgl.LngLatBounds();

      // Extend the bounds to include each coordinate
      data.data.forEach((item) => {
        bounds.extend(item.latLng.coordinates as [number, number]);
      });

      // Add some padding around the bounds
      const padding = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      };

      // Fit the map to the bounds with padding
      mapInstance.fitBounds(bounds, {
        padding: padding,
        maxZoom: 15,
      });
    });

    // Add clustering when map loads
    mapInstance.on("load", () => {
      // Load boat icon
      mapInstance.loadImage("/location.png", (error, image) => {
        if (error) throw error;
        if (image) {
          mapInstance.addImage("boat-icon", image);
        }
      });

      if (!mapInstance.getSource("boats")) {
        // Add source with clustering
        mapInstance.addSource("boats", {
          type: "geojson",
          data: toGeoJSON(data.data),
          cluster: true,
          clusterMaxZoom: 24, // Keep clustering at all zoom levels
          clusterRadius: 50, // Radius of each cluster when clustering points
          clusterMinPoints: 2, // Minimum points to form a cluster
        });

        // Add cluster circles
        mapInstance.addLayer({
          id: "clusters",
          type: "circle",
          source: "boats",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#219ebc",
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20, // Default size
              10, // When point_count >= 10
              25, // Size when point_count >= 10
              50, // When point_count >= 50
              30, // Size when point_count >= 50
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        // Add cluster count labels
        mapInstance.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "boats",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 16,
          },
          paint: {
            "text-color": "#fff",
          },
        });

        // Create a canvas for the custom marker
        const createCustomMarker = (
          priceText: string,
          type: string,
        ): string => {
          // First, update the price text to use /hr instead of /hour
          priceText = priceText.replace("/hour", "/hr");

          // Create canvas and get context
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          // Create a transparent fallback image
          const fallback =
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIzMiI+PC9zdmc+";
          if (!context) return fallback;

          // Set font for text measurement
          context.font = "bold 16px Arial";
          const textMetrics = context.measureText(priceText);

          // Calculate canvas dimensions based on text width
          const padding = 16; // Horizontal padding
          const height = 28; // Fixed height
          const width = Math.max(48, Math.ceil(textMetrics.width) + padding); // Minimum width of 48px

          // Set canvas size
          canvas.width = width;
          canvas.height = height;

          // Set background color based on type
          const bgColor = type === LISTING_TYPE.RENTAL ? "#A16207" : "#3B82F6";
          const borderRadius = 4; // Slight rounding for corners

          // Draw background rectangle with rounded corners
          context.beginPath();
          context.moveTo(borderRadius, 0);
          context.lineTo(width - borderRadius, 0);
          context.quadraticCurveTo(width, 0, width, borderRadius);
          context.lineTo(width, height - borderRadius);
          context.quadraticCurveTo(width, height, width - borderRadius, height);
          context.lineTo(borderRadius, height);
          context.quadraticCurveTo(0, height, 0, height - borderRadius);
          context.lineTo(0, borderRadius);
          context.quadraticCurveTo(0, 0, borderRadius, 0);
          context.closePath();

          // Fill the background
          context.fillStyle = bgColor;
          context.fill();

          // Add white border
          context.strokeStyle = "#fff";
          context.lineWidth = 2;
          context.stroke();

          // Add price text
          context.fillStyle = "#fff";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.font = "bold 13px Arial";

          // Draw the price text (single line, centered)
          context.fillText(priceText, width / 2, height / 2 + 1);

          // Convert canvas to image data URL
          return canvas.toDataURL("image/png");
        };

        // Add the price labels layer
        mapInstance.addLayer({
          id: "price-labels",
          type: "symbol",
          source: "boats",
          filter: ["!", ["has", "point_count"]], // Only show for unclustered points
          layout: {
            "icon-image": ["get", "price-icon-id"],
            "icon-allow-overlap": true,
            "icon-offset": [0, -32], // Position above the location icon
            "icon-size": 1,
            "icon-ignore-placement": true,
          },
        });

        // Add the location markers layer with boat icon and price
        mapInstance.addLayer({
          id: "location-markers",
          type: "symbol",
          source: "boats",
          filter: ["!", ["has", "point_count"]], // Only show for unclustered points
          layout: {
            "icon-image": "boat-icon",
            "icon-allow-overlap": true,
            "icon-size": 1,
            "icon-ignore-placement": true,
            "text-field": [
              "format",
              ["get", "boatName"],
              {
                "font-scale": 1.2,
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              },
              "\n",
              {},
              ["get", "price"],
              {
                "font-scale": 1.3,
                "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
              },
            ],
            "text-offset": [0, 1],
            "text-anchor": "top",
            "text-size": 12,
            "text-optional": true,
          },
          paint: {
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.5,
          },
        });

        // Add interactivity to the layers
        const layers = ["price-labels", "location-markers"];

        // Change the cursor to a pointer when hovering over a clickable feature
        layers.forEach((layer) => {
          mapInstance.on("mouseenter", layer, () => {
            if (mapInstance.getCanvas()) {
              mapInstance.getCanvas().style.cursor = "pointer";
            }
          });

          mapInstance.on("mouseleave", layer, () => {
            if (mapInstance.getCanvas()) {
              mapInstance.getCanvas().style.cursor = "";
            }
          });

          // Add click handler
          mapInstance.on("click", layer, (e) => {
            if (!e.features || e.features.length === 0) return;

            // Get the first feature from the event
            const feature = e.features[0];
            if (!feature.properties) return;

            // Get the coordinates of the click event
            const coordinates = (feature.geometry as any).coordinates.slice();

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Create popup content
            const { id, boatName, listingType, currency, pricing, image } =
              feature.properties;
            const popupContent = `
              <div style="width: 200px">
                <div style="padding: 2.5px;">
                  <img height="3rem" width="auto" src=${image} alt="" />
                  <div style="font-weight:600;font-size:14px;margin-bottom:4px;margin-top:8px;">${boatName}</div>
                  <div style="font-size:12px;color:#030712;margin:4px;">${
                    formatListingPrice(listingType, pricing, currency)
                      .displayText
                  }</div>
                  <a href="/boat/${id}" 
                     style="display:inline-block;padding:4px 12px;background:#0891b2;color:white;border-radius:4px;text-decoration:none;font-size:12px;"
                     target="_blank"
                     >
                    View Details
                  </a>
                </div>
              </div>
            `;

            // Remove any existing popups
            const popups = document.getElementsByClassName("mapboxgl-popup");
            if (popups.length) {
              for (let i = 0; i < popups.length; i++) {
                popups[i].remove();
              }
            }

            // Create and add a new popup
            new mapboxgl.Popup({
              className: "popup-custom-style",
            })
              .setLngLat(coordinates)
              .setHTML(popupContent)
              .addTo(mapInstance);
          });
        });

        // Update source data to include price icons
        const source = mapInstance.getSource("boats") as mapboxgl.GeoJSONSource;

        // Get current features and create new ones with price icons
        const newFeatures = data.data.map((listing: Listing) => {
          const price = formatListingPrice(
            listing.listingType,
            listing.pricing,
            listing.currency,
          );

          // Create a unique ID for each price icon
          const priceIconId = `price-${listing._id}`;

          // Create and add the price icon to the map
          const priceIconUrl = createCustomMarker(
            price.displayText,
            listing.listingType,
          );
          if (!mapInstance.hasImage(priceIconId)) {
            mapInstance.loadImage(priceIconUrl, (error, image) => {
              if (error) return;
              mapInstance.addImage(priceIconId, image!);
            });
          }

          return {
            type: "Feature" as const,
            properties: {
              id: listing._id,
              boatName: listing.boatName,
              listingType: listing.listingType,
              currency: listing.currency,
              pricing: listing.pricing,
              image: listing.imageUrls?.[0] || "/location.png",
              "price-icon-id": priceIconId,
            },
            geometry: {
              type: "Point" as const,
              coordinates: [
                listing.latLng.coordinates[0],
                listing.latLng.coordinates[1],
              ],
            },
          };
        });

        // Update the source with the new data
        source.setData({
          type: "FeatureCollection",
          features: newFeatures,
        });
      }

      // Handle cluster clicks
      const handleClusterClick = (
        e: mapboxgl.MapMouseEvent & {
          features?: mapboxgl.MapboxGeoJSONFeature[];
        },
      ) => {
        if (!e.features?.[0]?.properties?.cluster_id) return;

        const clusterId = e.features[0].properties.cluster_id;
        const source = mapInstance.getSource("boats") as mapboxgl.GeoJSONSource;

        source.getClusterLeaves(
          clusterId,
          50, // max items to return
          0,
          (err, leaves) => {
            if (err || !leaves?.length) return;

            // Build popup content with the same style as the original implementation
            const html = `
            <style>
              .mapboxgl-popup-content.custom-popup-style {
                border-radius: 1.1em !important;
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10);
                padding-right: 1rem !important;
                padding-left: 0.6rem !important;
                padding-bottom: 0.75rem !important;
                padding-top: 0.75rem !important;
                background: #fff;
                border: none;
                z-index: 1000;
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
            <div class='custom-popup-style' style="min-width:220px;max-width:350px;padding:0.5em 0.5em 0.25em 0.5em;z-index:10000;">
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
              <div style="font-weight:600;font-size:1.05em;margin-bottom:0.5em;">
                ${leaves.length} ${
              leaves.length === 1 ? "listing" : "listings"
            } at this location:
              </div>
              <ul style="margin:0;padding:0;list-style:none;max-height:260px;overflow-y:auto;" class="boat-wrapper">
                ${leaves
                  .map((f) => {
                    const props = f.properties as any;
                    const price = formatListingPrice(
                      props.listingType,
                      props.pricing,
                      props.currency,
                    );
                    const bg =
                      props.listingType === "rental"
                        ? "background:#fef9c3;border:1px solid #fde68a;color:#b45309;"
                        : "background:#dbeafe;border:1px solid #60a5fa;color:#1d4ed8;";

                    return `
                      <li style="margin:0 0 0.5em 0;padding:0;">
                        <a href="/boat/${props.id}" 
                           target="_blank" 
                           style="display:flex;align-items:center;gap:0.75em;padding:0.65em 0.75em;${bg}border-radius:0.75em;box-shadow:0 1px 4px rgba(0,0,0,0.04);transition:box-shadow 0.2s,background 0.2s;text-decoration:none;cursor:pointer;" 
                           onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';" 
                           onmouseout="this.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)';">
                          <img src="${props.image}" 
                               alt="" 
                               style="width:38px;height:38px;object-fit:cover;border-radius:0.5em;border:1px solid #e0e7ef;background:#fff;" />
                          <div style="flex:1;min-width:0;">
                            <div style="font-weight:600;font-size:1em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                              ${props.boatName}
                            </div>
                            <div style="color:inherit;font-size:0.97em;margin-top:0.1em;white-space:nowrap;">
                              ${
                                formatListingPrice(
                                  props.listingType,
                                  props.pricing,
                                  props.currency,
                                  true,
                                ).displayText
                              }
                            </div>
                          </div>
                        </a>
                      </li>`;
                  })
                  .join("")}
              </ul>
            </div>`;

            // Remove any existing popups
            const popups = document.getElementsByClassName("mapboxgl-popup");
            if (popups.length) {
              for (let i = 0; i < popups.length; i++) {
                popups[i].remove();
              }
            }

            // Create and add a new popup
            new mapboxgl.Popup({
              className: "popup-custom-style",
            })
              .setLngLat((e.lngLat as any).toArray())
              .setHTML(html)
              .addTo(mapInstance);

            // Add custom classes after popup is rendered
            setTimeout(() => {
              const popupContent = document.querySelector(
                ".mapboxgl-popup-content",
              );
              if (popupContent)
                popupContent.classList.add("custom-popup-style");
              const closeBtn = document.querySelector(
                ".mapboxgl-popup-close-button",
              );
              if (closeBtn) closeBtn.classList.add("custom-close-style");
            }, 0);
          },
        );
      };

      // Handle individual point clicks
      const handlePointClick = (
        e: mapboxgl.MapMouseEvent & {
          features?: mapboxgl.MapboxGeoJSONFeature[];
        },
      ) => {
        if (!e.features?.[0]?.properties) return;

        const { id, boatName, listingType, currency, pricing, image } = e
          .features[0].properties as any;
        const coordinates = (e.features[0].geometry as any).coordinates.slice();

        // Ensure popup appears over the correct feature
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popupContent = `
          <div style="width: 200px;">
            <img src="${image}" style="width:100%;height:120px;object-fit:cover;border-radius:8px 8px 0 0;" />
            <div style="padding: 12px;">
              <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${boatName}</div>
              <div style="font-size:12px;color:#666;">
                ${formatListingPrice(listingType, pricing, currency)}
              </div>
              <a href="/boat/${id}" style="display:inline-block;margin-top:8px;padding:4px 12px;background:#2563eb;color:white;border-radius:4px;text-decoration:none;font-size:12px;">
                View Details
              </a>
            </div>
          </div>
        `;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(mapInstance);
      };

      // Change cursor on hover
      const changeCursor = (cursor: string) => {
        if (mapInstance.getCanvas()) {
          mapInstance.getCanvas().style.cursor = cursor;
        }
      };

      // Add event listeners
      mapInstance.on("click", "clusters", handleClusterClick);
      mapInstance.on("click", "unclustered-point", handlePointClick);
      mapInstance.on("mouseenter", ["clusters", "unclustered-point"], () =>
        changeCursor("pointer"),
      );
      mapInstance.on("mouseleave", ["clusters", "unclustered-point"], () =>
        changeCursor(""),
      );
    });

    // Cleanup function
    return () => {
      mapInstance.remove();
      mapInitialized.current = false;
    };
  }, [data.data, setMap]);

  // Handle map resize
  useEffect(() => {
    if (!map || !mapContainer.current) return;

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        map.resize();
      }, 100);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [map]);

  return (
    <div
      ref={mapContainer}
      className="relative h-full min-h-[500px] w-full bg-[#f0f0f0]"
    >
      {data.data.length === 0 && (
        <div className="absolute left-1/2 top-3/4 z-10 min-w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-4 text-center shadow-lg lg:top-1/2">
          <h3 className="mb-2 text-lg font-semibold">No Boats Available</h3>
          <p className="text-sm text-gray-600">
            There are currently no boats that match your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapWithClustering;
