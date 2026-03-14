import Meta from "@/components/layout/meta";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";

export default function CareersPage(props: any) {
  return (
    <div className="mt-20 flex min-h-screen flex-col">
      <Meta title="Careers" />

      <Header {...props} />
      <section className="w-full flex-grow bg-[#e5e7eb] py-10 text-center text-gray-900">
        <h1 className="my-5 text-3xl font-semibold">Careers</h1>
        <p className="mx-10 font-serif text-lg leading-loose">
          There are no open vacancies at this moment.
        </p>
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
    }, // will be passed to the page component as props
  };
}
