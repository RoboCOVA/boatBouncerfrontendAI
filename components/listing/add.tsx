import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import BoatForm from "./forms";
import ActivitiesForm from "./forms/activities";
import { updateBasicInfoField } from "features/boat/boatSlice";

const AddListing = ({ cancelHn }: { cancelHn: (status: any) => void }) => {
  const boatInfo = useSelector((state: any) => state?.boat?.editableBoat);
  const isRental = !boatInfo || boatInfo?.listingType === "rental";

  const [enabled, setEnabled] = useState(isRental);
  const dispatch = useDispatch();

  useEffect(() => {
    if (boatInfo) return;
    dispatch(updateBasicInfoField({ key: "boatType", value: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {!boatInfo && (
          <div className="mx-4 flex justify-start sm:mx-10 md:mx-12 lg:mx-14 xl:mx-16 2xl:mx-20">
            <div className="my-5 flex w-full min-w-64 flex-row items-center justify-center gap-2 rounded-full bg-cyan-600 p-1.5 sm:mb-6 sm:w-fit sm:p-2">
              <button
                onClick={() => setEnabled(true)}
                className={`w-1/2 rounded-full px-5 py-2.5 font-semibold transition-colors duration-500 sm:py-3 ${
                  enabled ? "bg-white text-cyan-600" : "bg-inherit text-white"
                }`}
              >
                Rentals
              </button>
              <button
                onClick={() => setEnabled(false)}
                className={`w-1/2 rounded-full px-5 py-2.5 font-semibold transition-colors duration-500 sm:py-3 ${
                  !enabled ? "bg-white text-cyan-600" : "bg-inherit text-white"
                }`}
              >
                Activities
              </button>
            </div>
          </div>
        )}

        {enabled ? (
          <BoatForm cancelHn={cancelHn} isRental={isRental} />
        ) : (
          <ActivitiesForm cancelHn={cancelHn} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AddListing;
