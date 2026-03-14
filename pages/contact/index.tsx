import Meta from "@/components/layout/meta";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { IconButton } from "@mui/material";
import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import { FaWhatsapp } from "react-icons/fa6";

export default function ContactPage(props: any) {
  return (
    <div className="mt-20 flex min-h-screen flex-col">
      <Meta title="Contact Us" />

      <Header {...props} />
      <section className="w-full flex-grow bg-[#e5e7eb] py-10 text-center text-gray-900">
        <h1 className="my-5 text-3xl font-semibold">Contact Us</h1>
        <p className="mx-10 font-serif text-lg leading-loose">
          You can contact us via WhatsApp.
        </p>
        <IconButton
          LinkComponent="a"
          href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
          target="_blank"
          className="!text-lg h-fit !bg-inherit font-medium !rounded-none cursor-pointer hover:bg-none"
        >
          WhatsApp Link{" "}
          <FaWhatsapp color="white" className="ml-2 h-7 w-7 md:h-10 md:w-10" />
        </IconButton>
      </section>
      <Footer />
    </div>
  );
}

export async function getServerSideProps({
  req,
}: {
  req: IncomingMessage | undefined;
}) {
  const session = await getSession({ req });

  return {
    props: {
      ...session,
    },
  };
}
