import React, { useState, useEffect } from "react";
import BaseLayout from "../../base";
import Form from "../form";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import useFetcher from "@/lib/hooks/use-axios";
import { AxiosResponse } from "axios";
import { CircularProgress } from "@mui/material";
import AlertDialogs from "@/components/shared/alertDialog";
import { ShowToast } from "@/components/shared/CustomToast";

function Update({ props }: { props: any }) {
  const { data: session } = useSession();
  const [initialValues, setInitialValues] = useState<any | null>(null);
  const [step, setSteps] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const { fetchWithAuthSync, deleteApi } = useFetcher();
  const [isDeleting, setIsDeleting] = useState(false);

  function setStep(step: number) {
    setSteps(step);
  }

  function triggerRefreshHn() {
    setRefresh((r) => !r);
  }

  const deleteAccountHn = async () => {
    if (initialValues && initialValues.id) {
      try {
        setIsDeleting(true);

        await deleteApi("/user/account");
        signOut({ callbackUrl: "/" });

        setIsDeleting(false);
      } catch (error) {
        ShowToast({
          status: "fail",
          title: "Error",
          message: "Account deletion failed",
        });
      }
    }
  };

  useEffect(() => {
    if (!session?.token) return;

    fetchWithAuthSync("/user/current")
      .then((res: AxiosResponse) => {
        setInitialValues(res.data);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          ShowToast({
            status: "fail",
            title: "Error",
            message: "Session expired",
          });
          signOut({ callbackUrl: "/user/login" });
        }
        setInitialValues(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token, refresh]);

  let formEl = (
    <div className="flex h-[30vh] w-full items-center justify-center text-cyan-600">
      <CircularProgress color="inherit" size="5vh" />
    </div>
  );

  if (initialValues) {
    formEl = (
      <Form
        type="Save Account"
        initialValues={initialValues}
        page="update"
        step={step}
        setStep={setStep}
        triggerRefresh={triggerRefreshHn}
      />
    );
  }

  return (
    <BaseLayout
      action="Update Profile"
      prompt={
        <div className="flex flex-col">
          <p className="text-xs xs:text-base">
            update your account information
          </p>
          <p className="text-center text-sm font-bold text-amber-600 sm:text-base lg:text-lg">
            (You have {initialValues?.activeListingsCount ?? 0} active listings)
          </p>
        </div>
      }
      step={step}
      setStep={setSteps}
      props={props}
    >
      {formEl}
      {initialValues && (
        <AlertDialogs
          confirmHandler={deleteAccountHn}
          description="This permanently deletes your account, listings and booking information."
          data=""
          prompt="Delete Account"
        >
          <div className="my-4 rounded-md text-center">
            <button
              className={`flex w-full flex-row-reverse items-center justify-center gap-2 rounded-md bg-red-600 py-3 font-medium  text-white hover:bg-red-700 active:translate-y-[1.5px]`}
            >
              {isDeleting && <CircularProgress size={20} color="inherit" />}{" "}
              Delete Account
            </button>
          </div>
        </AlertDialogs>
      )}

      <div className="mb-8 mt-4 rounded-md border-2 border-gray-300 text-center">
        <Link
          href="/"
          className="flex w-full justify-center gap-3 py-3 font-medium text-gray-700"
        >
          Cancel
        </Link>
      </div>
    </BaseLayout>
  );
}

export default Update;
