import React from "react";
import Profile from "@/components/auth/user/update";
import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import Meta from "@/components/layout/meta";

function Index(props: any) {
  return (
    <div className="h-screen overflow-hidden">
      <Meta title="update profile" />
      <Profile props={props} />
    </div>
  );
}

export default Index;

export async function getServerSideProps({
  req,
}: {
  req: IncomingMessage | undefined;
}) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...session,
    },
  };
}
