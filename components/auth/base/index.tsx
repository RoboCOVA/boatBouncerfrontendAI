import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { BoatImg } from "@/components/shared/icons/logo";
import { Avatar } from "@mui/material";
import ProfileUploadDialog from "@/components/shared/profileUploadDialog";
import { useSession } from "next-auth/react";
import Header from "@/components/shared/header";

function BaseLayout({
  children,
  action,
  prompt,
  step,
  setStep,
  mandatory,
  props,
}: {
  children: React.ReactNode;
  action: String;
  prompt: React.ReactNode | String;
  step?: number;
  setStep?: (step: number) => void;
  mandatory?: {
    errors: boolean;
    values: boolean;
  };
  props?: any;
}) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="h-screen overflow-hidden">
      <motion.div className="m-0 flex w-full flex-row items-center p-0">
        <div className="mt-20 grid h-screen max-h-screen flex-grow grid-cols-1 gap-0">
          <div className="flex flex-col gap-0  overflow-y-scroll [-ms-overflow-y-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
            <Header {...(props || {})} />
            <div className="mx-4 my-auto overflow-y-scroll [-ms-overflow-y-style:'none'] [scrollbar-width:'none'] md:mt-16 md:pt-10 [&::-webkit-scrollbar]:hidden">
              <div className="relative flex justify-center">
                <motion.div className="h-max w-max min-w-80 xs:min-w-96">
                  <motion.div className="my-5 flex flex-row items-center justify-between">
                    <motion.div className="w-full">
                      <motion.h1
                        className="mb-0.5 flex flex-row justify-between font-inter text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl"
                        variants={FADE_DOWN_ANIMATION_VARIANTS}
                      >
                        <Balancer>{action}</Balancer>
                      </motion.h1>
                      {typeof prompt === "string" ? (
                        <motion.p
                          className="mb-2 text-gray-500"
                          variants={FADE_DOWN_ANIMATION_VARIANTS}
                        >
                          <Balancer>{prompt}</Balancer>
                        </motion.p>
                      ) : (
                        <motion.div
                          variants={FADE_DOWN_ANIMATION_VARIANTS}
                          className="mb-2 text-gray-500"
                        >
                          <Balancer>{prompt}</Balancer>
                        </motion.div>
                      )}
                    </motion.div>
                    {action === "Update Profile" && (
                      <motion.div className="relative h-36 w-44">
                        <ProfileUploadDialog open={open} setOpen={setOpen}>
                          <>
                            <button
                              onClick={() => setOpen(true)}
                              className="absolute left-[0%] top-[-10%] z-10 mx-auto w-full cursor-pointer rounded border bg-slate-700 py-[1px] text-sm text-white opacity-80 sm:text-base"
                            >
                              {session?.profilePicture
                                ? "Change Photo"
                                : "Upload Photo"}
                            </button>

                            <Avatar
                              sx={{
                                height: "100%",
                                maxHeight: "144px",
                                maxWidth: "160px",
                                width: "100%",
                                cursor: "pointer",
                              }}
                              src={session?.profilePicture ?? ""}
                              onClick={() => setOpen(true)}
                            />
                          </>
                        </ProfileUploadDialog>
                      </motion.div>
                    )}
                  </motion.div>
                  {children}
                </motion.div>
              </div>
            </div>
          </div>
          <footer className="h-fit self-end">
            <div className="flex items-center pb-3 pl-3 pt-3 sm:pb-8 sm:pl-8">
              <p className="text-gray-500">&copy; boatbouncer</p>
            </div>
          </footer>
        </div>
        <div className="mt-20 hidden overflow-x-clip md:block md:w-1/2 xl:w-auto">
          <div className="relative hidden h-screen w-full md:block xl:w-auto">
            {BoatImg}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default BaseLayout;
