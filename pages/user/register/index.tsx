import React from "react";
import Register from "@/components/auth/user/register";
import { getSession } from "next-auth/react";
import { IncomingMessage } from "http";
import Meta from "@/components/layout/meta";

function Index() {
  return (
    <div className="h-screen overflow-hidden">
      <Meta title="register" />
      <Register />
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

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}
