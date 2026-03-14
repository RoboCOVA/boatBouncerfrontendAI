/* eslint-disable react/require-default-props */
import { toast } from "react-toastify";
import { ReactNode, useEffect, useState } from "react";
import { PiWarning } from "react-icons/pi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

import "react-toastify/dist/ReactToastify.css";
import "./styles/toastStyle.module.css";
import { VscDebugDisconnect as DisconnectIcon } from "react-icons/vsc";

export interface CustomeToastProp {
  title: string;
  message?: string;
  status: "success" | "warning" | "fail" | "network";
  icon?: string | ReactNode;
  onClose?: () => void;
}

function CustomToast({
  title,
  message,
  status = "success",
  icon,
}: CustomeToastProp) {
  const [progressWidth, setProgressWidth] = useState(100);
  const duration = 5000;
  let bgColor;

  switch (status) {
    case "success":
      bgColor = "bg-[#4CAF50]";
      break;
    case "warning":
      bgColor = "bg-[#FFCB00]";
      break;
    case "fail":
    case "network":
      bgColor = "bg-[#FF4E4E]";
      break;
    default:
      bgColor = "bg-[#4CAF50]";
      break;
  }

  function iconSwitch() {
    switch (status) {
      case "success":
        return <IoIosCheckmarkCircleOutline className="text-2xl text-white" />;
      case "warning":
        return <PiWarning className="text-2xl text-white" />;

      case "fail":
        return <MdErrorOutline className="text-2xl text-white" />;
      case "network":
        return <DisconnectIcon className="text-2xl text-white" />;
      default:
        throw new Error("Undefined error type");
    }
  }

  // Animate progress bar width based on duration
  useEffect(() => {
    const interval = 50; // Update every 50ms
    const decrement = 100 / (duration / interval); // Calculate the decrement per interval

    const timer = setInterval(() => {
      setProgressWidth((prev) => Math.max(0, prev - decrement));
    }, interval);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [duration]);

  return (
    <div className="bg-[#f9fafb]">
      <div className="grid h-full w-full grow grid-cols-[56px_1fr] gap-x-4 overflow-hidden rounded-[0.5rem] bg-[#f5f6f8]">
        <div
          className={`${bgColor} grid h-full w-14 shrink-0 place-content-center`}
        >
          {icon || iconSwitch()}
        </div>
        <div
          className={`flex h-full items-center ${
            message ? "py-3" : "py-5"
          } gap-4 pr-3`}
        >
          <div className="space-y-px">
            <h2 className="font-medium capitalize leading-none text-[#252932]">
              {title}
            </h2>
            <p className="text-xs text-[#9A9AAD]">{message}</p>
          </div>
        </div>

        {/* Include Progress Bar */}
      </div>
      <div className="-mt-1 h-1 w-full bg-transparent">
        <div
          className={`h-full ${bgColor} duration-50 transition-all`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
}

export const ShowToast = ({
  title,
  message,
  status,
  icon,
}: CustomeToastProp) => {
  toast(
    <CustomToast title={title} message={message} status={status} icon={icon} />,
    {
      position: "top-right",
      autoClose: 5000,
      isLoading: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progressClassName: "!bg-red-500",
    },
  );
};

export default CustomToast;
