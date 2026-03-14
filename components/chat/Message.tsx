import React, { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useFetcher from "@/lib/hooks/use-axios";
import { ShowToast } from "../shared/CustomToast";

const MessageWithMenu = ({
  message,
  isSender,
  setMessages,
  bookmarks,
  bookingTab,
}: {
  message: any;
  isSender: boolean;
  setMessages: React.Dispatch<any>;
  bookmarks: any;
  bookingTab: string;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { deleteApi } = useFetcher();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Send delete request to the backend
      await deleteApi(`/message/${messageId}`);

      // Remove the message from the state
      setMessages((prevMessages: any[]) =>
        prevMessages.filter((message) => message._id !== messageId),
      );
    } catch (error) {
      ShowToast({
        title: "Error",
        message: "Failed to delete the message. Please try again.",
        status: "fail",
      });
    }
  };

  return (
    <div
      className={`flex ${
        isSender ? "justify-end" : "justify-start"
      } mb-3 w-full`}
    >
      <div className="group flex flex-col lg:max-w-[85%]">
        {/* Sender Name and Time */}
        <div
          className={`mb-1 flex items-center ${
            isSender ? "justify-end" : "justify-start"
          }`}
        >
          <span className="mr-2 text-xs font-medium text-gray-700">
            {isSender
              ? "You"
              : (bookingTab === "renter"
                  ? bookmarks?.owner?.firstName
                  : bookmarks?.renter?.firstName) || "User"}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>

        {/* Message Bubble */}
        <div className="relative">
          <div
            className={`inline-block rounded-2xl px-4 py-2 text-sm ${
              isSender
                ? "rounded-tr-none bg-cyan-600 text-white"
                : "rounded-tl-none bg-gray-100 text-gray-800"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">
              {message?.text ?? message?.msg}
            </p>
          </div>

          {/* Message Menu */}
          {isSender && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                className="h-8 w-8 bg-white shadow-sm hover:bg-gray-50"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleDeleteMessage(message._id);
            handleMenuClose();
          }}
          sx={{
            fontSize: "14px",
            color: "error.main",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.04)",
            },
          }}
        >
          Delete Message
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MessageWithMenu;
