import React from "react";
import { Socket, io } from "socket.io-client";
import { useSession } from "next-auth/react";
import useFetcher from "@/lib/hooks/use-axios";
import { useEffect, useState, useRef } from "react";
import useAutosizeTextArea from "@/lib/hooks/useAutosizeTextArea";

import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import PerfectScrollbarComponent from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { ShowToast } from "../shared/CustomToast";
import MessageWithMenu from "./Message";

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// ** Styled Components
const ChatFormWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  padding: theme.spacing(1.5, 2),
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  transition: "all 0.2s ease-in-out",
  "&:focus-within": {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderColor: "#cbd5e1",
  },
}));

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(0, 0.4, 1.5),
  position: "relative",
  "&:focus-within": {
    "& $chatInput": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  padding: theme.spacing(1, 2.5),
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  "&:hover": {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
}));

const ChatContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
});

const MessagesContainer = styled("div")({
  flex: 1,
  padding: "1rem",
  overflowY: "auto",
  "& > * + *": {
    marginTop: "0.75rem",
  },
  "& .ps__rail-y": {
    width: "4px", // Makes the rail thinner
  },
  "& .ps__thumb-y": {
    width: "4px", // Makes the thumb thinner
    right: "0", // Align to the right
  },
  "& .ps__rail-y:hover > .ps__thumb-y, & .ps__rail-y:focus > .ps__thumb-y, & .ps__rail-y.ps--clicking .ps__thumb-y":
    {
      width: "6px", // Slightly wider on hover
    },
});

const Chat = ({
  bookmarks,
  user,
  bookingTab,
  cancelled,
  userProfileRightOpen,
  handleLeftSidebarToggle,
  handleUserProfileRightSidebarToggle,
}: {
  bookmarks: any;
  user: any;
  cancelled: boolean;
  bookingTab: string;
  userProfileRightOpen: boolean;
  handleLeftSidebarToggle: () => void;
  handleUserProfileRightSidebarToggle: () => void;
}) => {
  const [messages, setMessages] = useState<any>([]);
  const [error, setError] = useState("");
  const { fetchWithAuthSync } = useFetcher();
  const { data: session } = useSession();
  const [value, setValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(textAreaRef.current, value);

  const { _id, token, userName } = user;
  const conversation = bookmarks.conversationId;

  // ** Ref
  const chatArea = useRef(null);

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    if (chatArea.current) {
      // Use type assertion to access the underlying container
      const container = (chatArea.current as any)._container as HTMLElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages && messages?.length) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BASE_API_URL}`, {
      extraHeaders: {
        Authorization: "Bearer " + token,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setSocket(newSocket);
      newSocket.emit("add-user", _id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setSocket(null);
    });

    newSocket.on("getMessage", async (data) => {
      // Only add the message if it's for the current conversation
      if (data.conversationId === conversation) {
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            ...data,
            _id: data._id || JSON.stringify(new Date()),
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          },
        ]);

        try {
          await fetchWithAuthSync(`/message/${data._id}`, null, "PATCH");
        } catch (error) {
          console.log(error);
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setValue(val);
  };

  const sendMessageHn = (event: React.FormEvent<HTMLFormElement>) => {
    const ownerId = bookmarks?.owner?._id;
    const renterId = bookmarks?.renter?._id;

    event.preventDefault();

    if (!ownerId || !renterId) {
      return;
    }

    /* 
    senderId, reciverId, msg
    */
    const senderId = _id;
    const reciverId = [ownerId, renterId].filter((id: string) => id !== _id)[0];
    const msg = value;

    setMessages([
      ...messages,
      {
        senderId,
        reciverId,
        msg,
        _id: JSON.stringify(new Date()),
        createdAt: new Date(),
      },
    ]);

    setValue("");

    fetchWithAuthSync("/message", {
      conversation,
      sender: senderId,
      text: msg,
    })
      .then((response) => {
        if (socket) {
          socket.emit("sendMessage", {
            senderId,
            reciverId,
            msg,
            _id: response.data._id,
            conversationId: conversation,
          });
        }
      })
      .catch(() => {
        setMessages((prevMessages: any) => prevMessages.slice(0, -1));
        ShowToast({
          status: "fail",
          title: "Error",
          message: "Failed to send message. Please try again.",
        });
      });
  };

  useEffect(() => {
    if (!bookmarks || !bookmarks.conversationId) return;
    if (!session?.token) return;

    fetchWithAuthSync(`/message/${bookmarks.conversationId}`)
      .then((response) => setMessages(response.data))
      .catch(() => setError("unable to fetch messages"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarks.conversationId, session?.token]);

  if (error) {
    return (
      <p className="mx-auto mb-6 justify-center text-center text-xl text-red-500">
        {error}
      </p>
    );
  }

  return (
    <ChatContainer>
      <MessagesContainer>
        <PerfectScrollbar
          ref={chatArea}
          options={{
            wheelPropagation: false,
            suppressScrollX: true,
            maxScrollbarLength: 10,
            useBothWheelAxes: false,
          }}
          onYReachEnd={scrollToBottom}
          containerRef={(ref: HTMLElement | null) => {
            // Initial scroll to bottom when container mounts
            if (ref) {
              requestAnimationFrame(() => {
                ref.scrollTop = ref.scrollHeight;
              });
            }
          }}
          className="!pl-0 lg:!pl-4"
        >
          <Box sx={{ padding: 2 }}>
            {messages.map((message: any) => {
              const isSender =
                _id === message?.sender || _id === message?.senderId;

              return (
                <Box
                  key={message._id}
                  sx={{
                    display: "flex",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <MessageWithMenu
                    bookmarks={bookmarks}
                    bookingTab={bookingTab}
                    message={message}
                    isSender={isSender}
                    setMessages={setMessages}
                  />
                </Box>
              );
            })}
          </Box>
        </PerfectScrollbar>
      </MessagesContainer>

      {!cancelled && (
        <Form onSubmit={sendMessageHn}>
          <ChatFormWrapper>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <TextField
                fullWidth
                value={value}
                multiline
                maxRows={4}
                size="small"
                placeholder="Type your message..."
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && "form" in e.target) {
                    e.preventDefault();
                    (e.target.form as HTMLFormElement).requestSubmit();
                  }
                }}
                id="chat-box__textarea"
                className="chatInput"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0891b2", // Tailwind's cyan-600
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "1.5px",
                      borderColor: "#0891b2", // Tailwind's cyan-600
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    py: 1.5,
                    px: 2,
                    fontSize: "0.95rem",
                    "&::placeholder": {
                      color: "#94a3b8",
                      opacity: 1,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              />
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={!value.trim()}
                sx={{
                  backgroundColor: "#0ea5e9",
                  "&:hover": {
                    backgroundColor: "#0284c7",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
              >
                Send
              </StyledButton>
            </Box>
          </ChatFormWrapper>
        </Form>
      )}
    </ChatContainer>
  );
};

export default Chat;
