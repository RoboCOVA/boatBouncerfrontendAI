const Skeleton = () => (
  <>
    <div className="flex w-[90vw] flex-1 flex-col items-center px-20 sm:w-[80vw] md:w-[70vw]  lg:w-[60vw]">
      <div className="mx-10 mt-12 w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
        <div className="flex flex-col space-y-2">
          <div className="h-28 w-11/12 rounded-md bg-gray-300 "></div>
          <div className="h-28 w-10/12 rounded-md bg-gray-300 "></div>
          <div className="h-28 w-9/12 rounded-md bg-gray-300 "></div>
          <div className="h-28 w-9/12 rounded-md bg-gray-300 "></div>
          <div className="h-28 w-11/12 rounded-md bg-gray-300 "></div>
          <div className="h-28 w-10/12 rounded-md bg-gray-300 "></div>
          <div className="h-28 w-9/12 rounded-md bg-gray-300 "></div>
          <div className="h-28 w-9/12 rounded-md bg-gray-300 "></div>
        </div>
      </div>
    </div>
  </>
);

export default Skeleton;
