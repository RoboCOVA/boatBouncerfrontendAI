import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 250 : -250,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? -250 : 250,
      opacity: 0,
    };
  },
};

const DynamicImage = ({
  image,
  index,
  direction,
}: {
  image: string;
  index: number;
  direction: number;
}) => {
  return (
    <AnimatePresence initial custom={direction}>
      <motion.img
        key={index}
        src={image}
        variants={variants}
        initial={direction > 0 ? "exit" : "enter"}
        animate="center"
        exit={direction > 0 ? "enter" : "exit"}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.25 },
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        className="relative z-10 mx-auto h-48 w-full object-cover xs:h-52 sm:h-56 md:h-64 lg:h-full"
      />
    </AnimatePresence>
  );
};

export default DynamicImage;
