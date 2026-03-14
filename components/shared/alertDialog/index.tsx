import React, { ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./index.module.css";

const AlertDialogs = ({
  children,
  prompt,
  confirmHandler,
  data,
  description,
}: {
  children: ReactNode;
  prompt: string;
  confirmHandler: Function;
  data: string;
  description: string;
}) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles["AlertDialogOverlay"]} />
      <AlertDialog.Content className={styles["AlertDialogContent"]}>
        <AlertDialog.Title className={styles["AlertDialogTitle"]}>
          Are you absolutely sure?
        </AlertDialog.Title>
        <AlertDialog.Description className={styles["AlertDialogDescription"]}>
          {description}
        </AlertDialog.Description>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          <AlertDialog.Cancel asChild>
            <button className={`${styles["Button"]} ${styles["mauve"]}`}>
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button
              onClick={() => confirmHandler(data)}
              className={`${styles["Button"]} ${styles["red"]}`}
            >
              {prompt}
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);

export default AlertDialogs;
